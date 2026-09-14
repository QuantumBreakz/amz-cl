# Architecture

This repository is a Next.js storefront plus a framework-independent commerce backend.
The browser renders the Amazon-inspired shopping experience; `/api/v1` owns mutable
shopping state; `packages/backend` owns validation, authentication, authorization,
catalog invariants, order creation, and persistence.

**Stack:** Next.js 16.3.5 App Router · React 19 · strict TypeScript · plain CSS · Node
crypto · Playwright 1.61.

## 1. System shape

```text
Browser
  React StoreProvider + typed API client
                 │ JSON + HttpOnly cookies
                 ▼
Next.js /api/v1 route handlers
  HTTP parsing, cookies, origin guard, response envelope
                 │ typed method calls
                 ▼
@amazon-clone/backend
  auth, actor isolation, carts, wishlist, profile, orders, catalog
                 │
                 ▼
BackendDatabase
  memory in unit tests; atomic JSON file for the local demo
```

The static presentation catalog remains in `lib/catalog.json`. It gives server
components a zero-latency source for homepage, search, and product rendering. The same
catalog is injected into `CommerceBackend`, where it is authoritative for product IDs,
stock limits, unit prices, and order totals.

## 2. Monorepo boundaries

| Area | Responsibility |
|---|---|
| `app/` | App Router pages and thin `/api/v1` HTTP adapters |
| `components/` | Interactive UI and the client state facade |
| `lib/api-client.ts` | Typed browser transport and public API errors |
| `lib/server/` | Next.js cookies, origin checks, envelopes, and backend singleton |
| `lib/commerce.ts` | Pure display-side cart arithmetic retained for immediate optimistic totals |
| `packages/backend/` | Framework-independent domain service, validation, storage, and service tests |
| `tests/` | Pure commerce and HTTP route integration tests |
| `e2e/` | Real Chrome purchase journey through the UI and API |

`packages/backend` does not import React or Next.js. Route handlers translate HTTP into
service calls; they do not duplicate domain rules. This keeps backend rules testable
without starting a web server.

## 3. Identity and state

Every visitor receives an opaque guest ID in an `HttpOnly`, `SameSite=Lax` cookie.
Guest actors have isolated carts, wishlists, profile preferences, and orders. Registering
or signing in merges that guest state into the user account, then issues a separate
opaque session cookie.

Passwords are salted and hashed with Node's `scrypt`; plaintext passwords are never
persisted. Session tokens contain 32 random bytes. Only their SHA-256 hashes are stored,
and sessions expire after seven days. Logout removes the current token hash and clears
the browser cookie.

The public state returned to React is:

```ts
type CommerceState = {
  cart: CartLine[];
  saved: string[];
  orders: Order[];
  name: string;
  location: string;
  language: string;
  user: PublicUser | null;
};
```

No password hash, salt, or session token is part of this response.

## 4. Frontend data flow

`StoreProvider` requests `GET /api/v1/session` after hydration and exposes one context
to existing components. Cart, wishlist, profile, auth, and checkout actions call the
typed API client. There is no `localStorage` commerce state and therefore no competing
client-side source of truth.

Low-risk cart and wishlist interactions update optimistically so the interface responds
immediately. Mutations are serialized, then the complete server state replaces the
optimistic state. A failed request displays an error toast and fetches the session again.
Auth and checkout wait for queued mutations before proceeding, preventing a fast
add-to-cart followed by checkout from racing the cart write.

The client still computes the visible subtotal from catalog prices for instant feedback.
That value is display-only. Order placement ignores all client totals and snapshots
prices from the backend catalog.

## 5. HTTP contract

All endpoints are below `/api/v1`. Successes use `{ "data": ... }`; failures use
`{ "error": { "code", "message", "details"? } }`. Responses are `no-store`.

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Session | `GET /session` |
| Auth | `POST /auth/register`, `/auth/login`, `/auth/logout` |
| Catalog | `GET /catalog`, `GET /catalog/:id` |
| Cart | `GET/POST /cart`, `PATCH/DELETE /cart/:id` |
| Wishlist | `GET/POST /wishlist`, `DELETE /wishlist/:id` |
| Profile | `GET/PATCH /profile` |
| Orders | `GET/POST /orders`, `GET /orders/:id` |

Mutation requests with a foreign `Origin` are rejected. The check compares the browser
origin with the forwarded deployment host and protocol, so it remains correct behind a
reverse proxy. JSON handlers require `application/json`; bodies, parameters, quantities,
and pagination are validated before use.

The complete payload and status contract is in
[`docs/BACKEND.md`](./docs/BACKEND.md).

## 6. Commerce invariants

- Unknown products fail with `PRODUCT_NOT_FOUND`.
- Quantities are finite integers, floored when adding, removed at zero, and capped at
  catalog stock.
- Actors can only read their own cart, wishlist, profile, and orders.
- An unknown order returns 404 for both absence and another actor's order, avoiding an
  ownership oracle.
- Wishlist insertion is idempotent and saving an item removes it from the cart.
- Order totals use integer cents and server-side catalog prices.
- Order placement requires a 16–128 character idempotency key. Repeating a successful
  request with the same key returns the original order instead of duplicating it.
- Successful checkout snapshots unit prices and clears the actor's cart atomically.

## 7. Persistence

`BackendDatabase` keeps one versioned document in memory and writes mutations to a
temporary mode-0600 file followed by an atomic rename. The default local path is
`.data/backend.json`; `AMAZON_BACKEND_DATA_FILE` may override it; `:memory:` selects
memory-only storage. Tests reset an in-memory database or use `.data/e2e.json`.

This adapter is appropriate for a single-process technical demo. It does not provide
cross-process locking, replication, backups, migrations beyond document version 1, or
durable serverless storage. On Vercel it falls back to `/tmp`, which is ephemeral and
may differ between instances. A public multi-instance deployment must replace the
adapter with a durable transactional database while retaining the service interface.

## 8. Rendering and routes

Catalog-heavy pages remain server components: `/`, `/s`, `/dp/[id]`, `/deals`, and
`/help`. Commerce pages render client state after session hydration: `/cart`,
`/checkout`, `/orders`, `/order-confirmation`, `/account`, `/wishlist`, `/preferences`,
and `/ap/*`.

`app/layout.tsx` wraps the application in `StoreProvider` and `Shell`. Checkout and auth
routes use reduced chrome. Search filters remain encoded in the URL so filtered results
are shareable and browser history works.

## 9. Content and styling

The repository uses original unbranded product and campaign artwork under
`public/assets/original/`. Retired Amazon CDN reference files do not ship. Production
configuration fails the build if their old directory, manifest, URL host, or public path
returns. The complete supply chain is documented in
[`docs/CONTENT-SOURCING.md`](./docs/CONTENT-SOURCING.md).

The interface uses plain CSS with responsive breakpoints at 1100px, 900px, 760px, and
480px. Core measured tokens include the 60px primary header, 39px subnav, Amazon-style
nav colors, and the Arial-compatible font stack.

## 10. Verification

```bash
npm run typecheck   # strict TypeScript across app, backend, and tests
npm test            # pure commerce + backend service + HTTP integration tests
npm run test:e2e    # Chrome: guest cart → registration → checkout → orders
npm run build       # production compilation and route generation
```

The test layers are complementary. Service tests prove domain rules and actor isolation;
route tests prove cookies, status codes, envelopes, and endpoint composition; Playwright
proves that visible controls actually reach persisted server state and survive reload.

## 11. Agent capture tooling

`.claude/capture.py` records prompt and final-response events to an append-only JSONL
ledger under `.agent-logs/.ledger/`, then renders the human-readable log. The hook input
is treated as untrusted and session IDs are allowlisted before they become filenames.
See [`CAPTURE-TEST.md`](./CAPTURE-TEST.md) and
[`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md).

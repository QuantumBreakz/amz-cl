<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Amazon clone engineering brief

## Mission

Build and maintain a high-fidelity, end-to-end Amazon shopping demo owned by Ali Ahmed.
Treat the repository as a complete product: visual fidelity, accessibility, backend
correctness, frontend integration, tests, security, content provenance, and deployment
readiness all count. A screen that looks complete while its actions are local-only,
unvalidated, or disconnected from the backend is unfinished.

## Working method

1. Inspect the existing implementation and trace the complete user flow before editing.
2. Read the relevant bundled Next.js guide before using framework APIs.
3. Define the request, response, state transition, error states, and persistence behavior
   for every feature that crosses the frontend/backend boundary.
4. Keep domain rules in pure, unit-testable modules. Route handlers adapt HTTP requests;
   React components render state and invoke the typed client.
5. Implement loading, empty, success, validation, unauthorized, conflict, and server-error
   behavior where each state can occur.
6. Test the domain service, the HTTP contract, and at least one real browser journey for
   every critical commerce flow.
7. Run typecheck, unit/integration tests, the production build, and relevant browser tests
   before calling work complete.

## Repository boundaries

- `app/` and `components/`: Next.js web application and HTTP route adapters.
- `lib/`: frontend catalog helpers, the typed API client, and pure shared commerce logic.
- `packages/backend/`: framework-independent backend domain, validation, auth, persistence,
  and service tests.
- `tests/`: web/API integration tests.
- `e2e/`: Playwright journeys that prove UI actions reach backend state.
- `public/assets/original/`: deployable catalog and campaign imagery.
- `docs/`: architecture, security, API, and content-sourcing decisions.

Never restore `public/assets/reference/`, `lib/reference-assets.json`, Amazon CDN downloads,
or unlicensed product photography. Preserve required third-party license notices without
presenting their copyright holders as project contributors.

## Backend contract

- HTTP endpoints live below `/api/v1` and return `{ data }` on success or
  `{ error: { code, message, details? } }` on failure.
- Validate every untrusted request body, query, path parameter, cookie, and persisted
  record. Do not expose stack traces or internal paths in responses.
- Use opaque, hashed server sessions in `HttpOnly`, `SameSite=Lax` cookies. Never store a
  password or raw session token.
- Server code is authoritative for product existence, stock limits, prices, totals,
  ownership, and order creation. The client may update optimistically but must reconcile
  with the server response.
- Guest carts and wishlists must work before sign-in and merge into the signed-in account.
- Mutations must be deterministic under retries; order placement requires an idempotency
  key and may not create duplicate orders.
- Keep actor data isolated. An authenticated or guest actor may read only its own cart,
  wishlist, profile, and orders.

## Frontend integration bar

- Every product-facing API needs a real UI or server-rendering consumer. Operational
  endpoints such as health checks need a documented deployment consumer and direct tests.
- Do not leave `localStorage` as a second source of truth once a feature is server-backed.
- Preserve responsive layouts and optimistic feedback, then reconcile returned state.
- Disable duplicate submissions while a mutation is pending and surface actionable errors.
- Keep catalog navigation shareable through URLs and preserve existing route behavior.

## Test matrix

At minimum, cover:

- registration, duplicate registration, login, invalid credentials, logout, and session
  lookup;
- guest and authenticated actor isolation plus guest-state merge on authentication;
- cart add/update/remove, invalid products, quantity flooring, stock clamping, and totals;
- wishlist add/remove and moving a cart item to saved items;
- profile/location updates;
- order validation, authoritative totals, cart clearing, ownership, and idempotent retries;
- catalog list/search/filter/product-not-found responses;
- a browser journey from registration through product → cart → checkout → confirmation →
  order history, including persistence after reload.

## Definition of done

Work is complete only when behavior is implemented, wired into the real frontend, covered
at the correct test layers, visually checked at relevant breakpoints, documented, and
verified in a production build. Report the commands run and any remaining material
limitation. Do not describe planned or scaffold-only behavior as implemented.

## Reusable task prompts

### Full-stack feature

> Implement this feature end to end. First map the existing UI, domain state, API boundary,
> and persistence behavior. Define typed success and error responses, enforce authorization
> and server-side invariants, connect every visible action to the backend, and preserve
> optimistic UX with server reconciliation. Add domain tests, HTTP integration tests, and a
> Playwright journey covering the user-visible flow. Run typecheck, tests, production build,
> and visual verification before reporting completion.

### Fidelity repair

> Reproduce the target surface at the evaluator's viewport. Inventory structure, spacing,
> typography, assets, interactive states, loading and empty states, then compare a local
> screenshot at identical dimensions. Fix measured discrepancies without breaking backend
> behavior or accessibility. Verify navigation and mutations through the real API, run the
> regression suite, and report concrete before/after findings.

### Backend audit and completion

> Trace every frontend mutation and data read to its server implementation. Identify local-
> only state, missing validation, weak authorization, race conditions, retry hazards, stale
> responses, and untested error paths. Implement the missing backend behavior in the domain
> package and `/api/v1` adapters, migrate the frontend to the typed client, and prove actor
> isolation, authoritative totals, persistence, and idempotency with automated tests.

### Release readiness

> Audit the repository as a public deployment candidate. Verify secrets, cookies, headers,
> content licensing, production-only guards, dependency health, data persistence assumptions,
> accessibility, responsive overflow, internal links, API error handling, and test/build
> reproducibility. Fix concrete failures, document material limitations plainly, and finish
> with a clean production build and an end-to-end browser pass.

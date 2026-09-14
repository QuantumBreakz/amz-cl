# Backend contract

The backend is the `@amazon-clone/backend` workspace package plus thin Next.js Route
Handlers under `/api/v1`. It supports guest and authenticated shopping without a
separate process, while keeping domain code independent from Next.js.

## Running it

```bash
npm install
npm run dev
```

By default, mutable state is stored in `.data/backend.json`. Set
`AMAZON_BACKEND_DATA_FILE=/absolute/path/data.json` to choose another file or
`AMAZON_BACKEND_DATA_FILE=:memory:` for disposable state.

## Response format

Success:

```json
{ "data": {} }
```

Failure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Enter a valid quantity.",
    "details": { "quantity": "..." }
  }
}
```

`details` is optional. Internal exceptions are converted to a generic 500 response; no
stack trace or file path is returned.

## Endpoints

| Method and path | Request | Result |
|---|---|---|
| `GET /api/v1/health` | — | service health and catalog count |
| `GET /api/v1/session` | cookies | complete state for the current actor |
| `POST /api/v1/auth/register` | `{name,email,password}` | creates user, merges guest data, starts session |
| `POST /api/v1/auth/login` | `{email,password}` | verifies credentials, merges guest data, starts session |
| `POST /api/v1/auth/logout` | `{}` | invalidates current session and returns fresh guest state |
| `GET /api/v1/catalog` | `q`, `category`, `offset`, `limit` | filtered, paginated catalog result |
| `GET /api/v1/catalog/:id` | path ID | one product |
| `GET /api/v1/cart` | cookies | cart lines |
| `POST /api/v1/cart` | `{productId,quantity?,color?}` | adds to the existing line; 201 |
| `PATCH /api/v1/cart/:id` | `{quantity,color?}` | replaces a line quantity; zero removes it |
| `DELETE /api/v1/cart/:id` | — | removes line |
| `GET /api/v1/wishlist` | cookies | saved product IDs |
| `POST /api/v1/wishlist` | `{productId}` | saves product and removes it from cart; 201 |
| `DELETE /api/v1/wishlist/:id` | — | removes saved product |
| `GET /api/v1/profile` | cookies | name, location, language, and public user |
| `PATCH /api/v1/profile` | `{name?,location?,language?}` | updates actor profile |
| `GET /api/v1/orders` | cookies | actor's orders, newest first |
| `POST /api/v1/orders` | `{name,address,idempotencyKey}` | creates authoritative order; 201 |
| `GET /api/v1/orders/:id` | path ID | actor-owned order or 404 |

## Cookies and sessions

- `amazon_demo_guest`: one-year opaque guest identifier.
- `amazon_demo_session`: seven-day opaque authenticated session token.

Both are `HttpOnly`, `SameSite=Lax`, path `/`, and `Secure` in production. The database
stores only a SHA-256 digest of the session token. Password records contain a random
salt and a 64-byte `scrypt` digest.

## Error codes

| Code | Typical status | Meaning |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | malformed field, parameter, page, or quantity |
| `INVALID_JSON` | 400 | body is not valid JSON object |
| `INVALID_ORIGIN` | 403 | mutation originated from a different host |
| `INVALID_CREDENTIALS` | 401 | login failed without revealing which field matched |
| `PRODUCT_NOT_FOUND` | 404 | product does not exist |
| `ORDER_NOT_FOUND` | 404 | order absent or owned by another actor |
| `EMAIL_IN_USE` | 409 | normalized email is already registered |
| `EMPTY_CART` | 409 | checkout attempted without cart lines |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | JSON endpoint did not receive `application/json` |
| `INTERNAL_ERROR` | 500 | unexpected failure with a safe public message |

## Retry and ownership behavior

Cart and wishlist mutations reconcile from the returned complete state. Checkout waits
for earlier client mutations and sends a UUID idempotency key. The key maps to the first
successful order within that actor only. A retry cannot create a second order.

Guest IDs and user IDs form separate actor namespaces. Authentication merges the current
guest cart, wishlist, orders, idempotency map, and non-default location into the user;
the guest record is then removed. Order detail always queries the resolved actor.

## Persistence limits

The bundled JSON adapter serializes mutations in one Node process and atomically replaces
the file. It is not a distributed database. `/tmp` on Vercel is ephemeral, so data can
disappear on cold starts and different instances can see different documents. For a
durable public deployment, implement the same `BackendDatabase` boundary with a
transactional database and shared session store, then add migrations, backups, rate
limiting, password-reset/email-verification flows, and operational monitoring.

## Tests

`npm test` exercises pure cart arithmetic, every domain workflow, and Route Handlers with
real cookies and request bodies. `npm run test:e2e` launches the app in Chrome and proves
the visible cart, registration, reload, checkout, confirmation, order history, and final
server state as one journey. `npm run test:all` runs both suites.

# Architecture

End-to-end description of how this application is built: rendering model, data flow,
state, routing, styling, and the agent-capture tooling that ships alongside it.

**Stack:** Next.js 16.3.5 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
plain CSS · zero runtime dependencies beyond `next`, `react`, `react-dom` and
`lucide-react` for icons.

---

## 1. The headline: there is no backend

This is the single most important architectural fact, and it shapes everything else.

There is **no server, no database, no API layer, and no authentication service**. The
"backend" is two things:

1. **A static JSON catalog** (`lib/catalog.json`, 191 products / 18 categories) imported
   at build time and inlined into the bundle.
2. **The user's own browser**, via `localStorage`, which holds cart, saved items, orders,
   display name and delivery location.

Next.js still renders on the server — routes are server components that read the
catalog and stream HTML — but there is no persistence tier and no cross-user state.
Two people using the deployed site share nothing.

```
┌──────────────────────── build time ─────────────────────────┐
│  lib/catalog.json ──imported──> bundle (no fetch at runtime) │
└──────────────────────────────────────────────────────────────┘
                               │
┌──────────────────── request (server) ───────────────────────┐
│  app/**/page.tsx  (server components)                        │
│    read catalog, filter/sort/paginate, render HTML           │
└──────────────────────────────────────────────────────────────┘
                               │ HTML + RSC payload
┌──────────────────── browser (client) ───────────────────────┐
│  StoreProvider hydrates from localStorage                    │
│  client components handle cart, auth-ish, modals, carousels  │
│  all mutations write back to localStorage                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Rendering model — the server/client split

The split is deliberate and follows one rule: **anything that depends on the catalog
renders on the server; anything that depends on the user renders on the client.**

### Server components (no `"use client"`)

Every `app/**/page.tsx` is a server component. They read the catalog, do the filtering
work, and pass plain serialisable props down.

| Route | Rendering | Why |
|---|---|---|
| `/` | Static | No request-varying input |
| `/s` | **Dynamic** | Reads `searchParams` (query, filters, sort, page) |
| `/dp/[id]` | **Dynamic** | Route param → `productById`, `notFound()` on miss |
| `/help` | **Dynamic** | Reads `?topic=` |
| `/order-confirmation` | **Dynamic** | Reads `?id=` |
| `/deals` | **Dynamic** | Reads `?tab=` for the deal-category filters |
| `/cart`, `/checkout`, `/orders`, `/account`, `/wishlist`, `/preferences`, `/ap/*` | Static shell | Content comes from client state after hydration |

`next build` reports **15 routes: 10 prerendered static (`○`), 5 server-rendered on
demand (`ƒ`)** — the dynamic five being `/s`, `/dp/[id]`, `/help`, `/order-confirmation`
and `/deals`. (The build also logs "16/16 static pages", which counts generated pages
including `/_not-found`, not routes — the two numbers are not the same thing.)

### Client components (`"use client"`)

All 11 live in `components/`. They own interactivity and user state:

| Component | Lines | Responsibility |
|---|---|---|
| `product-detail.tsx` | 551 | Gallery, swatches, buy box, comparison table, Q&A, reviews |
| `shell.tsx` | 536 | Header, search + suggestions, account popover, department drawer, location modal, mobile header, footer |
| `account.tsx` | 332 | Auth pages, account grid, wishlist, preferences |
| `checkout.tsx` | 265 | Address form, validation, order placement |
| `cart.tsx` | 238 | Line items, selection, saved-for-later, recommendations |
| `store.tsx` | 218 | The state container (see §3) |
| `orders.tsx` | 155 | Order history and confirmation |
| `home.tsx` | 112 | Hero carousel, 20 card modules, rails, department strip |
| `product-row.tsx` | 81 | Search-results row (list layout) |
| `brand-filter.tsx` | 38 | Expandable brand facet ("See more") |
| `search-sort.tsx` | 28 | Sort dropdown that rewrites `?sort=` via `useRouter` |

The twelfth file in `components/`, **`ui.tsx` (78 lines)**, is deliberately *not* a client
component — it has no hooks, so it renders on either side. It holds the shared primitives
`Price`, `Stars`, `ProductCard` and `abbreviateCount`. That split matters because
`product-row.tsx` (client) imports from it, and a circular dependency was avoided by
putting `abbreviateCount` there rather than the reverse.

---

## 3. State: a single hydration-aware store

`components/store.tsx` is the whole state layer — React Context over `useState`, no
Redux, no Zustand.

### Shape

The **persisted** state — the object that round-trips through `localStorage`:

```ts
{ cart: CartLine[], saved: string[], orders: Order[], name: string, location: string }
```

The **context surface** consumers actually see is that object spread flat, plus derived
values, lifecycle flags, the notification channel, and seven actions:

```ts
{ ...state,
  ready: boolean,                        // hydration complete — see below
  total: number, count: number,          // derived, memoised
  toast: string, notify(msg),            // transient notifications
  add, quantity, save, unsave, login, setLocation, placeOrder }
```

### The hydration contract (this is the subtle part)

`localStorage` cannot be read during SSR. So the store:

1. Initialises to a **fixed default** (empty cart, `location: "Pakistan"`) so server and
   first client render agree — no hydration mismatch.
2. Reads `localStorage` in a `useEffect` and calls `setState`.
3. Flips `ready: true`.

Consumers **must** gate on `ready` — `/cart` and `/checkout` render a loading state
until then, which is why their raw SSR HTML contains no `<h1>`.

**This contract is a live footgun, and it caused two real bugs in this codebase.** Any
component doing `useState(store.something)` captures the *pre-hydration default*, because
`useState` initialisers run once on first render. Both `Preferences` and `Checkout` did
exactly that. In Preferences it was data-losing: the form showed the default while the
real stored value was different, and saving wrote the stale default back over it. The
fix in both cases is to adopt the value in an effect once `ready` flips:

```ts
useEffect(() => { if (store.ready) setCountry(store.location); }, [store.ready, store.location]);
```

### Persistence and validation

Every state change writes the whole object back to `localStorage` under
`amazon-assignment-v1`. On read, **everything is re-validated against the catalog**,
because `localStorage` is fully user-controlled:

- `cart` → `validCart()` re-runs each line through `setQuantity`, dropping unknown ids and clamping quantities to `[0, stockQuantity]`
- `saved` → filtered to ids that exist
- `orders` → shape-checked (`id`, `total`, `name`, `address`, `date`, `lines`), lines re-validated
- `name` / `location` → type-checked strings

**Prices are never read from persisted state.** Totals always recompute from the catalog,
so a forged price in `localStorage` cannot change what the cart says.

One failure mode is surfaced rather than swallowed: if the `setItem` write throws (quota
exceeded, or Safari private mode), the store pushes a message through the toast channel
below telling the user to keep the tab open, instead of silently losing their cart.

### Transient notifications (the toast channel)

The store owns a small notification channel alongside the persisted state. It is part of
the store rather than a separate provider because almost every trigger is already a store
action.

```ts
toast: string          // "" when nothing is showing
notify: (msg: string) => void
```

- **Rendered by `StoreProvider` itself**, not by any page — a single `role="status"` node
  so screen readers announce it, fixed-position via `.toast`.
- **Self-clearing.** A `useEffect` keyed on `toast` sets a 3.5s timer and returns
  `clearTimeout` as cleanup, so rapid successive messages reset the timer instead of
  stacking orphaned ones.
- **Two internal triggers:** `add()` ("Added to Cart") and `save()` ("Saved for later").
- **Five external callers** use `notify()` directly — copy-link in `cart.tsx`, the promo
  code and tracking/review buttons in `checkout.tsx` and `orders.tsx`, and preference
  saving in `account.tsx`. It is how the demo's deliberately-inert controls stay honest:
  they say *"Tracking isn't available in this demo"* rather than doing nothing.

### Context identity

The provider's value is memoised — derived values (`total`, `count`) in `useMemo`, all
seven actions in `useCallback`, and the returned object in a final `useMemo`. Without
this the value was a fresh object literal every render and **every** consumer re-rendered
on any state change. The actions can have genuinely empty dependency arrays because they
all use the functional `setState` form and never close over current state.

The one exception is `placeOrder`, which must return the new order id *synchronously*
(checkout redirects on it). It reads the cart from a ref that an effect keeps in sync,
rather than from the `setState` updater — which React may run later, and which made the
function return `null`. See `FRONTEND-AUDIT.md` FE-01/FE-02.

---

## 4. Commerce logic — the one pure, tested module

`lib/commerce.ts` (57 lines) holds all cart arithmetic and is the only unit-tested code
(`tests/commerce.test.ts`, 3 tests). It is pure — no React, no storage, no I/O — which is
exactly why it is testable.

| Function | Contract |
|---|---|
| `setQuantity(lines, id, qty, catalog, color?)` | Clamps to `[0, stockQuantity]`, floors, removes at 0, drops unknown ids, and rejects non-finite quantities (`NaN`/`Infinity` leave the cart untouched) |
| `subtotalCents(lines, catalog)` | **Integer cents** — `round(price*100) * qty` — avoids float drift |
| `validCart(value, catalog)` | Sanitises arbitrary JSON from storage by re-running every entry through `setQuantity` |
| `money(amount)` | `Intl.NumberFormat` USD formatter |

Money is handled in integer cents throughout and only converted to a float for display.
The module also exports the `CartLine` and `ProductPrice` types; `ProductPrice` is
deliberately narrower than `Product` (`id`, `price`, `stockQuantity` only), so the
arithmetic cannot accidentally depend on catalog presentation fields.

---

## 5. Data layer

`lib/catalog.ts` is a 9-line re-export over the JSON plus three helpers:

```ts
products, categories, banners
productById(id)            // Array.find
productUrl(id)             // `/dp/${id}`
searchUrl(q, category)     // `/s?k=…&category=…`  (encodeURIComponent'd)
```

**Product schema** (191 entries):

```ts
{ id, name, price, originalPrice, categoryId, subCategoryId, category, subCategory,
  images: string[], description, inStock, stockQuantity, rating, ratingCount, brand,
  isDeal, isBestseller }
```

`Product` is *inferred* from the JSON (`typeof products[number]`) rather than hand-written,
so the type cannot drift from the data.

`banners` is exported for completeness but **nothing currently consumes it** — it is a
leftover key in `catalog.json`, not a live part of the data flow.

**Images** are local files under `public/assets/` — no external CDN, no hotlinking, which
is also why the CSP can be `img-src 'self'`.

### How the catalog was authored (and why §12 still says "frozen")

`scripts/expand-catalog.py` is a **dev-time authoring script, run manually**. It is not
imported by the app, not referenced by any `package.json` script, and not part of the
build or deploy path — `next build` never executes it. Its job was one-off: copy observed
reference images into `public/assets/reference/`, write the asset-mapping JSON, and add
hand-authored product rows to `lib/catalog.json`.

It **regenerates rather than appends**, which matters if anyone is tempted to re-run it:
it deletes every `ref-*` product, re-creates them from a literal table in the script, and
rebuilds the entire `categories` array by deriving departments and sub-categories from
whatever products remain. Hand edits to `ref-*` entries would not survive.

It is also **not reproducible on a fresh clone**: it reads an absolute path to an
ephemeral local browser-session manifest under `/var/folders/…`, so it functions as a
record of how the fixture data was produced rather than a tool a reviewer can re-run.

So it is not a counter-example to §12's "catalog is frozen at build time". That limit is
about the *running application*: there is no runtime admin surface and no user-facing way
to add or edit a product. Changing the catalog still means editing JSON in the repo and
redeploying — whether a human or this script does the editing.

---

## 6. Search, filtering and pagination

All server-side in `app/s/page.tsx`, driven entirely by URL state — every filter is a
link, so results are shareable and back/forward works.

```
/s?k=&category=&min=&max=&brand=&rating=&deal=&sort=&page=
```

Pipeline: **filter → sort → paginate** (16/page, matching Amazon).

Filters compose as AND. `min`/`max` give true price *ranges* — an earlier version applied
only `max`, so the "$25 to $50" bucket wrongly returned everything under $50.

Two client islands punctuate the server page: `search-sort.tsx` (rewrites `?sort=` via
`useRouter`) and `brand-filter.tsx` (expands the brand list past 10). Everything else is
static links.

---

## 7. Routing map

```
/                       home — hero carousel, 20 card modules, rails, department strip
/s                      search / PLP — filter rail + horizontal result rows + pagination
/dp/[id]                product detail — gallery, buy box, comparison, Q&A, reviews
/cart                   cart — selection, saved-for-later, recommendations
/checkout               address + demo payment, places order
/order-confirmation     post-order receipt (?id=), doubles as "view order details"
/orders                 order history
/account                account hub
/wishlist               saved list
/preferences            language + country
/deals                  Today's Deals with working tab filters
/help                   help topics (?topic=), with alias resolution
/ap/signin, /ap/register  demo auth
+ not-found.tsx (global) and dp/[id]/not-found.tsx (product-specific)
```

`app/layout.tsx` wraps everything in `StoreProvider` → `Shell`. `Shell` hides the header
and footer on `/checkout` and `/ap/*`, matching Amazon's reduced chrome on those pages.

---

## 8. Styling

Plain CSS, no framework, no CSS-in-JS, no CSS modules. Three stylesheets, all imported
from the root layout, 2,978 lines total:

| File | Lines | Purpose |
|---|---:|---|
| `app/globals.css` | 2,751 | Design tokens, layout, every page's core styling |
| `app/search-fidelity.css` | 159 | Search result rows and pagination |
| `app/mobile-fidelity.css` | 68 | Mobile header, promo rail, subnav overrides |

Design tokens live in `:root` and were taken from live amazon.com by extracting computed
styles, not by eye:

```css
--nav: #131921;   /* header, exact match */
--nav2: #232f3e;  /* subnav, exact match */
--orange: #ff9900;  --yellow: #ffd814;  --link: #007185;
font-family: "Amazon Ember", Arial, sans-serif;
```

**Breakpoints:** `1100px` (tablet/small desktop), `900px` (header compaction), `760px`
(mobile layout), `480px` (phone). The split at 900px exists because the full desktop
header needs 838px of content and overflowed at iPad-portrait width.

Responsive strategy is CSS-toggle, not JS: both desktop and mobile header markup render,
and media queries show one. That avoids client-side viewport detection, which would
cause hydration mismatches in SSR.

---

## 9. Verification approach

Worth documenting as architecture because it shaped the code.

| Check | Command / method |
|---|---|
| Types | `npm run typecheck` (`tsc --noEmit`, strict) |
| Commerce logic | `npm test` (3 tests over `lib/commerce.ts`) |
| Build | `npm run build` — 15 routes (see §2) |
| Horizontal overflow | `document.documentElement.scrollWidth > clientWidth` in-browser |
| Overlay / z-index bugs | `elementFromPoint` hit-test on every heading/link/button, scrolled across the full page |
| Orphaned CSS | cross-reference every `className` in source against defined selectors |
| Fidelity | extract computed CSS from live amazon.com, diff numerically |

The `scrollWidth` check caught a self-inflicted regression (a 6-column grid that broke
mobile) that visual review had missed.

---

## 10. Build and deployment

- **No environment variables. No secrets. No external services.** The app is fully
  self-contained, which is why deployment is a one-liner.
- Runtime dependencies are exactly four: `next`, `react`, `react-dom`, `lucide-react`.
  `npm audit --omit=dev` reports 0 vulnerabilities.
- `next.config.ts` sets security headers (`X-Frame-Options`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS) and disables `X-Powered-By`.
  CSP is **production-only** — Next's dev server needs `eval` and an HMR websocket, and
  loosening the policy that far would defeat it. See `SECURITY-AUDIT.md` SEC-02.
- `npm start` binds all interfaces, so container hosts (Railway, Render, Fly) work
  without extra flags. An earlier `--hostname 127.0.0.1` would have made a deployed
  instance unreachable.

```bash
npx vercel --prod          # or: npm run build && npm start
```

---

## 11. Agent capture tooling

Ships in the repo and runs automatically; documented here because it is part of the
system, not an afterthought.

```
.claude/settings.json   hook registration (UserPromptSubmit, Stop)
.claude/capture.py      append-only capture
.claude/backfill.py     one-off recovery from a session transcript
.agent-logs/.ledger/    JSONL — append-only source of truth
.agent-logs/*.md        human-readable, re-rendered from the ledger
```

Two events: `UserPromptSubmit` captures the prompt from stdin; `Stop` receives the
transcript path and walks it backwards collecting assistant text until it reaches the
user turn — skipping thinking blocks and tool calls, so only the prompt and final
response are stored.

The JSONL ledger is append-only and the Markdown is a **projection** of it, never edited
in place. That separation is what makes "the log is unmodified" a structural property
rather than a promise.

See `CAPTURE-TEST.md` for verification and `SECURITY-AUDIT.md` SEC-01/SEC-04 for the
security properties of this tooling.

---

## 12. Known architectural limits

Stated plainly rather than buried:

- **No real auth.** "Signing in" sets a display name string. There are no credentials, no
  sessions, no access control. Any client can set any name.
- **No server-side authority.** Prices and stock are client-visible static data. A real
  storefront must compute totals and reserve inventory server-side.
- **Single-device state.** `localStorage` means a cart does not follow a user across
  devices or browsers, and clearing site data destroys order history.
- **Catalog is frozen at build time.** Adding a product means editing JSON and
  redeploying; there is no runtime admin surface and no user-facing way to add or edit
  one. (`scripts/expand-catalog.py` is a manual dev-time authoring script outside the
  build path, not an exception to this — see §5.)
- **Some product attributes are absent**, so category-specific facets Amazon offers
  (Connectivity, Battery Life, Water Resistance) are not implemented. Inventing those
  fields across 191 products would be fabricated depth rather than real capability.

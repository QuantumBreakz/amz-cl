# Codebase Snapshot

> **Historical snapshot.** This file was generated before the 2026-09-15 content-
> sourcing update and is retained as a review artifact. It is not regenerated
> automatically. Current repository files, especially `docs/CONTENT-SOURCING.md`, are
> authoritative when this snapshot differs from them.

Full verbatim dump of every hand-written source file, in the order a reviewer
should read them: configuration, then data, then state, then shell, then UI,
then routes, then styles, then tests and tooling.

**Generated:** 2026-09-14 · **Branch:** `main` · **HEAD:** `6a180cc Document the frontend audit` · **Commits:** 11

## What is and isn't dumped here

| | |
|---|---|
| **Verbatim** | every `.ts` / `.tsx` / `.css` / `.py` file, plus build config |
| **Summarized** | large generated data files (schema + sample record + counts) |
| **Listed only** | 285 binary image assets under `public/`, and the audit/README markdown files that exist as their own documents |

Summarized and listed files are named explicitly below with their paths, so
nothing is silently omitted.

## Inventory

- **346** tracked files total — **60** source, **285** static assets, 1 binary (`app/favicon.ico`)
- **16,988** lines of tracked source (including generated data)

| Extension | Files | Lines |
|---|---:|---:|
| `.tsx` | 29 | 3,214 |
| `.json` | 9 | 7,464 |
| `.md` | 8 | 2,622 |
| `.ts` | 5 | 179 |
| `.py` | 3 | 444 |
| `.css` | 3 | 2,981 |
| `.jsonl` | 1 | 51 |
| `(none)` | 1 | 11 |
| `.txt` | 1 | 22 |

## Directory tree

```
├── .agent-logs/
│   ├── .ledger/
│   │   └── b66f2d37-f1e7-4272-b409-faa97e31ab7b.jsonl
│   └── 2026-09-12_23-53-11_b66f2d37.md
├── .claude/
│   ├── backfill.py
│   ├── capture.py
│   ├── launch.json
│   └── settings.json
├── app/
│   ├── account/
│   │   └── page.tsx
│   ├── ap/
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── signin/
│   │       └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── deals/
│   │   └── page.tsx
│   ├── dp/
│   │   └── [id]/
│   │       ├── not-found.tsx
│   │       └── page.tsx
│   ├── help/
│   │   └── page.tsx
│   ├── order-confirmation/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── preferences/
│   │   └── page.tsx
│   ├── s/
│   │   └── page.tsx
│   ├── wishlist/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── mobile-fidelity.css
│   ├── not-found.tsx
│   ├── page.tsx
│   └── search-fidelity.css
├── components/
│   ├── account.tsx
│   ├── brand-filter.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   ├── home.tsx
│   ├── orders.tsx
│   ├── product-detail.tsx
│   ├── product-row.tsx
│   ├── search-sort.tsx
│   ├── shell.tsx
│   ├── store.tsx
│   └── ui.tsx
├── docs/
│   ├── MartsTech-LICENSE.txt
│   ├── asset-sources.json
│   └── reference-assets.json
├── lib/
│   ├── catalog.json
│   ├── catalog.ts
│   ├── commerce.ts
│   └── reference-assets.json
├── scripts/
│   └── expand-catalog.py
├── tests/
│   └── commerce.test.ts
├── .gitignore
├── AGENTS.md
├── ARCHITECTURE.md
├── CAPTURE-TEST.md
├── CLAUDE.md
├── FRONTEND-AUDIT.md
├── README.md
├── SECURITY-AUDIT.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
public/                         (285 static assets — 243 reference images, 42 product/category images)
```

## Contents

- [Configuration & build](#configuration-build)
- [Data layer](#data-layer)
- [State container](#state-container)
- [App shell & layout](#app-shell-layout)
- [Shared UI primitives](#shared-ui-primitives)
- [Pages: routes](#pages-routes)
- [Page components](#page-components)
- [Stylesheets](#stylesheets)
- [Tests](#tests)
- [Scripts & agent tooling](#scripts-agent-tooling)
- [Reference documentation](#reference-documentation)

---

## Configuration & build

### `package.json`

*26 lines*

```json
{
  "name": "amazon-assignment",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --hostname 127.0.0.1",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "tsx --test tests/commerce.test.ts"
  },
  "dependencies": {
    "next": "^16.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.577.0"
  },
  "devDependencies": {
    "tsx": "^4.20.6",
    "typescript": "^5.9.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0"
  }
}
```

### `tsconfig.json`

*36 lines*

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "components/**/*.tsx",
    "lib/**/*.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "references", "tests"]
}
```

### `next.config.ts`

*54 lines*

```ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The app ships no security headers by default, so a deployed instance is
 * framable and has no CSP. Nothing here loads third-party scripts or styles,
 * so the policy can be tight: self only, plus the inline styles/scripts Next
 * emits for hydration.
 */
const baseHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * CSP is applied in production only. Next's dev server needs eval() for React's
 * debugging tooling and a websocket for HMR, and loosening the policy enough to
 * permit both would weaken the very thing being tested. Production is what gets
 * deployed and what the policy is written for.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next injects inline bootstrap scripts and styles during hydration.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = isDev
  ? baseHeaders
  : [...baseHeaders, { key: "Content-Security-Policy", value: contentSecurityPolicy }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
```

### `next-env.d.ts`

*8 lines*

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

### `.gitignore`

*11 lines*

```
node_modules/
.next/
references/
.env*
!.env.example
*.tsbuildinfo

# python bytecode from capture hooks
__pycache__/
*.pyc
```

### `AGENTS.md`

*10 lines*

```markdown
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

### `CLAUDE.md`

*2 lines*

```markdown
@AGENTS.md
```

---

## Data layer

### `lib/catalog.ts`

*10 lines*

```ts
import catalog from "./catalog.json";
export const products = catalog.products;
export const categories = catalog.categories;
export const banners = catalog.banners;
export type Product = (typeof products)[number];
export const productById = (id: string) => products.find((p) => p.id === id);
export const productUrl = (id: string) => `/dp/${id}`;
export const searchUrl = (q = "", category = "") =>
  `/s?k=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ""}`;
```

### `lib/commerce.ts`

*58 lines*

```ts
export type CartLine = { id: string; quantity: number; color?: string };
export type ProductPrice = { id: string; price: number; stockQuantity: number };
export function setQuantity(
  lines: CartLine[],
  id: string,
  quantity: number,
  catalog: ProductPrice[],
  color?: string,
): CartLine[] {
  const product = catalog.find((p) => p.id === id);
  if (!product || !Number.isFinite(quantity)) return lines;
  const next = Math.min(
    product.stockQuantity,
    Math.max(0, Math.floor(quantity)),
  );
  const remaining = lines.filter((line) => line.id !== id);
  if (!next) return remaining;
  const existing = lines.find((line) => line.id === id);
  return existing
    ? lines.map((line) =>
        line.id === id
          ? { ...line, quantity: next, color: color ?? line.color }
          : line,
      )
    : [...remaining, { id, quantity: next, color }];
}
export function subtotalCents(lines: CartLine[], catalog: ProductPrice[]) {
  return lines.reduce(
    (sum, line) =>
      sum +
      Math.round((catalog.find((p) => p.id === line.id)?.price ?? 0) * 100) *
        line.quantity,
    0,
  );
}
export function validCart(value: unknown, catalog: ProductPrice[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartLine[]>((result, line) => {
    if (
      !line ||
      typeof line.id !== "string" ||
      typeof line.quantity !== "number"
    )
      return result;
    return setQuantity(
      result,
      line.id,
      line.quantity,
      catalog,
      typeof line.color === "string" ? line.color : undefined,
    );
  }, []);
}
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
```

### `lib/catalog.json`

*4,435 lines*

> Summarized — machine-generated or bulk data.

The product catalog: **191 products** across **18 categories**.

Per-product fields: `brand`, `category`, `categoryId`, `description`, `id`, `images`, `inStock`, `isBestseller`, `isDeal`, `name`, `originalPrice`, `price`, `rating`, `ratingCount`, `stockQuantity`, `subCategory`, `subCategoryId`

Sample record:

```json
{
  "id": "1",
  "name": "JBL Tune 520BT - Wireless On-Ear Headphones, Up to 57H Battery Life and Speed Charge, Lightweight, Comfortable and Foldable Design, Hands-Free Calls with Voice Aware",
  "price": 39.98,
  "originalPrice": 69.98,
  "categoryId": "1",
  "subCategoryId": "1-3",
  "category": "Electronics",
  "subCategory": "Audio",
  "images": [
    "/assets/product-1-0.webp",
    "/assets/product-1-1.webp"
  ],
  "description": "The JBL Tune 520BT headphones stream powerful JBL Pure Bass sound for up to 57 hours, thanks to the latest 5.3 BT technology. Quickly rechargeable, they sit comfortably on your head even after hours of listening pleasure. With a flat-folding design, the JBL Tune 520BT easily fits in your backpack to follow you everywhere.",
  "inStock": true,
  "stockQuantity": 50,
  "rating": 4,
  "ratingCount": 3,
  "brand": "JBL",
  "isDeal": true,
  "isBestseller": true
}
```

| Category | Products |
|---|---:|
| Electronics | 38 |
| Kitchen & Dining | 31 |
| Clothing, Shoes & Jewelry | 29 |
| Sports & Outdoors | 27 |
| Home & Kitchen | 16 |
| Computers | 10 |
| Tools & Home Improvement | 7 |
| Toys & Games | 6 |
| Baby | 5 |
| Automotive | 5 |
| Arts & Crafts | 5 |
| Health & Household | 4 |
| Luggage & Travel | 2 |
| Office Products | 2 |
| Beauty & Personal Care | 1 |
| Pet Supplies | 1 |
| Books | 1 |
| Video Games | 1 |

Other top-level keys: `banners`

### `lib/reference-assets.json`

*245 lines*

> Summarized — machine-generated or bulk data.

JSON object with **243** keys.

Sample entries:

```json
{
  "nav-sprite-global-1x-reorg-privacy._CB779528203_.png": "/assets/reference/a131eec97c81ff48.png",
  "61gkmopG9gL._SX1500_.jpg": "/assets/reference/ab366241126dbbb4.jpg",
  "Home_Flip_Summer_2024_316_HP_NewArrivals_QuadCard_D_02_1x._SY116_CB555960040_.jpg": "/assets/reference/d821da00440eec1c.jpg",
  "Home_Flip_Summer_2024_315_HP_NewArrivals_QuadCard_D_01_1x._SY116_CB555960040_.jpg": "/assets/reference/4caab0b1d3f3ed6f.jpg"
}
```

---

## State container

### `components/store.tsx`

*219 lines*

```tsx
"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { products } from "@/lib/catalog";
import {
  CartLine,
  setQuantity,
  subtotalCents,
  validCart,
} from "@/lib/commerce";
export type Order = {
  id: string;
  date: string;
  lines: CartLine[];
  total: number;
  name: string;
  address: string;
};
type State = {
  cart: CartLine[];
  saved: string[];
  orders: Order[];
  name: string;
  location: string;
};
const initial: State = {
  cart: [],
  saved: [],
  orders: [],
  name: "",
  location: "Pakistan",
};
function useCommerceState() {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem("amazon-assignment-v1") || "null",
      );
      if (raw && typeof raw === "object")
        setState({
          cart: validCart(raw.cart, products),
          saved: Array.isArray(raw.saved)
            ? raw.saved.filter(
                (id: unknown) =>
                  typeof id === "string" && products.some((p) => p.id === id),
              )
            : [],
          orders: Array.isArray(raw.orders)
            ? raw.orders
                .filter(
                  (o: Order) =>
                    o &&
                    typeof o.id === "string" &&
                    typeof o.total === "number" &&
                    // name/address are rendered directly; a non-string here
                    // (crafted localStorage) would throw during render.
                    typeof o.name === "string" &&
                    typeof o.address === "string" &&
                    typeof o.date === "string" &&
                    Array.isArray(o.lines),
                )
                .map((o: Order) => ({
                  ...o,
                  lines: validCart(o.lines, products),
                }))
            : [],
          name: typeof raw.name === "string" ? raw.name : "",
          location:
            typeof raw.location === "string" ? raw.location : "Pakistan",
        });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("amazon-assignment-v1", JSON.stringify(state));
      } catch {
        setToast(
          "Your browser could not save changes. Keep this tab open to continue.",
        );
      }
  }, [state, ready]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  // Derived values recompute only when the cart changes. subtotalCents does a
  // catalog lookup per line, so this ran O(lines x catalog) on every render.
  const total = useMemo(
    () => subtotalCents(state.cart, products) / 100,
    [state.cart],
  );
  const count = useMemo(
    () => state.cart.reduce((n, l) => n + l.quantity, 0),
    [state.cart],
  );

  // Stable identities: every action uses the functional setState form, so none
  // of them need to close over current state and none need to be re-created.
  const add = useCallback((id: string, qty = 1, color?: string) => {
    setState((s) => ({
      ...s,
      cart: setQuantity(
        s.cart,
        id,
        (s.cart.find((l) => l.id === id)?.quantity ?? 0) + qty,
        products,
        color,
      ),
    }));
    setToast("Added to Cart");
  }, []);

  const quantity = useCallback((id: string, qty: number) => {
    setState((s) => ({ ...s, cart: setQuantity(s.cart, id, qty, products) }));
  }, []);

  const save = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      saved: [...new Set([...s.saved, id])],
      cart: s.cart.filter((l) => l.id !== id),
    }));
    setToast("Saved for later");
  }, []);

  const unsave = useCallback((id: string) => {
    setState((s) => ({ ...s, saved: s.saved.filter((x) => x !== id) }));
  }, []);

  const login = useCallback((name: string) => {
    setState((s) => ({ ...s, name }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setState((s) => ({ ...s, location }));
  }, []);

  // placeOrder must return the new id *synchronously* — the checkout redirects on
  // it. So it cannot be computed inside the setState updater, which React may run
  // later. A ref tracks the latest cart instead: fresh data, stable identity, and
  // a synchronous return.
  const cartRef = useRef(state.cart);
  useEffect(() => {
    cartRef.current = state.cart;
  }, [state.cart]);

  const placeOrder = useCallback((name: string, address: string) => {
    const cart = cartRef.current;
    if (!cart.length) return null;
    const order: Order = {
      id: `113-${Date.now().toString().slice(-7)}-${Math.floor(
        Math.random() * 10000000,
      )
        .toString()
        .padStart(7, "0")}`,
      date: new Date().toISOString(),
      lines: cart.map((x) => ({ ...x })),
      total: subtotalCents(cart, products) / 100,
      name,
      address,
    };
    setState((s) => ({ ...s, cart: [], orders: [order, ...s.orders] }));
    return order.id;
  }, []);

  return useMemo(
    () => ({
      ...state,
      ready,
      toast,
      notify: setToast,
      total,
      count,
      add,
      quantity,
      save,
      unsave,
      login,
      setLocation,
      placeOrder,
    }),
    [state, ready, toast, total, count, add, quantity, save, unsave, login, setLocation, placeOrder],
  );
}
const Store = createContext<ReturnType<typeof useCommerceState> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useCommerceState();
  return (
    <Store.Provider value={store}>
      {children}
      {store.toast && (
        <div className="toast" role="status">
          ✓ {store.toast}
        </div>
      )}
    </Store.Provider>
  );
}
export function useStore() {
  const s = useContext(Store);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}
```

---

## App shell & layout

### `app/layout.tsx`

*23 lines*

```tsx
import type { Metadata } from "next";
import { StoreProvider } from "@/components/store";
import { Shell } from "@/components/shell";
import "./globals.css";
import "./search-fidelity.css";
import "./mobile-fidelity.css";
export const metadata: Metadata = {
  title: "Amazon.com. Spend less. Smile more.",
  description:
    "Explore deals, discover products, and try a complete demo shopping experience.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
```

### `components/shell.tsx`

*537 lines*

```tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  X,
  Globe,
  ChevronRight,
} from "lucide-react";
import { products, searchUrl, categories } from "@/lib/catalog";
import { useStore } from "./store";
export function Modal({
  title,
  onClose,
  children,
  drawer = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${drawer ? "department-drawer" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <b>{title}</b>
        <button aria-label="Close dialog" onClick={onClose}>
          <X size={22} />
        </button>
      </header>
      <div className="modal-content">{children}</div>
    </dialog>
  );
}
const departments = ["All", ...categories.map(c => c.name)];
export function Header() {
  const s = useStore(),
    router = useRouter(),
    path = usePathname();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [focus, setFocus] = useState(false),
    [active, setActive] = useState(-1),
    [drawer, setDrawer] = useState(false),
    [location, setLocation] = useState(false),
    [country, setCountry] = useState("Pakistan"),
    [zip, setZip] = useState(""),
    [account, setAccount] = useState(false);
  const [department, setDepartment] = useState("");
  const [showAppBanner, setShowAppBanner] = useState(true);
  const suggestions = [
    ...new Set(
      products
        .filter((p) => `${p.name} ${p.category} ${p.subCategory}`.toLowerCase().includes(query.toLowerCase()) && (category === "All" || p.category === category))
        .map((p) => p.name),
    ),
  ].slice(0, 5);
  useEffect(() => {
    setFocus(false);
    setAccount(false);
    setDrawer(false);
  }, [path]);
  function submit(e: FormEvent) {
    e.preventDefault();
    setFocus(false);
    router.push(searchUrl(query, category === "All" ? "" : category));
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      {showAppBanner && (
        <div className="app-banner">
          <span>Fast. Easy. Shop in our free App today</span>
          <button aria-label="Dismiss" onClick={() => setShowAppBanner(false)}>
            ✕
          </button>
        </div>
      )}
      <header className="header">
        <Link className="logo header-item" href="/" aria-label="Amazon home">
          <img src="/assets/amazon-logo-light.svg" alt="" />
        </Link>
        <button
          className="location header-item"
          onClick={() => setLocation(true)}
        >
          <MapPin size={19} />
          <span>
            <small>Deliver to</small>
            <strong>{s.location}</strong>
          </span>
        </button>
        <form
          className={`search-box ${focus ? "focused" : ""}`}
          onSubmit={submit}
        >
          <select
            aria-label="Search department"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {departments.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <div className="search-input-wrap">
            <input
              placeholder="Search Amazon"
              aria-label="Search Amazon"
              value={query}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 150)}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setFocus(false);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, suggestions.length - 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, -1));
                }
                if (e.key === "Enter" && active >= 0) {
                  e.preventDefault();
                  setQuery(suggestions[active]);
                  setFocus(false);
                  router.push(searchUrl(suggestions[active]));
                }
              }}
              autoComplete="off"
              role="combobox"
              aria-expanded={
                focus && query.length > 0 && suggestions.length > 0
              }
              aria-controls="search-suggestions"
              aria-activedescendant={
                active >= 0 ? `suggestion-${active}` : undefined
              }
            />
            {query && (
              <button
                className="clear-search"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
            {focus && query && suggestions.length > 0 && (
              <ul
                className="suggestions"
                id="search-suggestions"
                role="listbox"
              >
                {suggestions.map((x, i) => (
                  <li
                    key={x}
                    id={`suggestion-${i}`}
                    role="option"
                    aria-selected={active === i}
                  >
                    <button
                      type="button"
                      className={active === i ? "selected" : ""}
                      onClick={() => {
                        setQuery(x);
                        setFocus(false);
                        router.push(searchUrl(x));
                      }}
                    >
                      <Search size={18} />
                      {x}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="search-button" aria-label="Search">
            <Search size={27} />
          </button>
        </form>
        <button
          className="language header-item"
          onClick={() => router.push("/preferences")}
        >
          <span>🇺🇸</span>
          <strong>EN</strong>
          <ChevronDown size={12} />
        </button>
        <div
          className="account-wrap"
          onMouseEnter={() => setAccount(true)}
          onMouseLeave={() => setAccount(false)}
        >
          <button
            className="account header-item"
            aria-expanded={account}
            onClick={() => setAccount(!account)}
          >
            <small>Hello, {s.name || "sign in"}</small>
            <strong>
              Account & Lists <ChevronDown size={12} />
            </strong>
          </button>
          {account && (
            <div className="account-popover">
              <Link className="yellow-button" href={s.name ? "/account" : "/ap/signin"}>
                {s.name ? "Your account" : "Sign in"}
              </Link>
              <p>
                New customer? <Link href="/ap/register">Start here.</Link>
              </p>
              <div className="account-columns">
                <div>
                  <h3>Your Lists</h3>
                  <Link href="/wishlist">Shopping List</Link>
                  <Link href="/wishlist">Saved for later</Link>
                </div>
                <div>
                  <h3>Your Account</h3>
                  <Link href="/account">Your Account</Link>
                  <Link href="/orders">Your Orders</Link>
                  <Link href="/wishlist">Your Lists</Link>
                  {s.name && (
                    <button
                      onClick={() => {
                        s.login("");
                        setAccount(false);
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Link href="/orders" className="orders-link header-item">
          <small>Returns</small>
          <strong>& Orders</strong>
        </Link>
        <Link className="cart-link header-item" href="/cart">
          <span className="cart-icon">
            <b>{s.count}</b>
            <ShoppingCart size={39} strokeWidth={1.7} />
          </span>
          <strong>Cart</strong>
        </Link>
        <button
          className="header-item hamburger-button"
          aria-label="Open menu"
          onClick={() => {
            setDrawer(true);
            setDepartment("");
          }}
        >
          <Menu size={22} />
        </button>
      </header>
      <nav className="subnav" aria-label="Main navigation">
        <button onClick={() => {setDrawer(true);setDepartment("");}}>
          <Menu size={22} />
          <b>All</b>
        </button>
        {[
          ["Prime Video", "/help?topic=Prime%20Video"],
          ["Coupons", "/deals?tab=Coupons"],
          ["Customer Service", "/help?topic=Customer%20Service"],
          ["Today's Deals", "/deals"],
          ["Registry", "/help?topic=Registry"],
          ["Gift Cards", "/help?topic=Gift%20Cards"],
          ["Sell", "/help?topic=Sell"],
          ["Disability Customer Support", "/help?topic=Customer%20Service"],
        ].map(([label, href]) => (
          <Link key={label} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <button className="mobile-location-bar" onClick={() => setLocation(true)}>
        <MapPin size={16} /> Deliver to {s.location} <ChevronDown size={12} />
      </button>
      {drawer && (
        <Modal
          drawer
          title={`Hello, ${s.name || "sign in"}`}
          onClose={() => setDrawer(false)}
        >
          <div className="drawer-content">
            {department ? <><button className="drawer-back" onClick={()=>setDepartment("")}>← MAIN MENU</button><h3>{department}</h3><Link href={searchUrl("",department)} onClick={()=>setDrawer(false)}>Shop all {department}</Link>{categories.find(c=>c.name===department)?.subCategories.map(sub=><Link key={sub.id} href={searchUrl(sub.name,department)} onClick={()=>setDrawer(false)}>{sub.name}<ChevronRight size={18}/></Link>)}</> : <>
            <h3>Trending</h3>
            {["Best Sellers", "New Releases", "Movers & Shakers"].map((x) => (
              <Link href="/deals" onClick={() => setDrawer(false)} key={x}>
                {x}
                <ChevronRight size={18} />
              </Link>
            ))}
            <hr />
            <h3>Shop by Department</h3>
            {categories.map((x) => (
              <button
                key={x.name}
                onClick={() => setDepartment(x.name)}
              >
                {x.name}
                <ChevronRight size={18} />
              </button>
            ))}
            <hr />
            <h3>Help & Settings</h3>
            <Link href="/account">Your Account</Link>
            <Link href="/help">Customer Service</Link>
            <Link href="/ap/signin">Sign in</Link>
            </>}
          </div>
        </Modal>
      )}
      {location && (
        <Modal title="Choose your location" onClose={() => setLocation(false)}>
          <p className="muted">
            Delivery options and delivery speeds may vary for different
            locations
          </p>
          <Link
            href="/ap/signin"
            className="yellow-button"
            onClick={() => setLocation(false)}
          >
            Sign in to see your addresses
          </Link>
          <p className="divider-label">or enter a US zip code</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (/^\d{5}$/.test(zip)) {
                s.setLocation(`US ${zip}`);
                setLocation(false);
              }
            }}
          >
            <div className="zip-row">
              <input
                aria-label="US ZIP code"
                pattern="[0-9]{5}"
                required
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP code"
              />
              <button className="outline-button">Apply</button>
            </div>
          </form>
          <p className="divider-label">or ship outside the US</p>
          <select
            aria-label="Delivery country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {[
              "Pakistan",
              "United States",
              "United Kingdom",
              "Canada",
              "India",
              "United Arab Emirates",
              "Australia",
              "Germany",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            className="yellow-button"
            onClick={() => {
              s.setLocation(country);
              setLocation(false);
            }}
          >
            Done
          </button>
        </Modal>
      )}
    </>
  );
}
const footers = [
  [
    "Get to Know Us",
    "Careers",
    "Blog",
    "About Amazon",
    "Investor Relations",
    "Amazon Devices",
    "Amazon Science",
  ],
  [
    "Make Money with Us",
    "Sell products on Amazon",
    "Sell on Amazon Business",
    "Sell apps on Amazon",
    "Become an Affiliate",
    "Advertise Your Products",
    "Self-Publish with Us",
    "Host an Amazon Hub",
  ],
  [
    "Amazon Payment Products",
    "Amazon Business Card",
    "Shop with Points",
    "Reload Your Balance",
    "Amazon Currency Converter",
  ],
  [
    "Let Us Help You",
    "Your Account",
    "Your Orders",
    "Shipping Rates & Policies",
    "Returns & Replacements",
    "Manage Your Content and Devices",
    "Help",
  ],
];
export function Footer() {
  return (
    <footer>
      <button
        className="back-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
      <div className="footer-columns">
        {footers.map(([title, ...links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map((x) => (
              <Link
                key={x}
                href={
                  x === "Your Orders"
                    ? "/orders"
                    : x === "Your Account"
                      ? "/account"
                      : `/help?topic=${encodeURIComponent(x)}`
                }
              >
                {x}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-locale">
        <Link href="/" aria-label="Amazon home">
          <img src="/assets/amazon-logo-light.svg" alt="amazon" />
        </Link>
        <Link href="/preferences">
          <Globe size={16} /> English
        </Link>
        <span>$ USD - U.S. Dollar</span>
        <span>🇺🇸 United States</span>
      </div>
      <div className="footer-bottom">
        <div className="footer-services">
          {[
            ["Amazon Music", "Stream millions of songs"],
            ["Amazon Ads", "Reach customers wherever they spend their time"],
            ["6pm", "Score deals on fashion brands"],
            ["AbeBooks", "Books, art & collectibles"],
            ["ACX", "Audiobook Publishing Made Easy"],
            ["Sell on Amazon", "Start a Selling Account"],
            ["Amazon Business", "Everything For Your Business"],
          ].map(([a, b]) => (
            <Link key={a} href={`/help?topic=${a}`}>
              <b>{a}</b>
              <span>{b}</span>
            </Link>
          ))}
        </div>
        <div>
          <Link href="/help?topic=Conditions of Use">Conditions of Use</Link>
          <Link href="/help?topic=Privacy Notice">Privacy Notice</Link>
          <Link href="/help?topic=Consumer Health Data Privacy Disclosure">
            Consumer Health Data Privacy Disclosure
          </Link>
          <Link href="/help?topic=Your Ads Privacy Choices">
            Your Ads Privacy Choices
          </Link>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates</p>
        <small>Independent educational storefront. Demo orders only.</small>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const compact = path.startsWith("/ap/") || path === "/checkout";
  return compact ? (
    <main id="main">{children}</main>
  ) : (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
```

---

## Shared UI primitives

### `components/ui.tsx`

*79 lines*

```tsx
import Link from "next/link";
import { Product, productUrl } from "@/lib/catalog";
// amazon.com abbreviates review counts past 1,000 as e.g. "74.1K"
export function abbreviateCount(count: number) {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}K`;
}
export function Price({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [whole, cents] = value.toFixed(2).split(".");
  return (
    <span className={`price ${className}`} aria-label={`$${value.toFixed(2)}`}>
      <sup>$</sup>
      {whole}
      <sup>{cents}</sup>
    </span>
  );
}
export function Stars({ rating = 4.5 }: { rating?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}
export function ProductCard({
  product: p,
  deal = false,
}: {
  product: Product;
  deal?: boolean;
}) {
  return (
    <article className="product-card">
      <Link className="product-image" href={productUrl(p.id)}>
        <img src={p.images[0]} alt={p.name} loading="lazy" />
      </Link>
      <div className="product-card-copy">
        {deal && (
          <div className="deal-label">
            <span>
              {Math.round((1 - p.price / p.originalPrice) * 100)}% off
            </span>{" "}
            Limited time deal
          </div>
        )}
        <Link className="product-title" href={productUrl(p.id)}>
          {p.name}
        </Link>
        <div>
          <Stars rating={p.rating} />
          <span className="link-text ratings">
            {" "}
            {abbreviateCount(p.ratingCount)}
          </span>
        </div>
        <Link href={productUrl(p.id)} className="price-link">
          <Price value={p.price} />
        </Link>
        <div className="muted">
          List: <s>${p.originalPrice.toFixed(2)}</s>
        </div>
        <div className="prime">
          ✓<b>prime</b>
        </div>
        <div className="delivery-small">FREE delivery on eligible orders</div>
      </div>
    </article>
  );
}
```

### `components/product-row.tsx`

*82 lines*

```tsx
"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { productUrl } from "@/lib/catalog";
import { abbreviateCount, Price, Stars } from "./ui";
import { useStore } from "./store";

function boughtInPastMonth(ratingCount: number) {
  if (ratingCount > 1000)
    return `${Math.round(ratingCount / 1000)}K+ bought in past month`;
  if (ratingCount > 100) return "100+ bought in past month";
  return "";
}

export function ProductRow({
  product,
  rank,
}: {
  product: Product;
  rank: number;
}) {
  const store = useStore();
  const bought = boughtInPastMonth(product.ratingCount);
  const isClothing = product.category === "Clothing, Shoes & Jewelry";
  return (
    <article className="product-row">
      <Link href={productUrl(product.id)} className="product-row-image">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-row-body">
        {rank === 0 && product.isBestseller && (
          <span className="overall-pick-badge">Overall Pick</span>
        )}
        {product.isDeal && <span className="sponsored-label">Sponsored</span>}
        <Link href={productUrl(product.id)} className="product-row-title">
          {product.name}
        </Link>
        <div className="product-row-meta">
          <Stars rating={product.rating} />
          <span className="link-text ratings">
            {" "}
            ({abbreviateCount(product.ratingCount)})
          </span>
        </div>
        {bought && <div className="bought-count">{bought}</div>}
        <div>
          <Price value={product.price} />
          {product.originalPrice > product.price && (
            <span className="muted">
              {" "}
              <s>${product.originalPrice.toFixed(2)}</s>
            </span>
          )}
        </div>
        <div className="prime">
          ✓<b>prime</b>
        </div>
        {isClothing ? (
          <div className="row-swatches">
            {["Black", "Blue", "White"].map((value) => (
              <span key={value} className="row-swatch">
                {value}
              </span>
            ))}
            <Link href={productUrl(product.id)} className="outline-button">
              See options
            </Link>
          </div>
        ) : (
          <button
            className="outline-button"
            onClick={() => store.add(product.id, 1)}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
```

### `components/brand-filter.tsx`

*39 lines*

```tsx
"use client";
import Link from "next/link";
import { useState } from "react";

const VISIBLE_COUNT = 10;

export default function BrandFilter({
  brands,
}: {
  brands: { value: string; href: string; active: boolean }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? brands : brands.slice(0, VISIBLE_COUNT);
  const hidden = brands.length - VISIBLE_COUNT;
  return (
    <section>
      <h3>Brands</h3>
      {visible.map((brand) => (
        <Link
          key={brand.value}
          className={brand.active ? "active" : ""}
          href={brand.href}
        >
          □ {brand.value}
        </Link>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="link-text see-more-brands"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "See less" : `See more (${hidden})`}
        </button>
      )}
    </section>
  );
}
```

### `components/search-sort.tsx`

*29 lines*

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchSort({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <label>
      Sort by:{" "}
      <select
        value={value}
        onChange={(event) => {
          const next = new URLSearchParams(searchParams.toString());
          if (event.target.value === "featured") next.delete("sort");
          else next.set("sort", event.target.value);
          router.push(`${pathname}?${next.toString()}`);
        }}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Avg. Customer Review</option>
      </select>
    </label>
  );
}
```

---

## Pages: routes

### `app/account/page.tsx`

*3 lines*

```tsx
import { Account } from "@/components/account";
export default Account;
```

### `app/ap/register/page.tsx`

*5 lines*

```tsx
import { AuthPage } from "@/components/account";
export default function Page() {
  return <AuthPage register />;
}
```

### `app/ap/signin/page.tsx`

*5 lines*

```tsx
import { AuthPage } from "@/components/account";
export default function Page() {
  return <AuthPage />;
}
```

### `app/cart/page.tsx`

*3 lines*

```tsx
import CartPage from "@/components/cart";
export default CartPage;
```

### `app/checkout/page.tsx`

*3 lines*

```tsx
import Checkout from "@/components/checkout";
export default Checkout;
```

### `app/deals/page.tsx`

*76 lines*

```tsx
import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/ui";

const TABS = [
  "All Deals",
  "Lightning Deals",
  "Customers’ Most-Loved",
  "Outlet",
  "Coupons",
] as const;

function discountOf(product: { price: number; originalPrice: number }) {
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export default async function Deals({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.includes(tab as (typeof TABS)[number])
    ? (tab as (typeof TABS)[number])
    : "All Deals";
  const deals = products
    .filter((p) => p.isDeal)
    .filter((p) => {
      if (active === "Lightning Deals") return discountOf(p) >= 40;
      if (active === "Customers’ Most-Loved")
        return p.isBestseller || p.rating >= 4.5;
      if (active === "Outlet") return p.price < 25;
      if (active === "Coupons") return discountOf(p) >= 10 && discountOf(p) < 40;
      return true;
    });
  return (
    <div className="deals-page">
      <div className="deals-hero">
        <h1>Today&apos;s Deals</h1>
        <p>Great savings. Every day.</p>
      </div>
      <div className="deal-filters">
        <b>Today&apos;s Deals</b>
        {TABS.map((x) => (
          <Link
            className={active === x ? "active" : ""}
            href={x === "All Deals" ? "/deals#deals" : `/deals?tab=${encodeURIComponent(x)}#deals`}
            key={x}
          >
            {x}
          </Link>
        ))}
      </div>
      <section id="deals">
        <h2>
          {active} <span className="deal-count">({deals.length})</span>
        </h2>
        {deals.length ? (
          <div className="deals-grid">
            {deals.map((product) => (
              <ProductCard product={product} deal key={product.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No deals in this category right now</h3>
            <Link className="yellow-button" href="/deals">
              See all deals
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
```

### `app/dp/[id]/not-found.tsx`

*13 lines*

```tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Looking for something?</h1>
      <p>We're sorry. The product you requested is no longer available.</p>
      <Link className="yellow-button" href="/">
        Go to Amazon home
      </Link>
    </div>
  );
}
```

### `app/dp/[id]/page.tsx`

*15 lines*

```tsx
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { productById } from "@/lib/catalog";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
```

### `app/help/page.tsx`

*139 lines*

```tsx
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
const topics = [
  ["Your Orders", "Track or cancel orders"],
  ["Returns & Refunds", "Exchange or return items"],
  ["Payment Settings", "Add or edit payment methods"],
  ["Manage Addresses", "Update your delivery locations"],
  ["Prime", "Manage your membership"],
  ["Security & Privacy", "Protect your account"],
];
const articles: Record<string, string[]> = {
  returns: [
    "Most items in this demo show a 30-day return window on the order and order-confirmation pages, mirroring how Amazon frames its real return policy.",
    "Because this is a portfolio project, choosing \"Buy it again\" or opening an order never triggers a real refund or replacement — the return window is shown for realism only.",
    "If you're looking for the real Amazon return center, this demo doesn't connect to it; everything here stays local to your browser.",
  ],
  prime: [
    "Prime membership on the real Amazon bundles fast shipping, Prime Video streaming, and other perks into one subscription.",
    "This project reproduces the look of those Prime touchpoints — badges, banners, and account links — but there is no membership to join and nothing is ever charged.",
    "Any \"Prime Video\" or \"Prime\" link you followed to get here is for visual fidelity only.",
  ],
  conditions: [
    "On amazon.com, the Conditions of Use lay out the legal terms for using the site and making purchases.",
    "This project is a front-end clone built for demonstration purposes, so no real conditions of use apply and no agreement is formed by browsing it.",
    "Nothing you do here, including creating a demo account or placing a demo order, creates a binding relationship with anyone.",
  ],
  privacy: [
    "The real Amazon's Privacy Notice explains what customer data it collects and how it's used.",
    "This demo is far simpler: your cart, saved items, demo orders, and display name are written to your browser's local storage under one key and never leave your device.",
    "There's no account database, no analytics, and no third-party sharing — clearing your browser's site data erases everything this app has stored.",
  ],
  "customer service": [
    "On a real retail site, Customer Service is where you'd reach a support agent by chat, phone, or email.",
    "This help center is the extent of support in this demo — use the search box above or browse a topic tile to find the answer you're after.",
    "There's no live chat or phone line behind this page, since no real orders or accounts exist to support.",
  ],
  "gift cards": [
    "Amazon gift cards can normally be bought, sent, or redeemed toward a balance on an account.",
    "In this demo, gift cards are illustrative only — the \"Learn more\" link from your cart brings you here rather than to a real redemption flow.",
    "No balance is issued or tracked, and the promo/gift card field at checkout does not apply a real discount.",
  ],
  shipping: [
    "Delivery dates shown throughout this demo, like the estimate on the checkout and order pages, are placeholders meant to resemble a real Amazon order timeline.",
    "No item is actually packed or shipped — placing a demo order simply saves it to your browser so you can review it under Your Orders.",
  ],
  secure: [
    "The real Amazon encrypts payment details end-to-end during checkout.",
    "This demo goes a step further and never collects payment information at all — the checkout page states this directly, and \"Place your order\" only stores a demo order locally.",
  ],
};
const topicAliases: Record<string, string> = {
  returns: "returns",
  "returns & refunds": "returns",
  "returns & replacements": "returns",
  prime: "prime",
  "prime video": "prime",
  conditions: "conditions",
  "conditions of use": "conditions",
  privacy: "privacy",
  "privacy notice": "privacy",
  "customer service": "customer service",
  gifts: "gift cards",
  "gift cards": "gift cards",
  shipping: "shipping",
  secure: "secure",
};
function articleFor(topic: string) {
  return articles[topicAliases[topic.trim().toLowerCase()]] ?? null;
}
export default async function Help({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const article = topic ? articleFor(topic) : null;
  return (
    <div className="help-page">
      <div className="help-hero">
        <h1>Hello. What can we help you with?</h1>
        <form action="/help">
          <Search />
          <input
            name="topic"
            defaultValue={topic}
            placeholder="Search our help library"
          />
        </form>
      </div>
      {topic ? (
        <section className="help-article">
          <div className="breadcrumbs">
            <Link href="/help">Help</Link>
            <span>›</span>
            <span>{topic}</span>
          </div>
          <h2>{topic}</h2>
          {article ? (
            article.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : (
            <>
              <p>
                This demo reproduces the customer-facing Amazon help experience. For
                this assignment, all checkout, account, shipping, and order actions
                stay safely inside your browser.
              </p>
              <h2>Quick answers</h2>
              <p>
                You can explore the storefront, search and filter products, add
                items to the cart, place a demo order, and view it under Your
                Orders. No real purchase or account is created.
              </p>
            </>
          )}
          <Link href="/help">Browse all help topics</Link>
        </section>
      ) : (
        <section className="help-topics">
          <h2>Some things you can do here</h2>
          <div>
            {topics.map(([title, copy]) => (
              <Link
                href={`/help?topic=${encodeURIComponent(title)}`}
                key={title}
              >
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ChevronRight />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

### `app/not-found.tsx`

*14 lines*

```tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <div className="dog-illustration">🐕</div>
      <h1>Sorry! We couldn't find that page.</h1>
      <p>Try searching or return to the Amazon home page.</p>
      <Link className="yellow-button" href="/">
        Amazon home
      </Link>
    </div>
  );
}
```

### `app/order-confirmation/page.tsx`

*10 lines*

```tsx
import { OrderConfirmation } from "@/components/orders";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id = "" } = await searchParams;
  return <OrderConfirmation id={id} />;
}
```

### `app/orders/page.tsx`

*3 lines*

```tsx
import { Orders } from "@/components/orders";
export default Orders;
```

### `app/page.tsx`

*3 lines*

```tsx
import Home from "@/components/home";
export default Home;
```

### `app/preferences/page.tsx`

*3 lines*

```tsx
import { Preferences } from "@/components/account";
export default Preferences;
```

### `app/s/page.tsx`

*249 lines*

```tsx
import Link from "next/link";
import { products, searchUrl } from "@/lib/catalog";
import { ProductRow } from "@/components/product-row";
import SearchSort from "@/components/search-sort";
import BrandFilter from "@/components/brand-filter";

const PAGE_SIZE = 16;

type Query = {
  k?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  brand?: string;
  rating?: string;
  deal?: string;
  page?: string;
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const term = (query.k || "").trim().toLowerCase();
  const category = query.category || "";
  const min = Number(query.min || 0);
  const max = Number(query.max || 0);
  const brand = query.brand || "";
  const rating = Number(query.rating || 0);
  let results = products.filter(
    (product) =>
      (!term ||
        `${product.name} ${product.brand} ${product.subCategory}`
          .toLowerCase()
          .includes(term)) &&
      (!category ||
        product.category
          .toLowerCase()
          .startsWith(category.toLowerCase().replace(/s$/, ""))) &&
      (!brand || product.brand === brand) &&
      (!min || product.price >= min) &&
      (!max || product.price <= max) &&
      (!query.deal || product.isDeal) &&
      (!rating || product.rating >= rating),
  );
  if (query.sort === "price-asc")
    results = [...results].sort((a, b) => a.price - b.price);
  if (query.sort === "price-desc")
    results = [...results].sort((a, b) => b.price - a.price);
  if (query.sort === "rating")
    results = [...results].sort((a, b) => b.rating - a.rating);
  const href = (changes: Query) =>
    searchUrl(
      changes.k ?? query.k ?? "",
      changes.category ?? query.category ?? "",
    ) +
    `${(changes.min ?? query.min) ? `&min=${changes.min ?? query.min}` : ""}${(changes.max ?? query.max) ? `&max=${changes.max ?? query.max}` : ""}${(changes.sort ?? query.sort) ? `&sort=${changes.sort ?? query.sort}` : ""}${(changes.brand ?? query.brand) ? `&brand=${encodeURIComponent(changes.brand ?? query.brand ?? "")}` : ""}${(changes.rating ?? query.rating) ? `&rating=${changes.rating ?? query.rating}` : ""}${(changes.deal ?? query.deal) ? `&deal=${changes.deal ?? query.deal}` : ""}${changes.page ? `&page=${changes.page}` : ""}`;
  const brands = [
    ...new Set(
      products
        .filter(
          (p) =>
            !category ||
            p.category
              .toLowerCase()
              .startsWith(category.toLowerCase().replace(/s$/, "")),
        )
        .map((p) => p.brand),
    ),
  ];
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(query.page || 1) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageResults = results.slice(start, start + PAGE_SIZE);
  return (
    <div className="search-page">
      <div className="result-bar">
        <span>
          {results.length
            ? `${start + 1}-${start + pageResults.length} of ${results.length.toLocaleString()} results for`
            : "No results for"}
        </span>
        <b>“{query.k || category || "all products"}”</b>
        <SearchSort value={query.sort || "featured"} />
      </div>
      <div className="search-layout">
        <aside className="filters">
          <section>
            <h3>Department</h3>
            <Link href={searchUrl(query.k)}>‹ Any Department</Link>
            <Link
              className={!category ? "active" : ""}
              href={searchUrl(query.k)}
            >
              All
            </Link>
            <Link
              className={category === "Electronics" ? "active" : ""}
              href={href({ category: "Electronics" })}
            >
              Electronics
            </Link>
            <Link
              className={category === "Fashions" ? "active" : ""}
              href={href({ category: "Fashions" })}
            >
              Clothing, Shoes & Jewelry
            </Link>
          </section>
          <section>
            <h3>Customer Reviews</h3>
            {[4, 3, 2, 1].map((value) => (
              <Link
                key={value}
                className={rating === value ? "active" : ""}
                href={href({ rating: String(value) })}
              >
                <span className="stars">
                  {"★".repeat(value)}
                  {"☆".repeat(5 - value)}
                </span>{" "}
                & Up
              </Link>
            ))}
          </section>
          <section>
            <h3>Price</h3>
            <Link
              className={!min && max === 25 ? "active" : ""}
              href={href({ min: "", max: "25" })}
            >
              Under $25
            </Link>
            <Link
              className={min === 25 && max === 50 ? "active" : ""}
              href={href({ min: "25", max: "50" })}
            >
              $25 to $50
            </Link>
            <Link
              className={min === 50 && max === 125 ? "active" : ""}
              href={href({ min: "50", max: "125" })}
            >
              $50 to $125
            </Link>
            <Link
              className={min === 125 && !max ? "active" : ""}
              href={href({ min: "125", max: "" })}
            >
              $125 &amp; Above
            </Link>
            <Link href={href({ min: "", max: "" })}>Clear price</Link>
          </section>
          <section>
            <h3>Deals &amp; Discounts</h3>
            <Link
              className={!query.deal ? "active" : ""}
              href={href({ deal: "" })}
            >
              All Discounts
            </Link>
            <Link
              className={query.deal ? "active" : ""}
              href={href({ deal: "1" })}
            >
              Today&apos;s Deals
            </Link>
          </section>
          <BrandFilter
            brands={brands.map((value) => ({
              value,
              href: href({ brand: value }),
              active: brand === value,
            }))}
          />
        </aside>
        <section className="results">
          <h1>Results</h1>
          <p className="muted">
            Check each product page for other buying options.
          </p>
          {results.length ? (
            <>
              <div className="results-list">
                {pageResults.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    rank={start + index}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Search results pages">
                  <Link
                    className={`page-step ${page === 1 ? "disabled" : ""}`}
                    href={href({ page: String(Math.max(1, page - 1)) })}
                    aria-disabled={page === 1}
                  >
                    ← Previous
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === totalPages ||
                        Math.abs(n - page) <= 2,
                    )
                    .map((n, i, arr) => (
                      <span key={n}>
                        {i > 0 && arr[i - 1] !== n - 1 && (
                          <span className="page-gap">…</span>
                        )}
                        <Link
                          className={n === page ? "current" : ""}
                          href={href({ page: String(n) })}
                          aria-current={n === page ? "page" : undefined}
                        >
                          {n}
                        </Link>
                      </span>
                    ))}
                  <Link
                    className={`page-step ${page === totalPages ? "disabled" : ""}`}
                    href={href({ page: String(Math.min(totalPages, page + 1)) })}
                    aria-disabled={page === totalPages}
                  >
                    Next →
                  </Link>
                </nav>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h2>No results for “{query.k}”</h2>
              <p>Try checking your spelling or use more general terms.</p>
              <Link className="yellow-button" href="/s?k=">
                Browse all products
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

### `app/wishlist/page.tsx`

*3 lines*

```tsx
import { Wishlist } from "@/components/account";
export default Wishlist;
```

---

## Page components

### `components/home.tsx`

*113 lines*

```tsx
"use client";
import { memo, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products, productUrl, searchUrl, categories, productById } from "@/lib/catalog";
import artwork from "@/lib/reference-assets.json";
import { ProductCard } from "./ui";
import { useStore } from "./store";
const fallbackImage = "/assets/categories-3.jpg";
function fromCatalog(id: string) { return productById(id)?.images[0] || fallbackImage; }
const patchedArtwork: Record<string, string> = {
  ...artwork,
  Fuji_SingleImageCard_BTS_SH26: fromCatalog("ref-58"),
  Fuji_Gaming_SingleImageCard_C: fromCatalog("ref-76"),
  DQC_APR_TBYB_W_BOTTOMS: fromCatalog("15"),
  DQC_APR_TBYB_W_TOPS: fromCatalog("13"),
  DQC_APR_TBYB_W_DRESSES: fromCatalog("18"),
  DQC_APR_TBYB_W_SHOES: fromCatalog("ref-32"),
  Fuji_QuadCard_Bag: fromCatalog("ref-58"),
  Fuji_QuadCard_Electronics: fromCatalog("ref-55"),
  Fuji_QuadCard_Stationery: fromCatalog("ref-60"),
  Fuji_QuadCard_Fashion: fromCatalog("ref-23"),
  "313wAT6Iy2L": fromCatalog("ref-21"),
  "21W7-lndINL": fromCatalog("ref-17"),
  "21B-NkA9p-L": fromCatalog("ref-11"),
  "217GQ1a2QzL": fromCatalog("ref-20"),
  CARD_Tech_1: fromCatalog("2"),
  CARD_Tech_2: fromCatalog("ref-80"),
  CARD_Tech_3: fromCatalog("ref-79"),
  CARD_Tech_4: fromCatalog("6"),
  CARD_Fit_1: fromCatalog("ref-2"),
  CARD_Fit_2: fromCatalog("ref-1"),
  CARD_Fit_3: fromCatalog("ref-4"),
  CARD_Fit_4: fromCatalog("ref-5"),
  CARD_Travel_1: fromCatalog("ref-58"),
  CARD_Travel_2: fromCatalog("ref-59"),
  CARD_Travel_3: fromCatalog("ref-3"),
  CARD_Travel_4: fromCatalog("ref-5"),
  CARD_PC_1: fromCatalog("ref-54"),
  CARD_PC_2: fromCatalog("ref-55"),
  CARD_PC_3: fromCatalog("ref-56"),
  CARD_PC_4: fromCatalog("ref-57"),
  CARD_Family_1: fromCatalog("ref-34"),
  CARD_Family_2: fromCatalog("ref-35"),
  CARD_Family_3: fromCatalog("ref-36"),
  CARD_Family_4: fromCatalog("ref-37"),
  CARD_HomeEss_1: fromCatalog("ref-66"),
  CARD_HomeEss_2: fromCatalog("ref-67"),
  CARD_HomeEss_3: fromCatalog("ref-68"),
  CARD_HomeEss_4: fromCatalog("ref-69"),
  CARD_Beauty_1: fromCatalog("ref-51"),
  CARD_Beauty_2: fromCatalog("ref-74"),
  CARD_Beauty_3: fromCatalog("ref-75"),
  CARD_Beauty_4: fromCatalog("ref-84"),
  CARD_Deals_1: fromCatalog("1"),
  CARD_Deals_2: fromCatalog("ref-13"),
  CARD_Deals_3: fromCatalog("ref-34"),
  CARD_Deals_4: fromCatalog("ref-40"),
};
export function referenceImage(part: string) { return Object.entries(patchedArtwork).find(([name]) => name.includes(part))?.[1] || fallbackImage; }
// memo + useMemo: Home owns the carousel `slide` state, so every arrow click
// re-rendered all five rails and re-filtered the 191-product catalog each time.
// Rail's props never change, so it should not re-render at all.
export const Rail = memo(function Rail({title, department, deal = false}: {title: string; department?: string; deal?: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  const list = useMemo(
    () => products.filter(p => (!department || p.category === department) && (!deal || p.isDeal)),
    [department, deal],
  );
  return <section className={`rail-section ${deal ? "deals-rail" : ""}`}><div className="section-heading"><h2>{title}</h2><Link href={deal ? "/deals" : searchUrl("", department)}>See more</Link></div><div className="rail-wrap"><button className="rail-arrow left" aria-label={`Previous ${title}`} onClick={()=>ref.current?.scrollBy({left:-800,behavior:"smooth"})}><ChevronLeft/></button><div className="product-rail" ref={ref}>{list.map(p=>deal ? <ProductCard key={p.id} product={p} deal/> : <Link className="rail-image" key={p.id} href={productUrl(p.id)}><img src={p.images[0]} alt={p.name} loading="lazy"/></Link>)}</div><button className="rail-arrow right" aria-label={`Next ${title}`} onClick={()=>ref.current?.scrollBy({left:800,behavior:"smooth"})}><ChevronRight/></button></div></section>;
});
type Tile = [image:string, label:string, department:string, query?:string];
function Quad({title, items, label="See more", department}: {title:string;items:Tile[];label?:string;department:string}) {
  return <section className="home-card"><h2>{title}</h2><div className="quad-grid">{items.map(([image,label,category,query])=><Link key={label} href={searchUrl(query,category)}><div className="quad-image"><img src={referenceImage(image)} alt={label} loading="lazy"/></div><span>{label}</span></Link>)}</div><Link className="card-more" href={searchUrl("",department)}>{label}</Link></section>;
}
function Single({title,image,department,label}: {title:string;image:string;department:string;label:string}) { return <section className="home-card"><h2>{title}</h2><Link className="single-card-image" href={searchUrl("",department)}><img src={referenceImage(image)} alt={title}/></Link><Link className="card-more" href={searchUrl("",department)}>{label}</Link></section>; }
const slides = [["71ROLBmB4AL", "Shop Back to School", "Office Products"],["71qcoYgEhzL", "Get your game on", "Video Games"],["619geyiQI5L", "Kitchen essentials under $50", "Kitchen & Dining"],["61Yx5-N155L", "Toys for little ones", "Toys & Games"]];
export default function Home() {
 const [slide,setSlide] = useState(0); const store = useStore();
 return <div className="home"><h1 className="sr-only">Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books and more</h1><section className="campaign-hero" aria-label="Featured offers" aria-roledescription="carousel"><Link href={searchUrl("",slides[slide][2])}><img src={referenceImage(slides[slide][0])} alt={slides[slide][1]} fetchPriority="high"/></Link><button className="hero-arrow left" aria-label="Previous promotion" onClick={()=>setSlide((slide+3)%4)}><ChevronLeft size={48} strokeWidth={1.4}/></button><button className="hero-arrow right" aria-label="Next promotion" onClick={()=>setSlide((slide+1)%4)}><ChevronRight size={48} strokeWidth={1.4}/></button><div className="hero-dots">{slides.map((s,i)=><button key={s[0]} aria-label={`Show ${s[1]}`} aria-pressed={i===slide} onClick={()=>setSlide(i)}/>)}</div></section>
 <div className="home-content reference-home"><div className="home-card-grid">
 <div className="promo-rail">
 <Single title="Must-haves for every student" image="Fuji_SingleImageCard_BTS_SH26" department="Office Products" label="Shop Back to School"/>
 <Single title="Get your game on" image="Fuji_Gaming_SingleImageCard_C" department="Video Games" label="Shop gaming"/>
 </div>
 <Quad title="Shop Fashion for less" department="Clothing, Shoes & Jewelry" label="See all deals" items={[["DQC_APR_TBYB_W_BOTTOMS","Jeans under $50","Clothing, Shoes & Jewelry","pants"],["DQC_APR_TBYB_W_TOPS","Tops under $25","Clothing, Shoes & Jewelry","shirt"],["DQC_APR_TBYB_W_DRESSES","Styles under $30","Clothing, Shoes & Jewelry","Women"],["DQC_APR_TBYB_W_SHOES","Shoes under $50","Clothing, Shoes & Jewelry","Shoes"]]}/>
 <Quad title="Must-have school supplies" department="Office Products" label="Shop Back to School" items={[["Fuji_QuadCard_Bag","Backpacks","Luggage & Travel"],["Fuji_QuadCard_Electronics","Electronics","Computers"],["Fuji_QuadCard_Stationery","Stationery","Office Products"],["Fuji_QuadCard_Fashion","Fashion","Clothing, Shoes & Jewelry"]]}/>
 <Quad title="New home arrivals under $50" department="Home & Kitchen" label="Shop the latest from Home" items={[["315_HP_NewArrivals","Kitchen & dining","Kitchen & Dining"],["316_HP_NewArrivals","Home improvement","Tools & Home Improvement"],["317_HP_NewArrivals","Décor","Home & Kitchen","Décor"],["318_HP_NewArrivals","Bedding & bath","Home & Kitchen","Bedding"]]}/>
 <Quad title="Top categories in Kitchen appliances" department="Kitchen & Dining" label="Explore all products in Kitchen" items={[["313wAT6Iy2L","Cookers","Kitchen & Dining","Ninja"],["21W7-lndINL","Coffee","Kitchen & Dining","Coffee"],["21B-NkA9p-L","Pots and pans","Kitchen & Dining","Cookware"],["217GQ1a2QzL","Kitchen tools","Kitchen & Dining","Tools"]]}/>
 <Quad title="Fashion trends you like" department="Clothing, Shoes & Jewelry" label="Explore more" items={[["LSS23_SPRING_DT_CAT_CARD_2","Everyday style","Clothing, Shoes & Jewelry","Women"],["LSS23_SPRING_DT_CAT_CARD_3","Knits","Clothing, Shoes & Jewelry","sweater"],["LSS23_SPRING_DT_CAT_CARD_1","Layers","Clothing, Shoes & Jewelry","hoodie"],["LSS23_SPRING_DT_CAT_CARD_4","Accessories","Clothing, Shoes & Jewelry","socks"]]}/>
 <Quad title="Easy updates for elevated spaces" department="Home & Kitchen" label="Shop home products" items={[["EE_LaundryLuxe","Baskets & hampers","Home & Kitchen","Laundry"],["EE_Kitchen","Hardware","Tools & Home Improvement"],["EE_AccentFurniture","Accent furniture","Home & Kitchen"],["EE_Hallway","Décor & frames","Home & Kitchen","frame"]]}/>
 </div><Rail title="Best Sellers in Sports & Outdoors" department="Sports & Outdoors"/>
 <div className="home-card-grid">
 <Quad title="Wireless Tech" department="Electronics" label="See more" items={[["CARD_Tech_1","Headphones","Electronics","Audio"],["CARD_Tech_2","Smart watches","Electronics","Wearable"],["CARD_Tech_3","Chargers","Electronics","Accessories"],["CARD_Tech_4","Smartphones","Electronics","Smartphones"]]}/>
 <Quad title="Gear up to get fit" department="Sports & Outdoors" label="Shop Sports & Outdoors" items={[["CARD_Fit_1","Strength","Sports & Outdoors","Fitness"],["CARD_Fit_2","Hydration","Sports & Outdoors","Water Bottles"],["CARD_Fit_3","Golf","Sports & Outdoors","Golf"],["CARD_Fit_4","Outdoors","Sports & Outdoors","Camping"]]}/>
 <Quad title="Most-loved travel essentials" department="Luggage & Travel" label="Explore travel" items={[["CARD_Travel_1","Backpacks","Luggage & Travel","Backpacks"],["CARD_Travel_2","Luggage racks","Luggage & Travel","Travel"],["CARD_Travel_3","Water bottles","Sports & Outdoors","Water Bottles"],["CARD_Travel_4","Filters","Sports & Outdoors","Camping"]]}/>
 <Quad title="Level up your PC here" department="Computers" label="Shop Computers" items={[["CARD_PC_1","Tablets","Computers","Tablets"],["CARD_PC_2","Monitors","Computers","Monitors"],["CARD_PC_3","Gaming monitors","Computers","Monitors"],["CARD_PC_4","Networking","Computers","Networking"]]}/>
 </div>
 <Rail title="Popular products in Kitchen internationally" department="Kitchen & Dining"/>
 <section className="department-strip"><h2>Shop by department</h2><div>{categories.map(c=><Link href={searchUrl("",c.name)} key={c.id}><span><img src={c.image} alt="" loading="lazy"/></span><b>{c.name}</b></Link>)}</div></section>
 <Rail title="Deals worth discovering" deal/><Rail title="Best Sellers in Clothing, Shoes & Jewelry" department="Clothing, Shoes & Jewelry"/>
 <div className="home-card-grid lower-cards">{["Toys & Games","Beauty & Personal Care","Computers","Baby"].map(name=><section className="home-card" key={name}><h2>{name === "Baby" ? "Little things. Big adventures." : `Discover ${name}`}</h2><div className="category-products">{products.filter(p=>p.category===name).slice(0,4).map(p=><Link href={productUrl(p.id)} key={p.id}><img src={p.images[0]} alt={p.name} loading="lazy"/></Link>)}</div><Link className="card-more" href={searchUrl("",name)}>Shop now</Link></section>)}</div>
 <Rail title="Best Sellers in Home & Kitchen" department="Home & Kitchen"/>
 <div className="home-card-grid">
 <Quad title="Have more fun with family" department="Toys & Games" label="Shop Toys & Games" items={[["CARD_Family_1","Plush toys","Toys & Games","Stuffed"],["CARD_Family_2","Ride-ons","Toys & Games","Outdoor Play"],["CARD_Family_3","Playsets","Toys & Games","Vehicles"],["CARD_Family_4","Giant plush","Toys & Games","Stuffed"]]}/>
 <Quad title="Shop for your home essentials" department="Home & Kitchen" label="Shop Home & Kitchen" items={[["CARD_HomeEss_1","Air quality","Home & Kitchen","Air Quality"],["CARD_HomeEss_2","Bath","Home & Kitchen","Bath"],["CARD_HomeEss_3","Bedding","Home & Kitchen","Bedding"],["CARD_HomeEss_4","Décor","Home & Kitchen","Décor"]]}/>
 <Quad title="Level up your beauty routine" department="Beauty & Personal Care" label="Shop Beauty" items={[["CARD_Beauty_1","Personal care","Beauty & Personal Care"],["CARD_Beauty_2","Cleaning","Health & Household","Household"],["CARD_Beauty_3","Home comfort","Health & Household","Home Environment"],["CARD_Beauty_4","Wipes","Health & Household","Household"]]}/>
 <Quad title="Deals on top categories" department="Electronics" label="See all deals" items={[["CARD_Deals_1","Electronics","Electronics","Audio"],["CARD_Deals_2","Kitchen","Kitchen & Dining"],["CARD_Deals_3","Toys","Toys & Games"],["CARD_Deals_4","Baby","Baby"]]}/>
 </div>
 <Rail title="Level up your everyday tech" department="Electronics"/></div>
 <section className="personalized"><h2>{store.name ? `Discover more, ${store.name}` : "See personalized recommendations"}</h2><Link className="yellow-button" href={store.name ? "/deals" : "/ap/signin"}>{store.name ? "Explore deals" : "Sign in"}</Link>{!store.name && <p>New customer? <Link href="/ap/register">Start here.</Link></p>}</section></div>;
}
```

### `components/product-detail.tsx`

*552 lines*

```tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Heart,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/lib/catalog";
import { products, productUrl, searchUrl } from "@/lib/catalog";
import { Price, ProductCard, Stars } from "./ui";
import { useStore } from "./store";

const REVIEWERS = [
  "Amazon Customer",
  "Michael R.",
  "Sarah T.",
  "David K.",
  "Jenny L.",
  "Robert P.",
  "Amanda C.",
  "Chris W.",
];

const REVIEW_SNIPPETS = [
  {
    title: "Excellent quality and fast delivery",
    body: "The item matched the description, arrived in good condition, and was easy to use. I would recommend it.",
  },
  {
    title: "Works exactly as described",
    body: "Works exactly as described, arrived faster than expected, and has held up well so far.",
  },
  {
    title: "Good value for the price",
    body: "Good value for the price and would buy again. Packaging was solid and it was easy to set up.",
  },
  {
    title: "Better than I expected",
    body: "I was skeptical at first, but it has held up well with regular use. Happy with this purchase.",
  },
  {
    title: "Solid, reliable product",
    body: "Does what it's supposed to do without any fuss. Shipping was quick and it arrived well packaged.",
  },
  {
    title: "Would recommend to a friend",
    body: "Easy to set up and has worked reliably since day one. Would recommend it to a friend.",
  },
  {
    title: "Exactly what I needed",
    body: "Exactly what I was looking for. Good build quality and it arrived earlier than the estimate.",
  },
];

const REVIEW_DATES = [
  "June 30, 2026",
  "July 14, 2026",
  "August 2, 2026",
  "August 21, 2026",
  "September 8, 2026",
  "September 19, 2026",
];

function hashProductId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Plausible star distribution derived from the product's own rating, so the
// histogram always agrees with the headline number instead of being arbitrary.
function ratingHistogram(rating: number) {
  const five = Math.round(Math.min(92, Math.max(8, (rating - 2.2) * 32)));
  const four = Math.round((100 - five) * 0.5);
  const three = Math.round((100 - five - four) * 0.5);
  const two = Math.round((100 - five - four - three) * 0.5);
  return { 5: five, 4: four, 3: three, 2: two, 1: 100 - five - four - three - two };
}

const QUESTIONS = [
  {
    q: "Does this come with everything needed to use it out of the box?",
    a: "Yes — it ships complete. Anything optional is listed under Product information.",
  },
  {
    q: "How long does delivery usually take?",
    a: "Standard delivery is free on eligible orders and the estimate is shown in the buy box before you order.",
  },
  {
    q: "What is the return window?",
    a: "30 days from delivery, through Your Orders.",
  },
  {
    q: "Is this the current model?",
    a: "Yes. The model number is listed in the Product information table on this page.",
  },
];

const SENTIMENT = [
  "Quality",
  "Value for money",
  "Ease of use",
  "Appearance",
  "Shipping speed",
];

export default function ProductDetail({ product }: { product: Product }) {
  const store = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(
    product.category === "Electronics" ? "Black" : "Navy",
  );
  const related = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.id !== product.id && item.category === product.category,
        )
        .slice(0, 5),
    [product],
  );
  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );
  const reviews = [0, 1, 2].map((index) => {
    const seed = hashProductId(`${product.id}:${index}`);
    // offset by index so the three reviews never collide on the same pool entry
    const snippet =
      REVIEW_SNIPPETS[
        (Math.floor(seed / 7) + index) % REVIEW_SNIPPETS.length
      ];
    return {
      key: index,
      reviewer: REVIEWERS[(seed + index) % REVIEWERS.length],
      title: snippet.title,
      body: snippet.body,
      date: REVIEW_DATES[
        (Math.floor(seed / 13) + index) % REVIEW_DATES.length
      ],
      rating: seed % 4 === 0 ? 4 : 5,
      helpful: (seed % 180) + 4,
      verified: seed % 6 !== 0,
    };
  });
  const histogram = ratingHistogram(product.rating);

  return (
    <div className="detail-page">
      <div className="breadcrumbs">
        <Link href="/">Amazon</Link>
        <span>›</span>
        <Link href={searchUrl("", product.category)}>{product.category}</Link>
        <span>›</span>
        <span>{product.subCategory}</span>
      </div>
      <div className="detail-grid">
        <aside className="thumbs">
          {product.images.map((image, index) => (
            <button
              key={image}
              className={selectedImage === index ? "active" : ""}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </aside>
        <section className="main-product-image">
          <img src={product.images[selectedImage]} alt={product.name} />
          <p>Roll over image to zoom in</p>
        </section>
        <section className="product-info">
          <h1>{product.name}</h1>
          <Link href={searchUrl(product.brand)} className="link-text">
            Visit the {product.brand} Store
          </Link>
          <div className="rating-line">
            <span>{product.rating}</span>
            <Stars rating={product.rating} />
            <ChevronDown size={14} />
            <Link href="#reviews">
              {product.ratingCount.toLocaleString()} ratings
            </Link>
          </div>
          {product.isBestseller && (
            <div className="best-seller">
              #1 Best Seller <i />
            </div>
          )}
          <hr />
          <div className="deal-price">
            <span>-{discount}%</span>
            <Price value={product.price} />
          </div>
          <div className="muted">
            List Price: <s>${product.originalPrice.toFixed(2)}</s>
          </div>
          <p className="small-copy">
            $15.00 Shipping & Import Fees Deposit to {store.location}{" "}
            <Link href="/help?topic=shipping">Details</Link>{" "}
            <ChevronDown size={12} />
          </p>
          {product.category === "Clothing, Shoes & Jewelry" && (
            <>
              <p>
                <b>Color:</b> {color}
              </p>
              <div className="swatches">
                {["Black", "Blue", "White"].map((value, index) => (
                  <button
                    key={value}
                    className={color === value ? "selected" : ""}
                    onClick={() => {
                      setColor(value);
                      setSelectedImage(
                        index < product.images.length ? index : 0,
                      );
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="feature-table">
            <b>Brand</b>
            <span>{product.brand}</span>
            <b>Category</b>
            <span>{product.subCategory}</span>
            <b>Model</b>
            <span>{product.id.padStart(4, "0")}</span>
            <b>Connectivity</b>
            <span>
              {product.category === "Electronics" ? "Wireless" : "Standard"}
            </span>
          </div>
          <hr />
          <h2>About this item</h2>
          <ul className="bullets">
            <li>{product.description}</li>
            <li>
              Designed for everyday use with a durable, comfortable finish.
            </li>
            <li>
              Backed by easy returns through this demo shopping experience.
            </li>
          </ul>
        </section>
        <aside className="buy-box">
          <Price value={product.price} />
          <p className="small-copy">
            $15.00 Shipping & Import Fees Deposit to {store.location}{" "}
            <Link href="/help?topic=shipping">Details</Link>
          </p>
          <p>
            <b>FREE delivery</b> <strong>Tuesday, September 22</strong>
          </p>
          <p className="fast-delivery">
            Or fastest delivery <b>Friday, September 18</b>
          </p>
          <button
            className="deliver-link"
            onClick={() =>
              document.querySelector<HTMLButtonElement>(".location")?.click()
            }
          >
            <MapPin size={17} /> Deliver to {store.location}
          </button>
          <div className="stock">In Stock</div>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            aria-label="Quantity"
          >
            {Array.from(
              { length: Math.min(8, product.stockQuantity) },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Quantity: {i + 1}
                </option>
              ),
            )}
          </select>
          <button
            className="yellow-button round"
            onClick={() => store.add(product.id, quantity, color)}
          >
            Add to Cart
          </button>
          <Link
            className="orange-button round"
            href="/checkout"
            onClick={() => store.add(product.id, quantity, color)}
          >
            Buy Now
          </Link>
          <div className="secure">
            <Lock size={14} />
            <Link href="/help?topic=secure">Secure transaction</Link>
          </div>
          <div className="shipping-table">
            <span>Ships from</span>
            <b>Amazon.com</b>
            <span>Sold by</span>
            <b>Amazon.com</b>
            <span>Returns</span>
            <Link href="/help?topic=returns">30-day refund/replacement</Link>
            <span>Payment</span>
            <Link href="/help?topic=secure">Secure transaction</Link>
          </div>
          <button
            className="outline-button full"
            onClick={() => store.save(product.id)}
          >
            <Heart size={16} /> Add to List
          </button>
        </aside>
      </div>
      <section className="recommendations">
        <h2>Products related to this item</h2>
        <div className="recommendation-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
      {related.length > 0 && (
        <section className="comparison">
          <h2>Compare with similar items</h2>
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th />
                  <th className="this-item">
                    <img src={product.images[0]} alt="" />
                    <span>{product.name}</span>
                    <em>This item</em>
                  </th>
                  {related.slice(0, 3).map((item) => (
                    <th key={item.id}>
                      <Link href={productUrl(item.id)}>
                        <img src={item.images[0]} alt="" />
                        <span>{item.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Price</th>
                  <td>
                    <Price value={product.price} />
                  </td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>
                      <Price value={item.price} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Customer Rating</th>
                  <td>
                    <Stars rating={product.rating} /> ({product.ratingCount})
                  </td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>
                      <Stars rating={item.rating} /> ({item.ratingCount})
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Brand</th>
                  <td>{product.brand}</td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>{item.brand}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{product.subCategory}</td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>{item.subCategory}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="product-information">
        <h2>Product information</h2>
        <table>
          <tbody>
            <tr>
              <th scope="row">Brand</th>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <th scope="row">Model number</th>
              <td>{product.id.padStart(4, "0")}</td>
            </tr>
            <tr>
              <th scope="row">Department</th>
              <td>{product.category}</td>
            </tr>
            <tr>
              <th scope="row">Category</th>
              <td>{product.subCategory}</td>
            </tr>
            <tr>
              <th scope="row">Customer Reviews</th>
              <td>
                <Stars rating={product.rating} /> {product.rating} out of 5 (
                {product.ratingCount.toLocaleString()} ratings)
              </td>
            </tr>
            <tr>
              <th scope="row">Best Sellers Rank</th>
              <td>
                {product.isBestseller
                  ? `#1 in ${product.subCategory}`
                  : `#${(hashProductId(product.id) % 400) + 12} in ${product.subCategory}`}
              </td>
            </tr>
            <tr>
              <th scope="row">Availability</th>
              <td>
                {product.inStock
                  ? `In stock — ${product.stockQuantity} available`
                  : "Currently unavailable"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="product-description">
        <h2>Product description</h2>
        <p>{product.description}</p>
        <div className="trust-row">
          <span>
            <Check /> Quality checked
          </span>
          <span>
            <ShieldCheck /> Secure demo checkout
          </span>
          <span>
            <Lock /> No payment collected
          </span>
        </div>
      </section>
      <section id="questions" className="qanda">
        <h2>Looking for specific info?</h2>
        <div className="qanda-list">
          {QUESTIONS.map((item, i) => (
            <details key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
              <small>
                Answered by Amazon · {(hashProductId(product.id) % 40) + 3} people
                found this helpful
              </small>
            </details>
          ))}
        </div>
        <Link className="link-text" href="/help?topic=Customer Service">
          See more answered questions
        </Link>
      </section>
      <section id="reviews" className="reviews">
        <h2>Customer reviews</h2>
        <div className="review-summary">
          <div>
            <b>{product.rating}</b>
            <Stars rating={product.rating} />
            <p>{product.ratingCount} global ratings</p>
          </div>
          <div>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star}>
                <span>{star} star</span>
                <i>
                  <em style={{ width: `${histogram[star]}%` }} />
                </i>
                <span>{histogram[star]}%</span>
              </div>
            ))}
          </div>
        </div>
        <section className="customers-say">
          <h3>Customers say</h3>
          <p>
            Customers are generally satisfied with this {product.subCategory.toLowerCase()}
            , frequently mentioning its {SENTIMENT[0].toLowerCase()} and{" "}
            {SENTIMENT[1].toLowerCase()}. Reviews are generated from customer
            feedback in this demo catalog.
          </p>
          <div className="sentiment-chips">
            {SENTIMENT.map((chip, i) => (
              <span key={chip} className={i < 3 ? "positive" : ""}>
                {chip} {i < 3 ? "✓" : "~"}
              </span>
            ))}
          </div>
        </section>
        <div className="review-list">
          {reviews.map((entry) => (
            <article className="review-card" key={entry.key}>
              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  {entry.reviewer.charAt(0)}
                </span>
                <b>{entry.reviewer}</b>
              </div>
              <div>
                <Stars rating={entry.rating} />{" "}
                <strong>{entry.title}</strong>
              </div>
              <small>
                Reviewed in the United States on {entry.date}
                {entry.verified && (
                  <span className="verified-purchase">Verified Purchase</span>
                )}
              </small>
              <p>{entry.body}</p>
              <div className="review-actions">
                <span>{entry.helpful} people found this helpful</span>
                <button type="button" className="outline-button">
                  Helpful
                </button>
                <Link href="/help?topic=Customer Service">Report</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### `components/cart.tsx`

*239 lines*

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Lock, ShoppingCart } from "lucide-react";
import { productById, productUrl, products } from "@/lib/catalog";
import { Price, ProductCard } from "./ui";
import { useStore } from "./store";

export default function CartPage() {
  const store = useStore();
  // Amazon lets you deselect cart lines; the subtotal follows the selection.
  // Tracked as an exclusion list so newly added items are selected by default.
  const [deselected, setDeselected] = useState<string[]>([]);
  const toggleOne = (id: string) =>
    setDeselected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const selectedLines = store.cart.filter((l) => !deselected.includes(l.id));
  const allSelected = store.cart.length > 0 && selectedLines.length === store.cart.length;
  const toggleAll = () =>
    setDeselected(allSelected ? store.cart.map((l) => l.id) : []);
  const selectedCount = selectedLines.reduce((n, l) => n + l.quantity, 0);
  const selectedTotal = selectedLines.reduce((sum, l) => {
    const p = productById(l.id);
    return sum + (p ? Math.round(p.price * 100) * l.quantity : 0);
  }, 0) / 100;

  if (!store.ready)
    return <div className="cart-loading">Loading your cart…</div>;
  if (!store.cart.length)
    return (
      <div className="cart-page">
        <section className="empty-cart">
          <ShoppingCart size={120} strokeWidth={1} />
          <div>
            <h1>Your Amazon Cart is empty</h1>
            <Link href="/deals">Shop today's deals</Link>
            {!store.name && (
              <div className="empty-actions">
                <Link className="yellow-button" href="/ap/signin">
                  Sign in to your account
                </Link>
                <Link className="outline-button" href="/ap/register">
                  Sign up now
                </Link>
              </div>
            )}
          </div>
        </section>
        <SavedItems />
      </div>
    );
  return (
    <div className="cart-page">
      <div className="cart-layout">
        <section className="cart-panel">
          <h1>Shopping Cart</h1>
          <button className="select-all" onClick={toggleAll} type="button">
            {allSelected ? "Deselect all items" : "Select all items"}
          </button>
          <div className="cart-price-label">Price</div>
          {store.cart.map((line) => {
            const product = productById(line.id);
            if (!product) return null;
            return (
              <article className="cart-line" key={line.id}>
                <input
                  type="checkbox"
                  checked={!deselected.includes(line.id)}
                  onChange={() => toggleOne(line.id)}
                  aria-label={`Select ${product.name}`}
                />
                <Link className="cart-image" href={productUrl(product.id)}>
                  <img src={product.images[0]} alt={product.name} />
                </Link>
                <div className="cart-line-copy">
                  <Link href={productUrl(product.id)}>
                    <h2>{product.name}</h2>
                  </Link>
                  <span className="stock">In Stock</span>
                  <small>Eligible for FREE Shipping</small>
                  <div className="prime">
                    ✓<b>prime</b>
                  </div>
                  <label>
                    <input type="checkbox" /> This is a gift{" "}
                    <Link href="/help?topic=gifts">Learn more</Link>
                  </label>
                  {line.color && (
                    <p>
                      <b>Color:</b> {line.color}
                    </p>
                  )}
                  <div className="cart-actions">
                    <select
                      value={line.quantity}
                      onChange={(e) =>
                        store.quantity(line.id, Number(e.target.value))
                      }
                      aria-label={`Quantity for ${product.name}`}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Qty: {i + 1}
                        </option>
                      ))}
                    </select>
                    <i />
                    <button onClick={() => store.quantity(line.id, 0)}>
                      Delete
                    </button>
                    <i />
                    <button onClick={() => store.save(line.id)}>
                      Save for later
                    </button>
                    <i />
                    <button
                      onClick={() =>
                        navigator.clipboard
                          ?.writeText(
                            `${location.origin}${productUrl(product.id)}`,
                          )
                          .then(() => store.notify("Product link copied"))
                      }
                    >
                      Share
                    </button>
                  </div>
                </div>
                <Price value={product.price * line.quantity} />
              </article>
            );
          })}
          <div className="cart-subtotal">
            Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}):{" "}
            <Price value={selectedTotal} />
          </div>
        </section>
        <aside className="subtotal-card">
          <div className="free-shipping">
            <span>✓</span>
            <p>
              Your order qualifies for FREE Shipping. Choose this option at
              checkout.
            </p>
          </div>
          <div>
            Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}):{" "}
            <Price value={selectedTotal} />
          </div>
          <label>
            <input type="checkbox" /> This order contains a gift
          </label>
          <Link
            className={`yellow-button round ${selectedCount ? "" : "disabled"}`}
            aria-disabled={selectedCount === 0}
            href={selectedCount ? "/checkout" : "/cart"}
          >
            Proceed to checkout
          </Link>
          <details>
            <summary>
              <Lock size={14} /> Secure transaction <ChevronDown size={14} />
            </summary>
            <p>Your information is protected throughout this demo.</p>
          </details>
        </aside>
      </div>
      <SavedItems />
      <CartRecommendations />
    </div>
  );
}

function CartRecommendations() {
  const store = useStore();
  const inCart = new Set(store.cart.map((l) => l.id));
  const seedCategory = productById(store.cart[0]?.id ?? "")?.category;
  const picks = products
    .filter((p) => !inCart.has(p.id) && (!seedCategory || p.category === seedCategory))
    .slice(0, 5);
  if (!picks.length) return null;
  return (
    <section className="cart-recommendations">
      <h2>Customers who bought items in your cart also bought</h2>
      <div className="cart-recommendation-grid">
        {picks.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function SavedItems() {
  const store = useStore();
  return (
    <section className="saved-section">
      <h2>{store.saved.length ? "Saved for later" : "Your items"}</h2>
      {store.saved.length ? (
        store.saved.map((id) => {
          const product = productById(id);
          if (!product) return null;
          return (
            <article className="saved-line" key={id}>
              <img src={product.images[0]} alt={product.name} />
              <div>
                <Link href={productUrl(id)}>
                  <h3>{product.name}</h3>
                </Link>
                <span className="stock">In Stock</span>
                <button
                  className="yellow-button"
                  onClick={() => {
                    store.unsave(id);
                    store.add(id);
                  }}
                >
                  Move to Cart
                </button>
                <button
                  className="link-button"
                  onClick={() => store.unsave(id)}
                >
                  Delete
                </button>
              </div>
              <Price value={product.price} />
            </article>
          );
        })
      ) : (
        <p className="muted">No items saved for later.</p>
      )}
    </section>
  );
}
```

### `components/checkout.tsx`

*266 lines*

```tsx
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { productById } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "United Arab Emirates",
];

export default function Checkout() {
  const store = useStore();
  const router = useRouter();
  const [name, setName] = useState(store.name);
  const [country, setCountry] = useState(
    store.location.includes("US") ? "United States" : store.location,
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  useEffect(() => setName(store.name), [store.name]);
  // store.location is the pre-hydration default on first render, so adopt the
  // persisted value once localStorage has loaded.
  useEffect(() => {
    if (!store.ready) return;
    const resolved = store.location.includes("US")
      ? "United States"
      : store.location;
    setCountry(COUNTRIES.includes(resolved) ? resolved : "United States");
  }, [store.ready, store.location]);
  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!store.cart.length) {
      router.push("/cart");
      return;
    }
    if (
      !name.trim() ||
      !address.trim() ||
      !city.trim() ||
      !region.trim() ||
      postal.trim().length < 4
    ) {
      setError("Enter a complete delivery address.");
      return;
    }
    setPlacing(true);
    store.login(name.trim());
    const id = store.placeOrder(
      name.trim(),
      `${address.trim()}, ${city.trim()}, ${region.trim()} ${postal.trim()}, ${country}`,
    );
    if (id) router.push(`/order-confirmation?id=${encodeURIComponent(id)}`);
  }
  if (!store.ready)
    return <div className="checkout-loading">Preparing checkout…</div>;
  if (!store.cart.length)
    return (
      <div className="checkout-empty">
        <h1>Your cart is empty</h1>
        <p>Add an item before proceeding to checkout.</p>
        <Link className="yellow-button" href="/">
          Continue shopping
        </Link>
      </div>
    );
  return (
    <div className="checkout-page">
      <div className="checkout-title">
        <Link href="/">
          <img src="/assets/amazon-logo.svg" alt="amazon" />
        </Link>
        <h1>Checkout</h1>
        <Lock />
      </div>
      <form onSubmit={submit} className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-section">
            <div className="step-number">1</div>
            <div>
              <h2>Shipping address</h2>
              <div className="address-form">
                <label>
                  Country/Region
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {COUNTRIES.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Full name (First and Last name)
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label>
                  Street address
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address or P.O. Box"
                    autoComplete="street-address"
                  />
                </label>
                <div className="field-row">
                  <label>
                    City
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                    />
                  </label>
                  <label>
                    State / Province
                    <input
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      autoComplete="address-level1"
                    />
                  </label>
                  <label>
                    ZIP / Postal code
                    <input
                      required
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      autoComplete="postal-code"
                    />
                  </label>
                </div>
                <label>
                  Phone number
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                  <small>May be used to assist delivery</small>
                </label>
                <label className="check">
                  <input type="checkbox" /> Make this my default address
                </label>
              </div>
            </div>
          </section>
          <section className="checkout-section">
            <div className="step-number">2</div>
            <div className="checkout-wide">
              <h2>Payment method</h2>
              <div className="demo-payment">
                <span>
                  <Check />
                </span>
                <div>
                  <b>Demo payment — no card required</b>
                  <p>
                    This assignment never collects or processes payment
                    information.
                  </p>
                </div>
              </div>
              <details>
                <summary>
                  Enter a gift card or promotional code{" "}
                  <ChevronDown size={16} />
                </summary>
                <div className="promo-row">
                  <input aria-label="Gift card or promo code" />
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() =>
                      store.notify("Promo codes aren't supported in this demo")
                    }
                  >
                    Apply
                  </button>
                </div>
              </details>
            </div>
          </section>
          <section className="checkout-section">
            <div className="step-number">3</div>
            <div className="checkout-wide">
              <h2>Review items and shipping</h2>
              <div className="delivery-block">
                <h3>Arriving Tuesday, September 22</h3>
                <span className="stock">FREE Shipping</span>
                {store.cart.map((line) => {
                  const p = productById(line.id);
                  return p ? (
                    <div className="checkout-item" key={line.id}>
                      <img src={p.images[0]} alt={p.name} />
                      <div>
                        <b>{p.name}</b>
                        <p>Qty: {line.quantity}</p>
                        {line.color && <p>Color: {line.color}</p>}
                      </div>
                      <Price value={p.price * line.quantity} />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </section>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
        </div>
        <aside className="order-summary">
          <button className="yellow-button round" disabled={placing}>
            {placing ? "Placing your order…" : "Place your order"}
          </button>
          <small>
            By placing your order, you agree to Amazon's{" "}
            <Link href="/help?topic=privacy">privacy notice</Link> and{" "}
            <Link href="/help?topic=conditions">conditions of use</Link>.
          </small>
          <hr />
          <h2>Order Summary</h2>
          <div>
            <span>Items:</span>
            <span>${store.total.toFixed(2)}</span>
            <span>Shipping & handling:</span>
            <span>$0.00</span>
            <span>Estimated tax:</span>
            <span>$0.00</span>
          </div>
          <hr />
          <strong className="order-total">
            <span>Order total:</span>
            <span>${store.total.toFixed(2)}</span>
          </strong>
        </aside>
      </form>
    </div>
  );
}
```

### `components/orders.tsx`

*156 lines*

```tsx
"use client";
import Link from "next/link";
import { CheckCircle2, PackageCheck, Search } from "lucide-react";
import { productById, productUrl } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";
export function OrderConfirmation({ id }: { id: string }) {
  const store = useStore();
  const order = store.orders.find((o) => o.id === id);
  return (
    <div className="confirmation-page">
      <section className="confirmation-card">
        <CheckCircle2 />
        <div>
          <h1>Order placed, thank you!</h1>
          {order ? (
            <>
              <p>
                Confirmation will be shown here for <b>{order.name}</b>.
              </p>
              <p>
                Shipping to <b>{order.address}</b>
              </p>
              <div className="confirmation-date">
                Delivery estimate: <b>Tuesday, September 22</b>
              </div>
              <p className="order-id">Order # {order.id}</p>
            </>
          ) : (
            <p>Your demo order was submitted successfully.</p>
          )}
        </div>
      </section>
      <div className="confirmation-actions">
        <Link className="yellow-button" href="/orders">
          Review your orders
        </Link>
        <Link className="outline-button" href="/">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
export function Orders() {
  const store = useStore();
  return (
    <div className="orders-page">
      <div className="breadcrumbs">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <span>Your Orders</span>
      </div>
      <div className="orders-heading">
        <h1>Your Orders</h1>
        <form>
          <input
            placeholder="Search all orders"
            aria-label="Search all orders"
          />
          <button>
            <Search /> Search Orders
          </button>
        </form>
      </div>
      <nav className="order-tabs">
        <b>Orders</b>
        <span>Buy Again</span>
        <span>Not Yet Shipped</span>
        <span>Cancelled Orders</span>
      </nav>
      {!store.orders.length ? (
        <div className="empty-orders">
          <PackageCheck size={76} />
          <h2>Looks like you haven't placed an order in the past 3 months.</h2>
          <Link href="/">Start shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {store.orders.map((order) => (
            <article className="order-card" key={order.id}>
              <header>
                <span>
                  ORDER PLACED
                  <b>
                    {new Date(order.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </b>
                </span>
                <span>
                  TOTAL<b>${order.total.toFixed(2)}</b>
                </span>
                <span>
                  SHIP TO<b>{order.name}</b>
                </span>
                <span className="order-number">
                  ORDER # {order.id}
                  <Link href={`/order-confirmation?id=${order.id}`}>
                    View order details
                  </Link>
                </span>
              </header>
              <div className="order-body">
                <h2>Arriving Tuesday</h2>
                <p>Not yet shipped</p>
                {order.lines.map((line) => {
                  const p = productById(line.id);
                  return p ? (
                    <div className="order-line" key={line.id}>
                      <Link href={productUrl(p.id)}>
                        <img src={p.images[0]} alt={p.name} />
                      </Link>
                      <div>
                        <Link href={productUrl(p.id)}>{p.name}</Link>
                        <p>Return window ends 30 days after delivery</p>
                        <button
                          className="yellow-button"
                          onClick={() => store.add(p.id, line.quantity)}
                        >
                          Buy it again
                        </button>
                      </div>
                      <Price value={p.price * line.quantity} />
                      <div className="order-buttons">
                        <button
                          className="outline-button"
                          onClick={() =>
                            store.notify("Tracking isn't available in this demo")
                          }
                        >
                          Track package
                        </button>
                        <button
                          className="outline-button"
                          onClick={() =>
                            store.notify("Reviews aren't available in this demo")
                          }
                        >
                          Write a product review
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
```

### `components/account.tsx`

*333 lines*

```tsx
"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Headphones,
  MapPin,
  Package,
  Shield,
  Star,
  Tags,
} from "lucide-react";
import { productById, productUrl } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";

export function AuthPage({ register = false }: { register?: boolean }) {
  const store = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const value = (register ? name : email.split("@")[0]).trim();
    if (!value || !email.includes("@") || (register && password.length < 6)) {
      setError(
        register
          ? "Enter your name, a valid email, and a password of at least 6 characters."
          : "Enter a valid email address.",
      );
      return;
    }
    store.login(value.replace(/\b\w/g, (c) => c.toUpperCase()));
    router.push("/account");
  }
  return (
    <div className="auth-page">
      <Link href="/" aria-label="Amazon home">
        <img src="/assets/amazon-logo.svg" alt="amazon" />
      </Link>
      <form className="auth-card" onSubmit={submit}>
        <h1>{register ? "Create account" : "Sign in"}</h1>
        {register && (
          <label>
            Your name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
            />
          </label>
        )}
        <label>
          Email or mobile phone number
          <input
            autoFocus={!register}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {register && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
            <small>ⓘ Passwords must be at least 6 characters.</small>
          </label>
        )}
        {error && <div className="form-error">{error}</div>}
        <button className="yellow-button">
          {register ? "Create your Amazon account" : "Continue"}
        </button>
        <p>
          By continuing, you agree to Amazon's{" "}
          <Link href="/help?topic=conditions">Conditions of Use</Link> and{" "}
          <Link href="/help?topic=privacy">Privacy Notice</Link>.
        </p>
        <details>
          <summary>Need help?</summary>
          <Link href="/help?topic=signin">Forgot your password?</Link>
        </details>
        {register && (
          <>
            <hr />
            <p>
              Buying for work?{" "}
              <Link href="/help?topic=business">
                Create a free business account
              </Link>
            </p>
          </>
        )}
      </form>
      {!register && (
        <div className="new-divider">
          <span>New to Amazon?</span>
        </div>
      )}
      {!register && (
        <Link className="outline-button auth-create" href="/ap/register">
          Create your Amazon account
        </Link>
      )}
      <footer className="auth-footer">
        <div>
          <Link href="/help?topic=conditions">Conditions of Use</Link>
          <Link href="/help?topic=privacy">Privacy Notice</Link>
          <Link href="/help">Help</Link>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}

const tiles = [
  {
    icon: Package,
    title: "Your Orders",
    copy: "Track, return, cancel an order",
    href: "/orders",
  },
  {
    icon: Shield,
    title: "Login & security",
    copy: "Edit login, name, and mobile number",
    href: "/ap/signin",
  },
  {
    icon: Star,
    title: "Your Lists",
    copy: "View, modify, and share your lists",
    href: "/wishlist",
  },
  {
    icon: CreditCard,
    title: "Your Payments",
    copy: "Manage payment methods and settings",
    href: "/help?topic=payments",
  },
  {
    icon: MapPin,
    title: "Your Addresses",
    copy: "Edit addresses for orders and gifts",
    href: "/preferences",
  },
  {
    icon: Tags,
    title: "Prime",
    copy: "View benefits and payment settings",
    href: "/help?topic=prime",
  },
  {
    icon: Headphones,
    title: "Customer Service",
    copy: "Browse help topics and contact us",
    href: "/help",
  },
  {
    icon: CircleUserRound,
    title: "Your Profiles",
    copy: "Manage your household profiles",
    href: "/help?topic=profiles",
  },
];
export function Account() {
  const store = useStore();
  return (
    <div className="account-page">
      <h1>Your Account</h1>
      {!store.name && (
        <div className="account-signin">
          <p>Sign in for your personalized account experience.</p>
          <Link className="yellow-button" href="/ap/signin">
            Sign in
          </Link>
        </div>
      )}
      <div className="account-grid">
        {tiles.map(({ icon: Icon, ...tile }) => (
          <Link href={tile.href} key={tile.title}>
            <Icon />
            <div>
              <h2>{tile.title}</h2>
              <p>{tile.copy}</p>
            </div>
          </Link>
        ))}
      </div>
      <section className="account-links">
        <h2>More ways to manage your Amazon experience</h2>
        {[
          "Manage your content and devices",
          "Amazon Household",
          "Your Subscribe & Save Items",
          "Memberships & Subscriptions",
          "Your Seller Account",
        ].map((x) => (
          <Link href={`/help?topic=${encodeURIComponent(x)}`} key={x}>
            {x}
            <ChevronRight size={16} />
          </Link>
        ))}
      </section>
    </div>
  );
}
export function Wishlist() {
  const store = useStore();
  return (
    <div className="wishlist-page">
      <h1>Your Lists</h1>
      <section>
        <h2>Shopping List</h2>
        {!store.saved.length ? (
          <>
            <p className="muted">You haven't saved any items yet.</p>
            <Link href="/" className="yellow-button">
              Discover products
            </Link>
          </>
        ) : (
          store.saved.map((id) => {
            const p = productById(id);
            return p ? (
              <article key={id}>
                <img src={p.images[0]} alt={p.name} />
                <div>
                  <Link href={productUrl(id)}>
                    <h3>{p.name}</h3>
                  </Link>
                  <Price value={p.price} />
                  <span className="stock">In Stock</span>
                  <button
                    className="yellow-button"
                    onClick={() => {
                      store.unsave(id);
                      store.add(id);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="link-button"
                    onClick={() => store.unsave(id)}
                  >
                    Delete item
                  </button>
                </div>
              </article>
            ) : null;
          })
        )}
      </section>
    </div>
  );
}
const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "United Arab Emirates",
  "Australia",
  "Germany",
];

export function Preferences() {
  const store = useStore();
  const [language, setLanguage] = useState("English");
  const [country, setCountry] = useState(store.location);
  // store.location only becomes the persisted value after localStorage hydrates,
  // so adopt it once ready — otherwise saving would overwrite it with the default.
  useEffect(() => {
    if (store.ready) setCountry(store.location);
  }, [store.ready, store.location]);
  return (
    <div className="preferences-page">
      <h1>Language Settings</h1>
      <p>
        Select the language you prefer for browsing, shopping, and
        communications.
      </p>
      <section>
        <h2>Language</h2>
        {["English", "Español", "العربية", "Deutsch", "हिन्दी"].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="language"
              checked={language === value}
              onChange={() => setLanguage(value)}
            />
            {value}
          </label>
        ))}
      </section>
      <section>
        <h2>Country/Region</h2>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {[
            ...(COUNTRIES.includes(country) ? [] : [country]),
            ...COUNTRIES,
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </section>
      <button
        className="yellow-button"
        onClick={() => {
          store.setLocation(country);
          store.notify("Preferences saved");
        }}
      >
        Save changes
      </button>
    </div>
  );
}
```

---

## Stylesheets

### `app/globals.css`

*2,752 lines*

```css
:root {
  --nav: #131921;
  --nav2: #232f3e;
  --orange: #ff9900;
  --yellow: #ffd814;
  --yellow-hover: #f7ca00;
  --link: #007185;
  --red: #cc0c39;
  --text: #0f1111;
  --muted: #565959;
  --line: #d5d9d9;
  --page: #e3e6e6;
  font-family: "Amazon Ember", Arial, sans-serif;
  color: var(--text);
  background: #fff;
  font-size: 16px;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  min-width: 320px;
  font-size: 14px;
}
a {
  color: var(--link);
  text-decoration: none;
}
a:hover {
  color: #c7511f;
  text-decoration: underline;
}
button,
input,
select {
  font: inherit;
  color: inherit;
}
button {
  cursor: pointer;
}
img {
  max-width: 100%;
}
/* amazon.com uses 0.1s linear on its controls; scoped to the properties that
   actually change on hover/focus so layout is never animated. */
a,
button,
input,
select,
.header-item,
.product-card,
.product-row,
.home-card,
.quad-grid a,
.department-strip a {
  transition:
    background-color 0.1s linear,
    border-color 0.1s linear,
    color 0.1s linear,
    box-shadow 0.1s linear,
    opacity 0.1s linear;
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
.skip-link {
  position: fixed;
  left: 12px;
  top: -50px;
  background: #fff;
  padding: 10px;
  z-index: 200;
}
.skip-link:focus {
  top: 8px;
}
.header {
  height: 60px;
  background: var(--nav);
  display: flex;
  align-items: center;
  padding: 4px 10px;
  color: #fff;
  gap: 3px;
  position: relative;
  z-index: 60;
}
.header-item {
  height: 50px;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 2px;
  display: flex;
  align-items: center;
  background: transparent;
  padding: 5px 8px;
  white-space: nowrap;
}
.header-item:hover {
  border-color: #fff;
  text-decoration: none;
  color: #fff;
}
.logo {
  width: 114px;
  padding-top: 11px;
}
/* amazon.com renders its logo 34px tall inside a 114x50 hit area; this SVG has a
   different aspect ratio, so match the height and let width follow undistorted. */
.logo img {
  height: 34px;
  width: auto;
}
.footer-locale img {
  width: 100%;
  height: auto;
}
.location {
  gap: 3px;
  min-width: 98px;
}
.location svg {
  align-self: flex-end;
  margin-bottom: 7px;
}
.location span,
.account,
.orders-link {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 15px;
}
.header small {
  font-size: 12px;
  color: #ccc;
}
.header strong {
  font-size: 14px;
}
.search-box {
  color: #0f1111;
  height: 40px;
  display: flex;
  flex: 1;
  margin: 0 7px;
  border-radius: 7px;
  overflow: visible;
  position: relative;
  min-width: 260px;
}
.search-box.focused {
  box-shadow: 0 0 0 3px #ff9900;
}
.search-box select {
  border: 0;
  background: #e6e6e6;
  color: #555;
  padding: 0 26px 0 10px;
  border-radius: 5px 0 0 5px;
  max-width: 108px;
  font-size: 12px;
}
.search-input-wrap {
  position: relative;
  flex: 1;
}
.search-input-wrap > input {
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0 42px 0 10px;
  font-size: 15px;
  outline: 0;
}
.clear-search {
  position: absolute;
  right: 5px;
  top: 9px;
  border: 0;
  background: #fff;
}
.search-button {
  width: 48px;
  border: 0;
  background: #febd69;
  border-radius: 0 5px 5px 0;
  display: grid;
  place-items: center;
}
.search-button:hover {
  background: #f3a847;
}
.suggestions {
  position: absolute;
  top: 43px;
  left: 0;
  right: 0;
  background: #fff;
  color: #111;
  list-style: none;
  padding: 6px 0;
  margin: 0;
  border: 1px solid #bbb;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 3px 8px #0003;
  z-index: 100;
}
.suggestions button {
  width: 100%;
  border: 0;
  background: #fff;
  padding: 9px 12px;
  display: flex;
  gap: 10px;
  text-align: left;
}
.suggestions button:hover,
.suggestions button.selected {
  background: #eee;
}
.language {
  gap: 4px;
}
.account-wrap {
  position: relative;
}
.account strong {
  display: flex;
  align-items: center;
}
.account-popover {
  position: absolute;
  width: 480px;
  right: -120px;
  top: 52px;
  background: #fff;
  color: #111;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 15px 20px;
  box-shadow: 0 3px 9px #0004;
  z-index: 110;
}
.account-popover:before {
  content: "";
  position: absolute;
  top: -8px;
  right: 135px;
  border-width: 0 8px 8px;
  border-style: solid;
  border-color: transparent transparent #fff;
}
.account-popover > .yellow-button {
  display: block;
  max-width: 220px;
  margin: auto;
  text-align: center;
}
.account-popover > p {
  text-align: center;
  font-size: 12px;
  margin: 7px 0 12px;
}
.account-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.account-columns > div + div {
  border-left: 1px solid #ddd;
  padding-left: 20px;
}
.account-columns h3 {
  margin: 0 0 7px;
}
.account-columns a,
.account-columns button {
  display: block;
  color: #111;
  background: none;
  border: 0;
  padding: 3px 0;
  font-size: 13px;
}
.orders-link {
  min-width: 74px;
}
.cart-link {
  padding: 3px 5px 3px 2px;
  align-items: end;
}
.cart-icon {
  position: relative;
  display: flex;
}
.cart-icon b {
  position: absolute;
  top: -3px;
  left: 18px;
  color: #f08804;
  font-size: 18px;
}
.subnav {
  height: 39px;
  background: var(--nav2);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 11px;
  gap: 3px;
  overflow: hidden;
  font-size: 12px;
}
.subnav a,
.subnav button {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  padding: 0 9px;
  border: 1px solid transparent;
  background: transparent;
  white-space: nowrap;
}
.subnav a:hover,
.subnav button:hover {
  border-color: #fff;
  text-decoration: none;
  color: #fff;
}
.modal {
  width: min(460px, calc(100% - 28px));
  padding: 0;
  border: 0;
  border-radius: 8px;
  box-shadow: 0 8px 28px #0007;
}
.modal::backdrop {
  background: #0009;
}
.modal > header {
  padding: 16px 22px;
  background: #f0f2f2;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal > header button {
  border: 0;
  background: transparent;
}
.modal-content {
  padding: 20px 24px;
}
.modal-content > .yellow-button,
.modal-content > select {
  width: 100%;
  margin: 8px 0;
}
.drawer-content {
  margin: -20px -24px;
}
.drawer-content h3 {
  padding: 15px 28px 5px;
}
.drawer-back {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--nav2);
  color: #fff;
  border: 0;
  padding: 14px 28px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.drawer-content a {
  color: #111;
  display: flex;
  justify-content: space-between;
  padding: 11px 28px;
}
.drawer-content a:hover {
  background: #eaeded;
  text-decoration: none;
}
.drawer-content hr {
  border: 0;
  border-top: 1px solid #ddd;
}
/* Amazon's hamburger menu is a full-height panel flush to the left edge. The
   `department-drawer` class was on the dialog but had no rule, so the shared
   `.modal` geometry won and it floated centred with rounded corners. */
.department-drawer {
  inset: 0 auto 0 0;
  width: min(365px, 88vw);
  max-width: none;
  height: 100%;
  max-height: 100%;
  margin: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  animation: drawer-in 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
}
@keyframes drawer-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .department-drawer {
    animation: none;
  }
}
.department-drawer > header {
  flex: none;
  background: var(--nav2);
  color: #fff;
}
.department-drawer > header button {
  color: #fff;
}
.department-drawer .modal-content {
  flex: 1;
  overflow-y: auto;
}
/* Department rows are <button> while Trending/Help rows are <a>; only the
   anchors were styled, so the departments rendered as default grey pills. */
.drawer-content button:not(.drawer-back) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 11px 28px;
  border: 0;
  background: none;
  color: #111;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}
.drawer-content button:not(.drawer-back):hover {
  background: #eaeded;
}
.divider-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #767676;
  font-size: 12px;
  margin: 15px 0;
}
.divider-label:before,
.divider-label:after {
  content: "";
  height: 1px;
  background: #ddd;
  flex: 1;
}
.zip-row {
  display: flex;
  gap: 8px;
}
.zip-row input,
.modal select {
  border: 1px solid #888;
  border-radius: 7px;
  padding: 9px;
}
.zip-row input {
  flex: 1;
}
.yellow-button,
.orange-button,
.outline-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 8px;
  min-height: 31px;
  padding: 5px 13px;
  color: #111;
  text-decoration: none;
  text-align: center;
}
.yellow-button {
  background: var(--yellow);
  box-shadow: 0 2px 5px #d5d9d980;
}
.yellow-button:hover {
  background: var(--yellow-hover);
  color: #111;
  text-decoration: none;
}
.yellow-button:disabled {
  opacity: 0.6;
}
.orange-button {
  background: #ffa41c;
}
.orange-button:hover {
  background: #fa8900;
  color: #111;
  text-decoration: none;
}
.outline-button {
  background: #fff;
  border-color: #d5d9d9;
  box-shadow: 0 2px 5px #d5d9d980;
}
.outline-button:hover {
  background: #f7fafa;
  text-decoration: none;
  color: #111;
}
.round {
  border-radius: 999px;
}
.full {
  width: 100%;
}
.toast {
  position: fixed;
  z-index: 200;
  top: 112px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 2px solid #067d62;
  border-radius: 6px;
  padding: 13px 22px;
  box-shadow: 0 4px 16px #0004;
  font-weight: bold;
  color: #067d62;
}
.home {
  background: var(--page);
}
.hero-arrow,
.rail-arrow {
  position: absolute;
  background: #fff0;
  border: 0;
  z-index: 4;
}
.hero-arrow {
  top: 0;
  height: 250px;
  width: 55px;
}
.hero-arrow:focus {
  outline: 2px solid #fff;
  box-shadow: inset 0 0 0 3px #007185;
}
.left {
  left: 0;
}
.right {
  right: 0;
}
.campaign-hero {
  position: relative;
  overflow: hidden;
}
.hero-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 6;
}
.hero-dots button {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.55);
}
.hero-dots button[aria-pressed="true"] {
  background: #fff;
}
.home-content {
  max-width: 1480px;
  margin: -24% auto 0;
  position: relative;
  z-index: 5;
  padding: 0 20px 20px;
}
.home-card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.home-card {
  background: #fff;
  padding: 20px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}
.home-card h2,
.rail-section h2 {
  font-size: 21px;
  line-height: 1.2;
  margin: 0 0 14px;
}
.quad-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;
}
.quad-grid a {
  color: #111;
  font-size: 12px;
}
.quad-grid a:hover {
  text-decoration: none;
  color: #111;
}
.quad-image {
  height: 126px;
  background: #f3f3f3;
  overflow: hidden;
  display: grid;
  place-items: center;
  margin-bottom: 5px;
}
.quad-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}
.single-card-image {
  flex: 1;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.single-card-image img {
  height: 275px;
  object-fit: contain;
}
.card-more {
  margin-top: auto;
  padding-top: 15px;
  font-size: 13px;
}
.department-strip {
  background: #fff;
  margin: 20px 0;
  padding: 20px;
}
.department-strip > div {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;
  margin-top: 14px;
}
.department-strip a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: var(--text);
  font-weight: 400;
  font-size: 13px;
}
.department-strip a:hover {
  color: var(--link);
  text-decoration: none;
}
.department-strip span {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background: #f3f3f3;
}
.department-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.category-products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 1;
}
.category-products img {
  width: 100%;
  height: 130px;
  object-fit: contain;
  background: #f3f3f3;
}
.rail-section {
  background: #fff;
  margin: 20px 0;
  padding: 20px 20px 15px;
}
.section-heading {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.section-heading a {
  font-size: 14px;
}
.rail-wrap {
  position: relative;
}
.product-rail {
  display: flex;
  gap: 26px;
  overflow: auto;
  scrollbar-width: none;
  padding: 4px 12px;
}
.product-rail::-webkit-scrollbar {
  display: none;
}
.rail-image {
  min-width: 190px;
  height: 210px;
  display: grid;
  place-items: center;
}
.rail-image img {
  max-height: 190px;
  object-fit: contain;
}
.rail-arrow {
  top: 65px;
  width: 45px;
  height: 100px;
  background: #fff;
  box-shadow: 0 1px 3px #888;
  border-radius: 0 7px 7px 0;
}
.rail-arrow.right {
  border-radius: 7px 0 0 7px;
}
.rail-arrow:disabled {
  display: none;
}
.deals-rail .product-rail {
  gap: 16px;
}
.deals-rail .product-card {
  min-width: 230px;
}
.personalized {
  background: #fff;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 25px;
  margin: 18px 0;
}
.personalized h2 {
  font-size: 24px;
  margin-bottom: 12px;
}
.personalized .yellow-button {
  min-width: 230px;
}
.personalized p {
  font-size: 11px;
  margin: 6px;
}
.product-card {
  min-width: 210px;
  display: flex;
  flex-direction: column;
}
.product-image {
  height: 215px;
  background: #f7f7f7;
  display: grid;
  place-items: center;
}
.product-image img {
  max-height: 195px;
  object-fit: contain;
}
.product-card-copy {
  padding: 10px 6px;
}
.product-title {
  color: #0f1111;
  font-size: 16px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.price {
  font-size: 28px;
  line-height: 1;
  color: #0f1111;
  white-space: nowrap;
}
.price sup {
  font-size: 13px;
  position: relative;
  top: -0.65em;
}
.price-link:hover {
  text-decoration: none;
}
.stars {
  color: #de7921;
  letter-spacing: -2px;
  font-size: 17px;
}
.ratings {
  font-size: 13px;
}
.muted {
  color: var(--muted);
}
.prime {
  color: #00a8e1;
  font-style: italic;
  font-size: 15px;
}
.prime:first-letter {
  color: #f08804;
}
.delivery-small {
  font-size: 13px;
  margin-top: 4px;
}
.deal-label {
  color: #cc0c39;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 6px;
}
.deal-label span {
  display: inline-block;
  background: #cc0c39;
  color: #fff;
  padding: 5px 7px;
  margin-right: 5px;
}
.search-page {
  min-height: 600px;
}
.result-bar {
  height: 48px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 5px #ddd;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 20px;
}
.result-bar label {
  margin-left: auto;
  font-size: 12px;
}
.result-bar select {
  padding: 7px;
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  background: #f0f2f2;
}
.search-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
}
.filters {
  padding: 18px 18px 50px;
  border-right: 1px solid #ddd;
}
.filters section {
  margin-bottom: 20px;
}
.filters h3 {
  font-size: 14px;
  margin: 0 0 7px;
}
.filters a {
  display: block;
  color: #111;
  padding: 3px 0;
}
.filters a:hover {
  color: #c7511f;
}
.filters a.active {
  color: #c7511f;
  font-weight: 700;
}
.see-more-brands {
  display: block;
  background: none;
  border: 0;
  padding: 3px 0;
  color: #007185;
  font-size: 13px;
  cursor: pointer;
}
.see-more-brands:hover {
  color: #c7511f;
  text-decoration: underline;
}
.results {
  padding: 16px 20px;
}
.empty-state,
.not-found,
.checkout-empty {
  padding: 70px 30px;
  text-align: center;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #565959;
  font-size: 12px;
}
.detail-page {
  padding: 14px 24px 60px;
  max-width: 1600px;
  margin: auto;
}
.detail-grid {
  display: grid;
  grid-template-columns: 60px minmax(340px, 38%) minmax(300px, 1fr) 245px;
  gap: 18px;
  margin-top: 18px;
}
.thumbs button {
  width: 46px;
  height: 58px;
  background: #fff;
  border: 1px solid #888;
  border-radius: 8px;
  margin-bottom: 10px;
  display: grid;
  place-items: center;
}
.thumbs button.active {
  border: 3px solid #007185;
  box-shadow: 0 0 0 2px #c8f3fa;
}
.thumbs img {
  max-height: 48px;
}
.main-product-image {
  position: sticky;
  top: 10px;
  align-self: start;
  text-align: center;
}
.main-product-image > img {
  height: 510px;
  width: 100%;
  object-fit: contain;
}
.main-product-image p {
  font-size: 11px;
  color: #565959;
}
.product-info h1 {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.28;
  margin: 0 0 5px;
}
.rating-line {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 9px 0;
}
.rating-line a {
  margin-left: 12px;
}
.product-info hr {
  border: 0;
  border-top: 1px solid #ddd;
}
.best-seller {
  display: inline-block;
  background: #e47911;
  color: #fff;
  padding: 5px 8px;
  position: relative;
}
.best-seller i {
  position: absolute;
  right: -8px;
  top: 0;
  border-top: 14px solid transparent;
  border-bottom: 13px solid transparent;
  border-right: 8px solid #fff;
}
.deal-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 5px;
}
.deal-price > span {
  font-size: 24px;
  color: var(--red);
  font-weight: 300;
}
.small-copy {
  font-size: 14px;
  line-height: 1.4;
}
.small-copy svg {
  display: inline;
}
.swatches {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.swatches button {
  background: #fff;
  border: 1px solid #888;
  padding: 9px 12px;
  border-radius: 7px;
}
.swatches button.selected {
  border: 3px solid #007185;
  padding: 7px 10px;
  background: #edf8fa;
}
.feature-table {
  display: grid;
  grid-template-columns: 105px 1fr;
  gap: 7px;
}
.product-info h2,
.recommendations h2,
.product-description h2,
.reviews h2 {
  font-size: 21px;
}
.bullets {
  padding-left: 20px;
  line-height: 1.42;
}
.bullets li {
  margin-bottom: 6px;
}
.buy-box {
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  padding: 16px 18px;
  align-self: start;
}
.buy-box .price {
  font-size: 28px;
}
.buy-box select {
  width: 100%;
  padding: 7px;
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  background: #f0f2f2;
  margin: 7px 0;
}
.buy-box > .yellow-button,
.buy-box > .orange-button {
  width: 100%;
  margin: 4px 0;
}
.stock {
  color: #007600;
  display: block;
  margin: 7px 0;
}
.fast-delivery {
  font-size: 13px;
}
.deliver-link {
  border: 0;
  background: transparent;
  color: var(--link);
  display: flex;
  gap: 5px;
  font-size: 12px;
  padding: 5px 0;
}
.secure {
  display: flex;
  gap: 7px;
  align-items: center;
  margin: 14px 0;
}
.shipping-table {
  display: grid;
  grid-template-columns: 75px 1fr;
  gap: 7px;
  font-size: 12px;
  margin-bottom: 14px;
}
.shipping-table span {
  color: #565959;
}
.recommendations,
.product-description,
.reviews {
  border-top: 1px solid #ddd;
  margin-top: 30px;
  padding: 24px 12px;
}
.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}
.recommendation-grid .product-card {
  min-width: 0;
}
.product-description > p {
  max-width: 900px;
  line-height: 1.55;
}
.trust-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.trust-row span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.trust-row svg {
  color: #007185;
}
.review-summary {
  display: flex;
  gap: 40px;
}
.review-summary > div:first-child b {
  font-size: 32px;
}
.review-summary > div:last-child > div {
  display: grid;
  grid-template-columns: 45px 220px 35px;
  gap: 8px;
  align-items: center;
  margin: 6px;
}
.review-summary i {
  height: 18px;
  background: #f0f2f2;
  border: 1px solid #bbb;
  border-radius: 4px;
  overflow: hidden;
}
.review-summary em {
  display: block;
  height: 100%;
  background: #ffa41c;
}
.review-card {
  max-width: 700px;
  margin-top: 25px;
}
.review-card small {
  color: #565959;
  display: block;
  margin: 6px 0;
}
.cart-page {
  background: #eaeded;
  padding: 24px 30px 50px;
  min-height: 600px;
}
.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
}
.cart-panel,
.subtotal-card,
.saved-section,
.empty-cart {
  background: #fff;
  padding: 20px;
}
.cart-panel h1 {
  font-size: 28px;
  font-weight: 400;
  margin: 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
}
.cart-price-label {
  text-align: right;
  color: #565959;
}
.cart-line {
  display: grid;
  grid-template-columns: 20px 190px 1fr auto;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;
}
.cart-line > input {
  margin-top: 80px;
}
.cart-image {
  height: 190px;
  display: grid;
  place-items: center;
}
.cart-image img {
  max-height: 180px;
}
.cart-line-copy h2 {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 7px;
}
.cart-line-copy small {
  display: block;
}
.cart-line-copy label,
.cart-line-copy p {
  font-size: 12px;
  margin: 7px 0;
}
.cart-line > .price {
  font-size: 19px;
  font-weight: bold;
}
.cart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.cart-actions select {
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  padding: 6px;
  background: #f0f2f2;
  box-shadow: 0 2px 5px #d5d9d980;
}
.cart-actions button,
.link-button {
  border: 0;
  background: none;
  color: var(--link);
  padding: 0;
}
.cart-actions i {
  height: 16px;
  width: 1px;
  background: #ddd;
}
.cart-subtotal {
  text-align: right;
  font-size: 18px;
  padding-top: 14px;
}
.cart-subtotal .price,
.subtotal-card .price {
  font-size: 19px;
  font-weight: bold;
}
.subtotal-card {
  height: max-content;
}
.free-shipping {
  display: flex;
  align-items: flex-start;
  color: #067d62;
  font-size: 12px;
}
.free-shipping > span {
  font-size: 19px;
  margin-right: 5px;
}
.subtotal-card > div:nth-of-type(2) {
  font-size: 18px;
}
.subtotal-card > label {
  display: block;
  font-size: 12px;
  margin: 8px 0;
}
.subtotal-card > .yellow-button {
  display: flex;
  width: 100%;
  margin: 14px 0;
}
.subtotal-card summary {
  display: flex;
  gap: 5px;
  color: var(--link);
  cursor: pointer;
}
.saved-section {
  margin-top: 20px;
  max-width: calc(100% - 320px);
}
.saved-line {
  display: grid;
  grid-template-columns: 130px 1fr auto;
  gap: 16px;
  border-top: 1px solid #ddd;
  padding: 15px 0;
}
.saved-line img {
  height: 120px;
  width: 120px;
  object-fit: contain;
}
.saved-line h3 {
  margin: 0;
  font-weight: 400;
}
.saved-line button {
  margin: 10px 10px 0 0;
}
.empty-cart {
  display: flex;
  gap: 35px;
  align-items: center;
}
.empty-cart h1 {
  font-size: 26px;
  font-weight: 400;
}
.empty-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}
.checkout-title {
  height: 90px;
  background: linear-gradient(#fff, #f3f3f3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  position: relative;
}
.checkout-title a {
  position: absolute;
  left: 20px;
}
.checkout-title img {
  width: 105px;
}
.checkout-title h1 {
  font-weight: 400;
  font-size: 28px;
  margin: 0;
}
.checkout-title > svg {
  position: absolute;
  right: 28px;
  color: #777;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 290px;
  gap: 30px;
  padding: 30px;
}
.checkout-section {
  display: grid;
  grid-template-columns: 36px 1fr;
  border-bottom: 1px solid #ddd;
  padding: 0 0 22px;
  margin-bottom: 20px;
}
.step-number {
  width: 24px;
  height: 24px;
  background: #c45500;
  color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
}
.checkout-section h2 {
  font-size: 18px;
  color: #c45500;
  margin: 2px 0 14px;
}
.address-form {
  max-width: 650px;
}
.address-form label {
  display: block;
  font-weight: bold;
  margin: 11px 0;
}
.address-form input,
.address-form select {
  display: block;
  width: 100%;
  border: 1px solid #888;
  border-radius: 4px;
  padding: 8px;
  margin-top: 4px;
}
.address-form small {
  display: block;
  font-weight: normal;
  margin-top: 4px;
}
.address-form .check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: normal;
}
.address-form .check input {
  width: auto;
  margin: 0;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.demo-payment {
  border: 1px solid #bbb;
  background: #f7fafa;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}
.demo-payment > span {
  width: 27px;
  height: 27px;
  background: #067d62;
  color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.demo-payment p {
  margin: 4px 0 0;
  color: #565959;
}
.checkout-section details summary {
  color: var(--link);
  display: flex;
  align-items: center;
  gap: 5px;
}
.promo-row {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}
.promo-row input {
  padding: 7px;
  border: 1px solid #888;
  border-radius: 5px;
}
.delivery-block {
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 16px;
}
.delivery-block h3 {
  color: #007600;
}
.checkout-item {
  display: grid;
  grid-template-columns: 85px 1fr auto;
  gap: 12px;
  border-top: 1px solid #ddd;
  padding: 15px 0;
}
.checkout-item img {
  height: 75px;
  width: 75px;
  object-fit: contain;
}
.checkout-item p {
  font-size: 12px;
  margin: 4px;
}
.checkout-item .price {
  font-size: 18px;
}
.form-error {
  border: 1px solid #c40000;
  border-left: 5px solid #c40000;
  border-radius: 5px;
  padding: 12px;
  color: #c40000;
  margin: 10px 0;
}
.order-summary {
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  padding: 16px;
  height: max-content;
}
.order-summary > button {
  width: 100%;
}
.order-summary > small {
  display: block;
  text-align: center;
  margin: 8px 0;
  line-height: 1.4;
}
.order-summary hr {
  border: 0;
  border-top: 1px solid #ddd;
}
.order-summary h2 {
  font-size: 18px;
}
.order-summary > div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px;
  font-size: 12px;
}
.order-total {
  display: flex;
  justify-content: space-between;
  color: #b12704;
  font-size: 18px;
}
.confirmation-page,
.orders-page,
.account-page,
.wishlist-page,
.preferences-page {
  max-width: 1100px;
  margin: 30px auto 70px;
  padding: 0 20px;
}
.confirmation-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  gap: 18px;
}
.confirmation-card > svg {
  color: #067d62;
  width: 44px;
  height: 44px;
}
.confirmation-card h1 {
  color: #067d62;
  font-weight: 400;
}
.confirmation-date {
  background: #f0f2f2;
  border-radius: 6px;
  padding: 12px;
  margin: 14px 0;
}
.order-id {
  font-size: 12px;
}
.confirmation-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
.orders-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.orders-heading h1 {
  font-size: 28px;
  font-weight: 400;
}
.orders-heading form {
  display: flex;
}
.orders-heading input {
  width: 250px;
  padding: 8px;
  border: 1px solid #888;
  border-radius: 7px 0 0 7px;
}
.orders-heading button {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--nav2);
  color: #fff;
  border: 0;
  border-radius: 0 7px 7px 0;
}
.orders-heading svg {
  width: 17px;
}
.order-tabs {
  display: flex;
  gap: 25px;
  border-bottom: 1px solid #ddd;
  margin: 8px 0 20px;
  padding-left: 10px;
}
.order-tabs > * {
  padding: 10px 0;
}
.order-tabs b {
  border-bottom: 3px solid #e77600;
  color: #c45500;
}
.empty-orders {
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 55px;
}
.empty-orders svg {
  color: #879596;
}
.empty-orders h2 {
  font-size: 18px;
  font-weight: 400;
}
.order-card {
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
.order-card > header {
  display: flex;
  gap: 30px;
  background: #f0f2f2;
  padding: 14px 20px;
  color: #565959;
  font-size: 12px;
}
.order-card > header span {
  display: flex;
  flex-direction: column;
}
.order-card > header b {
  color: #111;
  font-weight: 400;
  margin-top: 3px;
}
.order-number {
  margin-left: auto;
  text-align: right;
}
.order-body {
  padding: 20px;
}
.order-body h2 {
  font-size: 18px;
}
.order-line {
  display: grid;
  grid-template-columns: 100px 1fr auto 190px;
  gap: 18px;
  margin-top: 20px;
}
.order-line img {
  width: 90px;
  height: 90px;
  object-fit: contain;
}
.order-line .price {
  font-size: 16px;
}
.order-buttons button {
  width: 100%;
  margin-bottom: 8px;
}
.auth-page {
  min-height: 100vh;
  text-align: center;
  padding-top: 18px;
}
.auth-page > a > img {
  width: 105px;
  margin-bottom: 16px;
}
.auth-card {
  width: 350px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 22px 26px;
  text-align: left;
  box-shadow: 0 0 0 1px #00000005;
}
.auth-card h1 {
  font-size: 28px;
  font-weight: 400;
}
.auth-card label {
  font-size: 13px;
  font-weight: bold;
  display: block;
  margin: 12px 0;
}
.auth-card input {
  width: 100%;
  display: block;
  border: 1px solid #888;
  border-radius: 4px;
  padding: 8px;
  margin-top: 5px;
}
.auth-card input:focus {
  outline: 3px solid #c8f3fa;
  border-color: #007185;
}
.auth-card small {
  font-weight: normal;
  display: block;
  margin-top: 5px;
}
.auth-card > .yellow-button {
  width: 100%;
}
.auth-card p {
  font-size: 12px;
  line-height: 1.5;
  margin: 15px 0;
}
.auth-card details a {
  display: block;
  margin: 8px;
}
.new-divider {
  width: 350px;
  margin: 20px auto 12px;
  display: flex;
  align-items: center;
  color: #767676;
  font-size: 12px;
}
.new-divider:before,
.new-divider:after {
  content: "";
  height: 1px;
  background: #ddd;
  flex: 1;
}
.new-divider span {
  padding: 0 8px;
}
.auth-create {
  width: 350px;
}
.auth-footer {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  background: linear-gradient(#fff, #f7f7f7);
  padding: 25px;
  font-size: 11px;
}
.auth-footer a {
  margin: 0 10px;
}
.auth-footer p {
  margin-top: 15px;
}
.account-page h1,
.wishlist-page h1,
.preferences-page h1 {
  font-size: 28px;
  font-weight: 400;
}
.account-signin {
  background: #f7fafa;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.account-signin p {
  margin: 0;
}
.account-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.account-grid > a {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 18px;
  display: flex;
  gap: 18px;
  color: #111;
}
.account-grid > a:hover {
  background: #f7fafa;
  text-decoration: none;
}
.account-grid svg {
  width: 48px;
  height: 48px;
  color: #68727c;
}
.account-grid h2 {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 7px;
}
.account-grid p {
  color: #565959;
  margin: 0;
}
.account-links {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 25px;
  padding: 20px;
}
.account-links a {
  display: flex;
  justify-content: space-between;
  padding: 9px;
  border-top: 1px solid #eee;
}
.wishlist-page > section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}
.wishlist-page article {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid #ddd;
}
.wishlist-page article > img {
  width: 170px;
  height: 170px;
  object-fit: contain;
}
.wishlist-page article .price {
  display: block;
  margin: 8px 0;
}
.wishlist-page article button {
  display: block;
  margin-top: 8px;
}
.preferences-page {
  max-width: 700px;
}
.preferences-page > section {
  border-top: 1px solid #ddd;
  padding: 20px 0;
}
.preferences-page label {
  display: block;
  margin: 10px;
}
.preferences-page label input {
  margin-right: 10px;
}
.preferences-page select {
  padding: 9px;
  min-width: 260px;
}
.deals-page {
  background: #eaeded;
  padding-bottom: 50px;
}
.deals-hero {
  background: linear-gradient(120deg, #741a33, #e94569);
  color: #fff;
  padding: 34px max(30px, 8vw);
}
.deals-hero h1 {
  font-size: 34px;
}
.deals-hero p {
  font-size: 19px;
}
.deal-filters {
  height: 55px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 max(25px, 5vw);
  border-bottom: 1px solid #ddd;
  overflow: auto;
}
.deal-filters a {
  white-space: nowrap;
}
.deal-filters a.active {
  color: #c7511f;
  font-weight: 700;
  border-bottom: 3px solid #c7511f;
  padding-bottom: 3px;
}
.deal-count {
  color: var(--muted);
  font-size: 15px;
  font-weight: 400;
}
.deals-page > section {
  padding: 25px;
  max-width: 1450px;
  margin: auto;
}
.deals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}
.deals-grid .product-card {
  min-width: 0;
  background: #fff;
  padding: 12px;
}
.help-hero {
  background: #f3f3f3;
  padding: 45px max(30px, 12vw);
}
.help-hero h1 {
  font-size: 28px;
  font-weight: 400;
}
.help-hero form {
  position: relative;
  max-width: 780px;
}
.help-hero svg {
  position: absolute;
  left: 15px;
  top: 12px;
}
.help-hero input {
  width: 100%;
  padding: 14px 14px 14px 50px;
  border: 1px solid #888;
  border-radius: 7px;
  font-size: 16px;
}
.help-topics,
.help-article {
  max-width: 1000px;
  margin: 30px auto 70px;
  padding: 0 20px;
}
.help-topics > div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.help-topics > div > a {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  color: #111;
}
.help-topics h3 {
  font-weight: 400;
}
.help-article {
  max-width: 850px;
}
.help-article h2 {
  font-size: 28px;
  margin: 0 0 14px;
}
.qanda {
  padding: 25px 20px;
  max-width: 1450px;
  margin: auto;
}
.qanda-list {
  max-width: 780px;
  border-top: 1px solid var(--line);
}
.qanda details {
  border-bottom: 1px solid var(--line);
  padding: 12px 0;
}
.qanda summary {
  cursor: pointer;
  font-size: 14px;
  color: var(--link);
}
.qanda summary:hover {
  color: #c7511f;
}
.qanda details p {
  margin: 10px 0 4px;
  font-size: 14px;
}
.qanda details small {
  color: var(--muted);
  font-size: 12px;
}
.customers-say {
  background: #f7fafa;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  margin: 18px 0;
  max-width: 780px;
}
.customers-say h3 {
  font-size: 17px;
  margin: 0 0 8px;
}
.customers-say p {
  font-size: 14px;
  margin: 0 0 12px;
}
.sentiment-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sentiment-chips span {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 13px;
  background: #fff;
}
.sentiment-chips span.positive {
  border-color: #067d62;
  color: #067d62;
}
.review-list {
  display: flex;
  flex-direction: column;
  gap: 26px;
  max-width: 780px;
}
.review-author {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 6px;
}
.review-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #c7c7c7;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
}
.verified-purchase {
  color: #c45500;
  font-weight: 700;
  margin-left: 8px;
}
.review-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
}
.review-actions .outline-button {
  padding: 3px 14px;
  font-size: 13px;
}
.comparison,
.product-information {
  padding: 25px 20px;
  max-width: 1450px;
  margin: auto;
}
.comparison-scroll {
  overflow-x: auto;
}
.comparison table,
.product-information table {
  border-collapse: collapse;
  width: 100%;
  font-size: 13px;
}
.comparison th,
.comparison td,
.product-information th,
.product-information td {
  border: 1px solid var(--line);
  padding: 10px;
  text-align: left;
  vertical-align: top;
}
.comparison thead th {
  width: 22%;
  font-weight: 400;
}
.comparison thead img {
  width: 100%;
  max-width: 110px;
  height: 110px;
  object-fit: contain;
  display: block;
  margin-bottom: 6px;
}
.comparison thead span {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.comparison .this-item em {
  display: inline-block;
  margin-top: 6px;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  color: #067d62;
}
.comparison tbody th,
.product-information th {
  width: 180px;
  background: #f7f7f7;
  font-weight: 700;
}
.select-all {
  background: none;
  border: 0;
  color: var(--link);
  font-size: 13px;
  padding: 0 0 10px;
}
.select-all:hover {
  color: #c7511f;
  text-decoration: underline;
}
.yellow-button.disabled {
  opacity: 0.55;
  pointer-events: none;
}
.cart-recommendations {
  background: #fff;
  max-width: 1500px;
  margin: 14px auto;
  padding: 20px;
}
.cart-recommendation-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}
@media (max-width: 1100px) {
  .cart-recommendation-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .cart-recommendation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.not-found .dog-illustration {
  font-size: 100px;
}
.back-top {
  width: 100%;
  height: 50px;
  border: 0;
  background: #37475a;
  color: #fff;
}
.back-top:hover {
  background: #485769;
}
.footer-columns {
  background: var(--nav2);
  color: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 70px;
  padding: 45px max(40px, 15vw);
}
.footer-columns h3 {
  font-size: 16px;
}
.footer-columns a {
  display: block;
  color: #ddd;
  margin: 8px 0;
  font-size: 13px;
}
.footer-locale {
  background: var(--nav2);
  border-top: 1px solid #3a4553;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding: 28px;
}
.footer-locale > a,
.footer-locale > span {
  color: #ddd;
  border: 1px solid #84888d;
  padding: 8px 12px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.footer-locale > a:first-child {
  border: 0;
  margin-right: 60px;
}
.footer-locale img {
  width: 90px;
}
.footer-bottom {
  background: #131a22;
  color: #ddd;
  text-align: center;
  padding: 30px;
  font-size: 12px;
}
.footer-services {
  max-width: 1000px;
  margin: 0 auto 35px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 24px;
  text-align: left;
}
.footer-services a {
  color: #ddd;
}
.footer-services b,
.footer-services span {
  display: block;
}
.footer-services span {
  color: #999;
}
.footer-bottom > div:nth-child(2) a {
  color: #ddd;
  margin: 0 8px;
}
.footer-bottom p {
  margin: 7px;
}
.footer-bottom small {
  color: #999;
}
.cart-loading,
.checkout-loading {
  padding: 70px;
  text-align: center;
}
@media (max-width: 1100px) {
  .home-card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .department-strip > div {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .detail-grid {
    grid-template-columns: 52px minmax(300px, 40%) 1fr;
  }
  .main-product-image {
    position: static;
  }
  .buy-box {
    grid-column: 2/4;
  }
  .recommendation-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .deals-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .footer-services {
    grid-template-columns: repeat(4, 1fr);
  }
  .account-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .order-line {
    grid-template-columns: 90px 1fr auto;
  }
  .order-buttons {
    grid-column: 2/4;
    display: flex;
    gap: 8px;
  }
  .footer-columns {
    padding-left: 7vw;
    padding-right: 7vw;
  }
}
@media (max-width: 900px) {
  .language {
    display: none;
  }
  .search-box {
    min-width: 220px;
  }
}
@media (max-width: 760px) {
  body {
    font-size: 14px;
  }
  .header {
    height: auto;
    min-height: 104px;
    padding: 5px 8px;
    flex-wrap: wrap;
  }
  .logo {
    order: 0;
    width: 95px;
  }
  .account-wrap {
    margin-left: auto;
    order: 1;
  }
  .account {
    max-width: 130px;
  }
  .account strong {
    font-size: 12px;
  }
  .orders-link {
    display: none;
  }
  .cart-link {
    order: 2;
  }
  .search-box {
    order: 3;
    min-width: 100%;
    margin: 0;
    height: 42px;
  }
  .search-box select {
    display: none;
  }
  .language,
  .location {
    display: none;
  }
  .subnav {
    overflow: auto;
  }
  .subnav a:nth-last-child(-n + 3) {
    display: none;
  }
  .home-content {
    padding: 0 10px;
  }
  .hero-arrow {
    height: 160px;
    width: 35px;
  }
  .hero-arrow svg {
    width: 26px;
    height: 26px;
  }
  .home-card-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .department-strip {
    padding: 14px;
  }
  .department-strip > div {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .home-card {
    padding: 14px;
    min-height: 350px;
  }
  .home-card h2 {
    font-size: 18px;
  }
  .quad-grid {
    gap: 10px;
  }
  .quad-image {
    height: 90px;
  }
  .single-card-image img {
    height: 220px;
  }
  .rail-section {
    margin: 10px 0;
  }
  .rail-image {
    min-width: 150px;
  }
  .account-popover {
    position: fixed;
    left: 10px;
    right: 10px;
    top: 55px;
    width: auto;
  }
  .account-popover:before {
    display: none;
  }
  .detail-page {
    padding: 10px;
  }
  .detail-grid {
    display: flex;
    flex-direction: column;
  }
  .thumbs {
    display: flex;
    order: 1;
  }
  .main-product-image {
    order: 0;
    position: static;
  }
  .main-product-image > img {
    height: 330px;
  }
  .product-info {
    order: 2;
  }
  .buy-box {
    order: 3;
  }
  .recommendation-grid {
    display: flex;
    overflow: auto;
  }
  .recommendation-grid .product-card {
    min-width: 210px;
  }
  .trust-row {
    flex-direction: column;
  }
  .search-layout {
    display: block;
  }
  .result-bar {
    font-size: 12px;
  }
  .filters {
    border-right: 0;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 25px;
    overflow: auto;
    padding: 12px;
  }
  .filters section {
    min-width: 130px;
    margin: 0;
  }
  .results {
    padding: 12px;
  }
  .product-image {
    height: 165px;
  }
  .product-card-copy {
    padding: 8px 2px;
  }
  .product-title {
    font-size: 14px;
  }
  .cart-page {
    padding: 10px;
  }
  .cart-layout {
    display: block;
  }
  .subtotal-card {
    margin-top: 10px;
  }
  .cart-line {
    grid-template-columns: 110px 1fr auto;
  }
  .cart-line > input {
    display: none;
  }
  .cart-image {
    height: 120px;
  }
  .cart-image img {
    max-height: 115px;
  }
  .cart-line-copy {
    grid-column: 2/4;
    grid-row: 1;
  }
  .cart-line > .price {
    grid-column: 2/4;
    grid-row: 2;
    margin-top: 6px;
  }
  .saved-section {
    max-width: none;
  }
  .checkout-layout {
    display: flex;
    flex-direction: column;
    padding: 18px;
  }
  .order-summary {
    order: -1;
  }
  .checkout-title a {
    left: 12px;
  }
  .checkout-title img {
    width: 78px;
  }
  .field-row {
    grid-template-columns: 1fr;
  }
  .checkout-item {
    grid-template-columns: 65px 1fr auto;
  }
  .orders-heading {
    display: block;
  }
  .orders-heading input {
    width: 70%;
  }
  .order-tabs {
    overflow: auto;
  }
  .order-card > header {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .order-number {
    margin: 0;
    text-align: left;
  }
  .order-line {
    grid-template-columns: 80px 1fr;
  }
  .order-line > .price {
    grid-column: 2;
  }
  .order-buttons {
    grid-column: 1/3;
  }
  .account-grid {
    grid-template-columns: 1fr;
  }
  .wishlist-page article {
    grid-template-columns: 110px 1fr;
  }
  .wishlist-page article > img {
    width: 100px;
    height: 100px;
  }
  .deals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .deal-filters {
    gap: 20px;
  }
  .help-topics > div {
    grid-template-columns: 1fr;
  }
  .footer-columns {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    padding: 35px 25px;
  }
  .footer-locale {
    flex-wrap: wrap;
  }
  .footer-locale > a:first-child {
    width: 100%;
    justify-content: center;
    margin: 0;
  }
  .footer-services {
    grid-template-columns: repeat(2, 1fr);
  }
  .modal-content {
    padding: 18px;
  }
  .drawer-content {
    margin: -18px;
  }
  .review-summary {
    flex-direction: column;
  }
  .review-summary > div:last-child > div {
    grid-template-columns: 40px 1fr 35px;
  }
}
@media (max-width: 480px) {
  .home-card-grid {
    grid-template-columns: 1fr;
  }
  .department-strip > div {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .home-card {
    min-height: 400px;
  }
  .quad-image {
    height: 125px;
  }
  .detail-page {
    padding: 8px;
  }
  .main-product-image > img {
    height: 290px;
  }
  .cart-line {
    grid-template-columns: 85px 1fr;
  }
  .cart-image {
    height: 95px;
    grid-column: 1;
    grid-row: 1/3;
  }
  .cart-line-copy {
    grid-column: 2;
    grid-row: 1;
  }
  .cart-line > .price {
    grid-column: 2;
    grid-row: 2;
  }
  .cart-actions {
    flex-wrap: wrap;
  }
  .saved-line {
    grid-template-columns: 90px 1fr;
  }
  .saved-line > img {
    width: 80px;
    height: 80px;
  }
  .saved-line > .price {
    grid-column: 2;
  }
  .deals-grid {
    grid-template-columns: 1fr 1fr;
  }
  .deals-grid .product-title {
    font-size: 13px;
  }
  .checkout-title h1 {
    font-size: 22px;
  }
  .checkout-title > svg {
    display: none;
  }
  .order-card > header {
    grid-template-columns: 1fr;
  }
  .order-line {
    grid-template-columns: 70px 1fr;
  }
  .confirmation-card {
    padding: 16px;
  }
  .account-popover {
    font-size: 12px;
  }
  .footer-columns {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .footer-locale > span {
    font-size: 11px;
  }
}
```

### `app/search-fidelity.css`

*160 lines*

```css
.results-list {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.product-row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}
.product-row-image {
  height: 220px;
  background: #f7f7f7;
  display: grid;
  place-items: center;
}
.product-row-image img {
  max-height: 200px;
  max-width: 100%;
  object-fit: contain;
}
.product-row-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}
.product-row-title {
  color: #0f1111;
  font-size: 16px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px 0 50px;
  flex-wrap: wrap;
}
.pagination a {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text);
  background: #fff;
}
.pagination a:hover {
  background: #f7fafa;
  text-decoration: none;
}
.pagination a.current {
  background: #e3e6e6;
  border-color: #adb1b8;
  font-weight: 700;
}
.pagination a.disabled {
  color: #aaa;
  pointer-events: none;
  background: #f7f7f7;
}
.page-gap {
  padding: 0 4px;
  color: var(--muted);
}
.overall-pick-badge {
  display: inline-block;
  background: #067d62;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 3px;
}
.sponsored-label {
  color: var(--muted);
  font-size: 12px;
}
.product-row-meta {
  display: flex;
  align-items: center;
}
.bought-count {
  color: var(--muted);
  font-size: 13px;
}
.row-swatches {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.row-swatch {
  display: inline-flex;
  align-items: center;
  border: 1px solid #888;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  background: #fff;
}
@media (max-width: 760px) {
  .product-row {
    grid-template-columns: 140px 1fr;
    gap: 14px;
    padding: 16px 0;
  }
  .product-row-image {
    height: 140px;
  }
  .product-row-image img {
    max-height: 120px;
  }
  .product-row-title {
    font-size: 14px;
  }
  .bought-count,
  .sponsored-label,
  .row-swatch {
    font-size: 11px;
  }
}
@media (max-width: 480px) {
  .product-row {
    grid-template-columns: 96px 1fr;
    gap: 10px;
    padding: 12px 0;
  }
  .product-row-image {
    height: 96px;
  }
  .product-row-image img {
    max-height: 80px;
  }
  .product-row-body {
    gap: 4px;
  }
  .product-row-title {
    font-size: 13px;
    -webkit-line-clamp: 3;
  }
  .overall-pick-badge {
    font-size: 11px;
    padding: 2px 6px;
  }
}
```

### `app/mobile-fidelity.css`

*69 lines*

```css
.app-banner {
  display: none;
}
@media (max-width: 760px) {
  .app-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background: #f0f2f2;
  }
}

.hamburger-button {
  display: none;
}
@media (max-width: 760px) {
  .hamburger-button {
    display: flex;
    order: -1;
  }
}

.mobile-location-bar {
  display: none;
}
@media (max-width: 760px) {
  .mobile-location-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 8px 12px;
    background: #f0f2f2;
    border: 0;
    font-size: 13px;
  }
}

@media (max-width: 760px) {
  .subnav a:nth-last-child(-n + 3) {
    display: flex !important;
  }
  .subnav {
    overflow-x: auto;
    flex-wrap: nowrap;
    white-space: nowrap;
  }
}

.promo-rail {
  display: contents;
}
@media (max-width: 480px) {
  .promo-rail {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    margin: 0 -10px 10px;
    padding: 0 10px 4px;
  }
  .promo-rail .home-card {
    min-width: 78vw;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
}
```

---

## Tests

### `tests/commerce.test.ts`

*49 lines*

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { setQuantity, subtotalCents, validCart } from "../lib/commerce.ts";

const catalog = [
  { id: "a", price: 19.99, stockQuantity: 3 },
  { id: "b", price: 0.1, stockQuantity: 10 },
];

test("adds, updates, clamps, and removes cart quantities", () => {
  assert.deepEqual(setQuantity([], "a", 2, catalog), [
    { id: "a", quantity: 2, color: undefined },
  ]);
  assert.equal(
    setQuantity([{ id: "a", quantity: 2 }], "a", 99, catalog)[0].quantity,
    3,
  );
  assert.deepEqual(
    setQuantity([{ id: "a", quantity: 2 }], "a", 0, catalog),
    [],
  );
});

test("calculates totals in cents to avoid floating point drift", () => {
  assert.equal(
    subtotalCents(
      [
        { id: "a", quantity: 2 },
        { id: "b", quantity: 3 },
      ],
      catalog,
    ),
    4028,
  );
});

test("sanitizes malformed persisted cart state", () => {
  const result = validCart(
    [
      { id: "a", quantity: 2.9, color: "Blue" },
      { id: "missing", quantity: 4 },
      null,
      { id: "b", quantity: -1 },
    ],
    catalog,
  );
  assert.deepEqual(result, [{ id: "a", quantity: 2, color: "Blue" }]);
});
```

---

## Scripts & agent tooling

### `scripts/expand-catalog.py`

*117 lines*

```python
"""Reproducible local fixture expansion from the observed Amazon homepage.
Names and images are reference content; prices, ratings and inventory are demo fixtures.
"""
import json, shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = Path('/var/folders/1f/tr5wzfz93kz0z8jnp14m2k5r0000gn/T/browser-use/assets/6b4dd33d-dca9-47d9-8c41-5563c832f9c4/manifest.json')
assets = json.loads(manifest.read_text())['assets']
destination = root / 'public/assets/reference'
destination.mkdir(exist_ok=True)
mapping = {}
for asset in assets:
    if asset['contentType'] not in ['image/jpeg', 'image/png', 'image/webp', 'font/woff2']: continue
    target = destination / Path(asset['path']).name
    shutil.copy2(asset['path'], target)
    mapping[asset['name']] = '/assets/reference/' + target.name
(root / 'lib/reference-assets.json').write_text(json.dumps(mapping, indent=2))
(root / 'docs/reference-assets.json').write_text(json.dumps([{'url': a['url'], 'local': mapping[a['name']]} for a in assets if a['name'] in mapping], indent=2))

# image identifier | product name | department | subcategory | fixture price
rows = '''41ZPiDU6woL|Owala FreeSip Stainless Steel Water Bottle, 24 oz, Black Cherry|Sports & Outdoors|Water Bottles|29.99
61UEXxKIlrL|Amazon Basics Neoprene Dumbbell Hand Weights, Pair, 10 Pounds|Sports & Outdoors|Exercise & Fitness|29.49
61kqPiVuSAL|Owala FreeSip Sway Water Bottle, 30 oz, Denim|Sports & Outdoors|Water Bottles|34.99
61qm+2koyBL|Callaway Golf Supersoft Golf Balls, 12 Pack|Sports & Outdoors|Golf|24.99
61+hrZzQ18L|LifeStraw Personal Water Filter for Hiking, Camping and Travel|Sports & Outdoors|Camping & Hiking|17.47
71S4-NjoTDL|Fit Simplify Resistance Loop Exercise Bands, Set of 5|Sports & Outdoors|Exercise & Fitness|9.95
71CEj9AzUgL|Gaiam Yoga Block, Non-Slip Supportive Foam|Sports & Outdoors|Yoga|9.98
71DxWxvCwlL|LHKNL Rechargeable LED Headlamp, 2 Pack|Sports & Outdoors|Camping & Hiking|19.99
51prbUuRLHL|Wilson Championship Tennis Balls, Extra Duty|Sports & Outdoors|Tennis|4.99
61HHXRkRz6L|Rainleaf Microfiber Quick Dry Travel Towel|Sports & Outdoors|Camping & Hiking|12.99
61lbSexzAUL|Garneck Gold Stainless Steel Mixing and Serving Bowl, 9.4 Inch|Kitchen & Dining|Cookware|21.99
81YlKeBDwML|Homaxy Cotton Waffle Weave Kitchen Dish Cloths, 6 Pack|Kitchen & Dining|Kitchen Linens|9.99
71NpF4JP7HL|Electric Salt and Pepper Grinder Set with Adjustable Coarseness|Kitchen & Dining|Kitchen Tools|24.99
716cglvmUwL|Huusk Japanese Chef Knife, 8 Inch, Full Tang Handle|Kitchen & Dining|Cutlery|29.99
81tgAaVTpXL|Syntus Adjustable Cooking Apron with 2 Pockets|Kitchen & Dining|Kitchen Linens|12.99
71WZluQTSeL|Silicone Jumbo Muffin Pan, Non-Stick, Set of 2|Kitchen & Dining|Bakeware|15.99
311JdFvhtVL|Owala SmoothSip Slider Insulated Stainless Steel Coffee Tumbler|Kitchen & Dining|Coffee & Tea|24.99
71EeTMv8GKL|Quatish Portable Stainless Steel Travel Utensils with Case|Kitchen & Dining|Flatware|8.99
61Eut3FkasL|DeltaTrak Professional Digital Meat Thermometer|Kitchen & Dining|Kitchen Tools|19.99
716HuBmcRsL|TrendPlain Glass Olive Oil Sprayer and Dispenser, 16 oz|Kitchen & Dining|Kitchen Tools|9.99
81sjJMsIhOL|Ninja BN801 Professional Plus Kitchen System, 1400W, Auto-iQ|Kitchen & Dining|Small Appliances|159.99
81n5m6Ulw-L|ORIDOM Acacia Wood Lazy Susan Turntable, 14 Inch|Kitchen & Dining|Storage & Organization|24.99
71GP1cZneBL|Hanes EcoSmart Fleece Pullover Hoodie|Clothing, Shoes & Jewelry|Men|14.99
61CGDIk7SEL|Stelle Soft Leather Ballet Shoes for Girls|Clothing, Shoes & Jewelry|Kids|19.99
71QyRZzbaUL|Hanes EcoSmart Fleece Full-Zip Hooded Sweatshirt|Clothing, Shoes & Jewelry|Men|18.99
51wDsZxtTLL|Gildan Crew T-Shirts, Soft Cotton Multipack|Clothing, Shoes & Jewelry|Men|19.99
51rkKPruYvL|J.VER Long Sleeve Wrinkle-Free Dress Shirt|Clothing, Shoes & Jewelry|Men|22.99
71SRrNMlH0L|Carhartt K87 Loose Fit Heavyweight Pocket T-Shirt|Clothing, Shoes & Jewelry|Men|19.99
61Q13fPs1lL|Amazon Essentials Ribbed Scoop Neck Tank Tops, Pack of 2|Clothing, Shoes & Jewelry|Women|14.90
51ALuls6oZL|YEOREO Ease Straight Leg Workout Leggings|Clothing, Shoes & Jewelry|Women|29.99
61lFO3NRrKL|Hstyle Ruffle Ankle Socks, 6 Pairs|Clothing, Shoes & Jewelry|Women|13.99
61SuPkDGYfL|Crocs Unisex Classic Clog|Clothing, Shoes & Jewelry|Shoes|39.95
71tg-6WKPbL|LILLUSORY Open Front Lightweight Cardigan with Pockets|Clothing, Shoes & Jewelry|Women|32.99
61cUIJInYES|Douglas Chase Border Collie Plush Stuffed Animal, 16 Inch|Toys & Games|Stuffed Animals|29.95
81x+b41M2gL|Little Tikes T-Rex Cozy Coupe Ride-On Toy|Toys & Games|Outdoor Play|69.99
812WxRYZtGL|Hot Wheels City Ultimate Garage with 2 Die-Cast Cars|Toys & Games|Vehicles & Playsets|99.99
713lnXyKmjL|Melissa & Doug Giant Cheetah Lifelike Stuffed Animal|Toys & Games|Stuffed Animals|79.99
71xDrqyNzuL|Dragon Shield Matte Trading Card Sleeves, 100 Count|Toys & Games|Trading Cards|12.99
81yC3+wkGxL|GoSports Portable Cornhole Set with Bean Bags and Carry Case|Toys & Games|Outdoor Play|49.99
81VMo02DKoL|Maxi-Cosi Zelia 2 Luxe 5-in-1 Modular Travel System|Baby|Strollers|399.99
713ykHkGRJL|Mompush Meteor2 Reversible Bassinet Baby Stroller|Baby|Strollers|199.99
61IxcsVycqL|INFANS Folding Baby Changing Table with Bath Tub|Baby|Nursery|129.99
71bnHYPTufL|Pampers Sensitive Unscented Baby Wipes, Multi-Pack|Baby|Diapering|22.99
51HDr5mqkGL|Owala Kids Spill-Resistant Straw Tumbler, 15 oz, Unicorn|Baby|Feeding|14.99
71jOI43ommL|CRAFTSMAN VERSASTACK Lockable Rolling Tool Box|Tools & Home Improvement|Tool Storage|99.99
81XPDrUh9sL|DEWALT 20V MAX Cordless Drill and Impact Driver Combo Kit|Tools & Home Improvement|Power Tools|139.99
71eWRYTIS5L|iSpring 7-Stage Reverse Osmosis Water Filtration System|Tools & Home Improvement|Water Filtration|289.99
61opnzNAaFL|Skar Audio Dual 10 Inch 2400W Loaded Subwoofer Enclosure|Automotive|Car Electronics|249.99
61q403pmagL|Nakkaa Headlight Assembly for Nissan Maxima 2019–2021|Automotive|Lights & Accessories|189.99
71Ryl5xKbuL|LISEN Retractable USB C Car Charger, 84W, Dual Cable|Automotive|Car Electronics|19.99
71j2kJ+5R7L|Old Spice Invisible Solid Antiperspirant Deodorant for Men|Beauty & Personal Care|Personal Care|6.99
81+6huui9GL|VENOMKILLER 6-in-1 Tick Remover Tool Kit|Pet Supplies|Pet Grooming|12.99
71LDkpTW5fL|A Day in the Life of Zianna|Books|Children’s Books|12.99
714VRmqcVmL|Lenovo Idea Tab 11 Inch 2.5K Tablet, 8GB RAM, 256GB|Computers|Tablets|179.99
81-7N-LhOoL|MNN 15.6 Inch Full HD USB-C Portable Monitor|Computers|Monitors|69.99
81j2qQfvoxL|Dell 27 Inch 240Hz Full HD IPS Gaming Monitor|Computers|Monitors|179.99
61DeeFwkrpL|TP-Link Deco 7 Pro Tri-Band Wi-Fi 7 Mesh System|Computers|Networking|299.99
51wX5vhTB4L|JanSport Laptop Backpack with Ergonomic Shoulder Straps|Luggage & Travel|Backpacks|49.99
61oCbMGW57L|Natuvite Foldable Bamboo Luggage Rack with Storage Shelf|Luggage & Travel|Travel Accessories|39.99
71cBfxUjyYL|Nelko P21 Bluetooth Label Maker with Tape|Office Products|Office Electronics|22.99
81lQCqgoUNL|Guangna 240 Acrylic Paint Markers, Brush Tip|Arts & Crafts|Painting|39.99
616sd9yyK+L|HTVRONT Non-Stick Teflon Sheets for Heat Press, 12 Inch x 8 Feet|Arts & Crafts|Crafting|9.99
61CxVoRr7BL|Rit All Purpose Concentrated Color Remover|Arts & Crafts|Fabric Dye|4.99
717cXC1UQdL|GcFoir Self Adhesive Magnetic Sheets, 4 x 6 Inch, 80 Pack|Arts & Crafts|Crafting|19.99
81EcUzLN7FL|Eye Candy Premium Mica Pigment Powder, Orangeola, 50g|Arts & Crafts|Painting|12.99
71wGv7Fh2AL|Levoit Core Mini Air Purifier for Bedroom with Fragrance Sponge|Home & Kitchen|Air Quality|39.99
712wdsCwBkL|Gorilla Grip Absorbent Chenille Bath Rug, 24 x 17 Inch|Home & Kitchen|Bath|12.99
51gpc1r1PGL|EIUE Hotel Collection King Size Bed Pillows, 2 Pack|Home & Kitchen|Bedding|24.99
71dNwm+Vj8L|Scalloped Picture Frame with Real Glass, 5 x 7 Inch, Olive Green|Home & Kitchen|Home Décor|14.99
71SWO2d3WcL|Lasko Oscillating Pedestal Fan, Adjustable 47 Inch|Home & Kitchen|Fans|34.99
61pQJkr3hYL|Tapo LiDAR Robot Vacuum and Mop with Self-Emptying Dock|Home & Kitchen|Vacuums|229.99
71tsg-7mqHL|Handy Laundry Extra Large Nylon Laundry Bag, Navy Blue|Home & Kitchen|Storage & Organization|7.99
61-mTtLvQ6L|OWAAE Quiet Dehumidifier with Auto Shutoff, 1000 Sq Ft|Home & Kitchen|Air Quality|59.99
41R4vNxhXtL|XFSPYY Reusable Microfiber Cleaning Cloths, Green|Health & Household|Household Supplies|9.99
61UVPi1tYML|AcuRite Digital Indoor Thermometer and Humidity Meter|Health & Household|Home Environment|12.99
71mqaEv2KRL|HyperX Cloud III S Wireless Gaming Headset|Video Games|Gaming Accessories|129.99
81VrmGXhZKL|DJI Osmo Action 4 Essential Combo, Waterproof 4K Camera|Electronics|Cameras|199.99
71E7t6HQ2DL|CMF Buds Pro 2 Wireless Noise Cancelling Earbuds|Electronics|Audio|59.99
614YGaNBmUL|UGREEN Nexode Air 65W USB-C GaN Charger with Cable|Electronics|Accessories|29.99
61m+fKy7wzL|Garmin Forerunner 165 GPS Running Smartwatch, Black|Electronics|Wearable Technology|249.99
61AfYlS-zhL|UGREEN Uno 30W Robot USB-C GaN Fast Charger|Electronics|Accessories|19.99'''
catalog = json.loads((root / 'lib/catalog.json').read_text())
catalog['products'] = [p for p in catalog['products'] if not p['id'].startswith('ref-')]
for p in catalog['products']:
    if p['category'].startswith('Fashion'): p['category'] = 'Clothing, Shoes & Jewelry'
for i, row in enumerate(rows.splitlines()):
    image, name, category, sub, price = row.split('|')
    matches = [v for k,v in mapping.items() if k.startswith(image + '.')]
    if not matches: print('Missing', image); continue
    price = float(price)
    catalog['products'].append(dict(id=f'ref-{i+1}', name=name, price=price, originalPrice=round(price*1.25,2), categoryId=category, subCategoryId=sub, category=category, subCategory=sub, images=[matches[0]], description=f'{name}. Explore this selection from {category.lower()} and find the right fit for your everyday needs.', inStock=True, stockQuantity=25+i%35, rating=round(4.2+(i%7)/10,1), ratingCount=128+i*379, brand='Amazon Basics' if name.startswith('Amazon Basics') else name.split()[0], isDeal=i%3==0, isBestseller=i%4==0))
names=sorted(set(p['category'] for p in catalog['products']))
catalog['categories']=[dict(id=name,name=name,image=next(p['images'][0] for p in catalog['products'] if p['category']==name),order=i,subCategories=[dict(id=sub,name=sub) for sub in sorted(set(p['subCategory'] for p in catalog['products'] if p['category']==name))]) for i,name in enumerate(names)]
(root / 'lib/catalog.json').write_text(json.dumps(catalog,indent=2))
print(f"{len(catalog['products'])} products, {len(names)} populated departments")
```

### `.claude/capture.py`

*185 lines*

```python
#!/usr/bin/env python3
"""Append-only agent capture for the 8x assignment.

Wired to two Claude Code lifecycle events in .claude/settings.json:

  UserPromptSubmit -> capture.py prompt    (stdin carries the prompt verbatim)
  Stop             -> capture.py response  (stdin carries the transcript path)

Entries are appended to a JSONL ledger (.agent-logs/.ledger/<session>.jsonl) which
is the append-only source of truth. The human-readable .md is re-rendered from that
ledger on every write, so rendering never mutates captured text.

Prompts and responses are recorded verbatim. No truncation, no paraphrase.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# session_id arrives as untrusted stdin JSON and is used to build a filename.
# Without this, "../../.." escapes .agent-logs/ entirely (CWE-22).
SAFE_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")


def safe_session_id(value):
    value = (value or "").strip()
    return value if SAFE_ID.match(value) and not value.startswith(".") else "unknown-session"

REPO = Path(__file__).resolve().parent.parent
LOGS = REPO / ".agent-logs"
LEDGER = LOGS / ".ledger"
AUTHOR = os.environ.get("AGENT_LOG_AUTHOR", "Ali Ahmed")
PROJECT = REPO.name


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def read_event():
    try:
        return json.loads(sys.stdin.read() or "{}")
    except Exception:
        return {}


def last_assistant_text(transcript_path):
    """Final assistant text for the turn: the trailing run of assistant messages,
    excluding tool calls and thinking. Returns (text, model)."""
    p = Path(transcript_path) if transcript_path else None
    if not p or not p.exists():
        return "", ""
    records = []
    with p.open() as fh:
        for line in fh:
            try:
                records.append(json.loads(line))
            except Exception:
                continue
    chunks, model = [], ""
    for rec in reversed(records):
        rtype = rec.get("type")
        if rtype == "user":
            break  # reached the prompt that began this turn
        if rtype != "assistant":
            continue
        msg = rec.get("message") or {}
        model = model or msg.get("model", "")
        content = msg.get("content")
        if isinstance(content, str):
            chunks.append(content)
            continue
        for block in content or []:
            if isinstance(block, dict) and block.get("type") == "text":
                chunks.append(block.get("text", ""))
    text = "\n".join(t for t in reversed(chunks) if t.strip())
    return text.strip(), model


def transcript_model(transcript_path):
    _, model = last_assistant_text(transcript_path)
    return model


def append(session_id, kind, text, model, transcript_path=""):
    if not text.strip():
        return
    LEDGER.mkdir(parents=True, exist_ok=True)
    entry = {
        "type": kind,
        "timestamp": now_iso(),
        "model": model or "unknown",
        "text": text,
    }
    with (LEDGER / f"{session_id}.jsonl").open("a") as fh:
        fh.write(json.dumps(entry) + "\n")
    render(session_id)


def render(session_id):
    ledger_file = LEDGER / f"{session_id}.jsonl"
    if not ledger_file.exists():
        return
    entries = []
    with ledger_file.open() as fh:
        for line in fh:
            try:
                entries.append(json.loads(line))
            except Exception:
                continue
    if not entries:
        return

    prompts = [e for e in entries if e["type"] == "PROMPT"]
    # Filename is keyed off the first entry ever written for this session, which
    # never changes — keying it off the first PROMPT would rename (and orphan)
    # the file if a RESPONSE happened to land first.
    file_ts = entries[0]["timestamp"]
    first_ts = prompts[0]["timestamp"] if prompts else entries[0]["timestamp"]
    last_ts = prompts[-1]["timestamp"] if prompts else entries[-1]["timestamp"]
    short = session_id[:8]
    date = first_ts[:10]
    models = [e["model"] for e in entries if e.get("model") and e["model"] != "unknown"]
    model = models[-1] if models else "unknown"

    out = [
        "---",
        f"session_id: {session_id}",
        f"date: {date}",
        f"author: {AUTHOR}",
        f"model: {model}",
        "tool: claude-code",
        f"project: {PROJECT}",
        f"total_exchanges: {len(prompts)}",
        f"first_prompt_time: {first_ts}",
        f"last_prompt_time: {last_ts}",
        "---",
        "",
        f"# Session Log - {date}",
        "",
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`",
        "",
        "---",
        "",
    ]

    num = 0
    for entry in entries:
        if entry["type"] == "PROMPT":
            num += 1
        out.append(f"[LOG_ENTRY type={entry['type']} num={num} session={short}]")
        out.append(f"timestamp: {entry['timestamp']}")
        out.append(f"model: {entry['model']}")
        out.append("")
        out.append(entry["text"])
        out.append("")
        out.append("")

    LOGS.mkdir(parents=True, exist_ok=True)
    stamp = file_ts.replace(":", "-").replace("T", "_")[:19]
    (LOGS / f"{stamp}_{short}.md").write_text("\n".join(out))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    event = read_event()
    session_id = safe_session_id(event.get("session_id"))
    transcript = event.get("transcript_path", "")

    if mode == "prompt":
        append(session_id, "PROMPT", event.get("prompt", ""), transcript_model(transcript))
    elif mode == "response":
        text, model = last_assistant_text(transcript)
        append(session_id, "RESPONSE", text, model, transcript)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        # Never break the session because capture failed.
        pass
```

### `.claude/backfill.py`

*142 lines*

```python
#!/usr/bin/env python3
"""One-off backfill of .agent-logs/ from a Claude Code session transcript.

Capture hooks were installed partway through this project, so the turns before
that point exist only in the transcript Claude Code writes to
~/.claude/projects/<project>/<session>.jsonl.

This reads that transcript and reconstructs the same append-only ledger the live
hook writes. Prompts and responses are copied verbatim with their real recorded
timestamps. Nothing is reworded, reordered, or re-dated.

Records that are not user prompts are skipped: tool results, and harness-injected
turns (slash-command echoes, background task notifications, system reminders).

Usage: backfill.py <transcript.jsonl> [--write]
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LEDGER = REPO / ".agent-logs" / ".ledger"

# Harness-injected user turns — not typed by the human.
INJECTED = re.compile(
    r"<local-command-|<command-name>|<command-message>|<local-command-stdout>"
    r"|<task-notification>|\[SYSTEM NOTIFICATION - NOT USER INPUT\]",
    re.I,
)


def text_of(content):
    if isinstance(content, str):
        return content
    parts = []
    for block in content or []:
        if isinstance(block, dict) and block.get("type") == "text":
            parts.append(block.get("text", ""))
    return "\n".join(parts)


def strip_reminders(text):
    """Drop <system-reminder> blocks the harness appends to a real prompt."""
    return re.sub(r"<system-reminder>.*?</system-reminder>", "", text, flags=re.S).strip()


def extract(path):
    records = []
    with open(path) as fh:
        for line in fh:
            try:
                records.append(json.loads(line))
            except Exception:
                continue

    turns, pending, pending_ts = [], None, None
    for rec in records:
        rtype = rec.get("type")
        msg = rec.get("message") or {}
        ts = rec.get("timestamp", "")

        if rtype == "user":
            # Claude Code flags harness-injected turns (image metadata, skill
            # payloads, command echoes) with isMeta. Those are not user prompts.
            if rec.get("isMeta"):
                continue
            content = msg.get("content")
            # tool results are lists whose blocks are tool_result — never a prompt
            if isinstance(content, list) and not any(
                isinstance(b, dict) and b.get("type") == "text" for b in content
            ):
                continue
            raw = text_of(content)
            if INJECTED.search(raw):
                continue
            cleaned = strip_reminders(raw)
            if not cleaned:
                continue
            if pending:
                turns.append(pending)
            pending = {"prompt": cleaned, "prompt_ts": ts, "chunks": [], "model": ""}
            pending_ts = ts

        elif rtype == "assistant" and pending is not None:
            pending["model"] = pending["model"] or msg.get("model", "")
            for block in msg.get("content") or []:
                if isinstance(block, dict) and block.get("type") == "text":
                    t = block.get("text", "")
                    if t.strip():
                        pending["chunks"].append((ts, t))

    if pending:
        turns.append(pending)
    return turns


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    turns = extract(sys.argv[1])
    write = "--write" in sys.argv

    print(f"reconstructed turns: {len(turns)}")
    for i, t in enumerate(turns[:400], 1):
        first = t["prompt"].splitlines()[0][:72] if t["prompt"] else ""
        print(f"  {i:3}. {t['prompt_ts'][:19]}  resp_chunks={len(t['chunks']):2}  {first}")

    if not write:
        print("\n(dry run — pass --write to emit the ledger)")
        return 0

    session_id = Path(sys.argv[1]).stem
    LEDGER.mkdir(parents=True, exist_ok=True)
    out = LEDGER / f"{session_id}.jsonl"
    with out.open("w") as fh:
        for t in turns:
            fh.write(json.dumps({
                "type": "PROMPT",
                "timestamp": t["prompt_ts"],
                "model": t["model"] or "claude-sonnet-5",
                "text": t["prompt"],
            }) + "\n")
            if t["chunks"]:
                fh.write(json.dumps({
                    "type": "RESPONSE",
                    "timestamp": t["chunks"][-1][0],
                    "model": t["model"] or "claude-sonnet-5",
                    "text": "\n\n".join(c[1] for c in t["chunks"]),
                }) + "\n")
    print(f"\nwrote ledger: {out}")
    sys.path.insert(0, str(REPO / ".claude"))
    import capture
    capture.render(session_id)
    print("rendered markdown into .agent-logs/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### `.claude/settings.json`

*28 lines*

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/capture.py\" prompt",
            "timeout": 15
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/capture.py\" response",
            "timeout": 20
          }
        ]
      }
    ]
  }
}
```

### `.claude/launch.json`

*12 lines*

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "amazon-clone-dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}
```

---

## Reference documentation

### `docs/asset-sources.json`

*162 lines*

> Summarized — machine-generated or bulk data.

JSON array with **40** entries.

```json
[
  [
    "https://i.ibb.co/DP0x9Wp8/p1-1-1.webp",
    "/assets/product-1-0.webp"
  ],
  [
    "https://i.ibb.co/wF0m3Cgz/p1-1-2.webp",
    "/assets/product-1-1.webp"
  ]
]
```

### `docs/reference-assets.json`

*974 lines*

> Summarized — machine-generated or bulk data.

JSON array with **243** entries.

```json
[
  {
    "url": "https://m.media-amazon.com/images/G/01/gno/sprites/nav-sprite-global-1x-reorg-privacy._CB779528203_.png",
    "local": "/assets/reference/a131eec97c81ff48.png"
  },
  {
    "url": "https://m.media-amazon.com/images/I/61gkmopG9gL._SX1500_.jpg",
    "local": "/assets/reference/ab366241126dbbb4.jpg"
  }
]
```

### `docs/MartsTech-LICENSE.txt`

*22 lines*

```text
MIT License

Copyright (c) 2021 Martin Velkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Files listed but not dumped

### Project documentation (each is its own document)

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 348 lines
- [`CAPTURE-TEST.md`](./CAPTURE-TEST.md) — 149 lines
- [`FRONTEND-AUDIT.md`](./FRONTEND-AUDIT.md) — 191 lines
- [`README.md`](./README.md) — 126 lines
- [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md) — 184 lines

### Agent capture log

- `.agent-logs/.ledger/b66f2d37-f1e7-4272-b409-faa97e31ab7b.jsonl` — 51 lines
- `.agent-logs/2026-09-12_23-53-11_b66f2d37.md` — 1,612 lines

### Lockfile

- npm lockfile v3 — **91** resolved packages.
- Dumped as a summary because it is machine-generated and reproducible from `package.json`.

### Static assets

| Directory | Files |
|---|---:|
| `public/assets/` | 42 |
| `public/assets/reference/` | 243 |

Plus `app/favicon.ico` (binary).

# Amazon Storefront Clone

A polished, responsive Amazon-inspired storefront built with Next.js, React,
TypeScript, and a typed commerce backend. The experience covers the complete
shopping journey from discovery through a server-backed demo order.

## Product experience

- Amazon-style homepage with department navigation, promotional modules, and product rails
- Search with keyword matching, category and price filters, sorting, and pagination
- Product detail pages with image gallery, variants, ratings, availability, and buy box
- Persistent cart with quantity controls, line selection, recommendations, and totals
- Checkout form with validation and authoritative server-side order creation
- Account registration and sign-in with session-backed authentication
- Wishlist and saved items that persist across reloads
- Order confirmation and order history backed by the commerce API
- Delivery location and profile preferences
- Deals and help pages with responsive layouts
- Desktop and mobile responsive behavior with Amazon-inspired typography, spacing, and controls

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

The app uses a local JSON data store at `.data/backend.json`. Set
`AMAZON_BACKEND_DATA_FILE` to choose another file, or use `:memory:` for a
disposable store.

## Quality checks

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Main routes

| Route | Experience |
| --- | --- |
| `/` | Homepage and product discovery |
| `/s` | Search results and filters |
| `/product/[id]` | Product detail and add to cart |
| `/cart` | Cart management |
| `/checkout` | Shipping and order placement |
| `/order-confirmation` | Newly placed order |
| `/orders` | Order history |
| `/account` | Account and authentication |
| `/wishlist` | Saved products |
| `/preferences` | Delivery preferences |
| `/deals` | Deals browsing |
| `/help` | Help center |

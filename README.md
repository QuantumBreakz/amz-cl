# Amazon storefront assignment

A responsive Amazon.com storefront reconstruction built for a one-day clone assignment. It includes a dense storefront homepage, search and filtering, product detail pages, a persistent cart and saved list, demo sign-in, checkout, order confirmation, order history, preferences, deals, and help pages.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

## Reference lineage

This implementation was authored specifically for the assignment after reviewing the latest available revisions of three public repositories:

- `basir/amazon-clone` (`4426e89`, July 14, 2026): catalog structure, seeded commerce content, and feature inventory.
- `sadmann7/amzn-web` (`fb670e8`, May 26, 2023): persisted cart and typed commerce architecture reference.
- `MartsTech/amazon-clone` (`13998f4`, June 23, 2022): interaction patterns and the MIT-licensed Amazon-style logo asset. Its license is preserved in `docs/MartsTech-LICENSE.txt`.

The application code in this repository is original. Product and category images are localized from the URLs included in Basir's public demo data; their source mapping is preserved in `docs/asset-sources.json`.

Amazon and its marks are trademarks of Amazon.com, Inc. This is an independent educational reconstruction. Checkout creates local demo orders and never requests or processes payment information.

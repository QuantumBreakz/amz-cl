# Content sourcing

This document inventories the product data, imagery, and third-party material in the
repository. It describes the content served by a deployed build and retains the
provenance of material that was removed during the public-demo cleanup.

## Catalog: `lib/catalog.json`

The catalog contains **191 products**. Every current entry uses generic, unbranded
product copy and original generated artwork under `public/assets/original/`.

The IDs preserve two historical groups so routes, carts, tests, and screenshots remain
stable:

- **171 `ref-*` entries** (`ref-1` through `ref-171`) were initially added by the former
  version of `scripts/expand-catalog.py`. Before the public-demo cleanup, these entries
  used real product names and photographs observed on amazon.com. They existed to give
  search results, rails, category grids, and product pages the density of a real Amazon
  layout during development. Their names, brands, descriptions, and photographs have
  now been replaced; only the legacy IDs and synthetic commerce values remain.
- **20 unprefixed entries** (`1` through `20`) came from the original seed/demo catalog.
  Before cleanup, their names included third-party brands and their 40 image sources
  were hosted by ImgBB. Their copy and imagery are now generic and original as well.

The mix still exists because the original 20-record fixture supplies stable commerce
routes while the 171-record range supplies useful catalog density. The `ref-*` prefix
now identifies historical lineage only; it does not mean the entry contains reference
content.

`scripts/replace-reference-content.mjs` is the auditable migration that applies the
generic copy and local original-image mapping. `scripts/expand-catalog.py` is retained
as a deliberately failing tombstone so the old Amazon CDN import cannot be run again by
mistake.

## Retired Amazon reference assets

The repository previously contained **243 files** copied from `m.media-amazon.com`,
including product photography, homepage campaign art, and a navigation sprite. They
were mapped by `docs/reference-assets.json` and `lib/reference-assets.json`, stored in
`public/assets/reference/`, and consumed by both the catalog and homepage. Because
anything under `public/` is deployed, these were shipped content rather than internal
development fixtures.

That runtime supply chain is now retired:

- `public/assets/reference/` was deleted;
- `lib/reference-assets.json` was deleted;
- `components/home.tsx` uses four original campaign images and original department art;
- every catalog and category image points to `public/assets/original/`; and
- `next.config.ts` fails a production build if the retired directory or runtime map
  returns, or if the catalog/homepage references `/assets/reference/` or
  `m.media-amazon.com`.

`docs/reference-assets.json` remains only as a machine-readable historical provenance
record. It marks all former paths `shipped: false`, records that the runtime mapping was
removed, and lists the 21 original replacements. It is documentation and is never
imported by application code.

## Retired ImgBB set: `docs/asset-sources.json`

The original file recorded **40 `i.ibb.co` URLs** used by the first 20 products,
category tiles, and banners. ImgBB is an image host rather than a stock-photo licensor.
Its [Terms of Service](https://imgbb.com/tos) did not provide a clear redistribution
right for unknown uploaders' product photography.

The 40 downloaded files were removed from `public/assets/` and replaced with original,
unbranded generated artwork. `docs/asset-sources.json` is a migration/provenance record:
it marks every former URL as retired and identifies its replacement. No page or catalog
entry loads from ImgBB.

## Original generated artwork

`public/assets/original/catalog/` contains 17 department-oriented product compositions,
and `public/assets/original/campaign/` contains four wide homepage campaigns. Five
earlier generic replacements remain directly under `public/assets/original/`. The image
prompts required blank or unlabeled products, no logos, no trademarks, no brand names,
no readable packaging, and no recognizable copyrighted characters. These files were
generated specifically for this project rather than copied from a product listing or
marketing campaign.

## MartsTech MIT material

`docs/MartsTech-LICENSE.txt` applies only to these copied or derived files:

- `public/assets/amazon-logo.svg` — byte-for-byte copy of the upstream
  `public/icons/logo.svg`;
- `public/assets/amazon-logo-light.svg` — a color-modified derivative of that SVG; and
- `app/favicon.ico` — byte-for-byte copy of the upstream `public/icons/favicon.ico`.

No catalog dataset is covered by that MIT license. The MIT notice and permission text
are retained in `docs/MartsTech-LICENSE.txt`, and the README Credits section links to
the full notice, satisfying the attribution requirement for the covered files.

## Project authorship

Ali Ahmed is the sole contributor and developer credited for this repository. A name
inside a preserved third-party license identifies its copyright holder and is not a
project contributor credit.

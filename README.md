# Amazon.com rebuild

A rebuild of the amazon.com desktop and mobile storefront: homepage, search/PLP,
product detail, cart, checkout, order confirmation, order history, account, auth,
deals and help. Next.js 16 (App Router), React 19, TypeScript, plain CSS.

```bash
npm install
npm run dev        # http://127.0.0.1:3000
npm run typecheck && npm test && npm run build
```

## Deploy

No environment variables, no database, no external services — the catalog is local
JSON and all shopping state lives in `localStorage`. Any Next.js host works:

```bash
npx vercel --prod        # or: npm run build && npm start
```

`npm start` binds all interfaces (not just loopback), so container hosts like Railway,
Render and Fly work without extra flags. The production build was smoke-tested on every
route — all 200, with `/nope-404` correctly returning 404.

## The approach: measure, don't eyeball

The interesting decision on this build was how to judge "does it look like Amazon."
Screenshot comparison kept producing false confidence — I twice declared pages
"verified" that had real defects in them. So the method changed to extracting
**computed CSS from the live site** and diffing it numerically against ours.

That produced an exact match on the structural values:

| | amazon.com | This build |
|---|---|---|
| Body font | `"Amazon Ember", Arial` | identical |
| Header height / background | 60px / `rgb(19,25,33)` | 60px / `rgb(19,25,33)` |
| Subnav height / background | 39px / `rgb(35,47,62)` | 39px / `rgb(35,47,62)` |
| Homepage card height | 420px | 420px |
| Card heading | 21px / 700 | 21px / 700 |
| Logo width | 114px | 114px |

The same method found the gaps: subnav font was 14px against Amazon's 12px, the
search box 42px against 40px, and the site had **no CSS transitions at all**
(`transition` appeared zero times across all three stylesheets — Amazon uses
`0.1s linear` on its controls).

It also quantified content gaps rather than guessing at them. Amazon's homepage
carries 20 card modules; this build had 8 — and all 8 matched Amazon's, so the
work was additive, not corrective. Six modules were added against real catalog
products. The subnav was missing *Coupons* and *Disability Customer Support*.

## Structural findings worth calling out

- **Search results were the wrong shape.** The PLP reused the homepage's grid of
  vertical tiles. Amazon uses a vertical list of full-width horizontal rows. Rebuilt
  as a separate `ProductRow` so the grid card stayed untouched for rails and
  related-products.
- **Price "ranges" weren't ranges.** The sidebar said "$25 to $50" but only ever
  applied a `max`, so that bucket returned everything under $50 including $9.99
  items. Added a real lower bound.
- **No pagination.** All 191 results rendered on one page; Amazon paginates at 16.
- **Deals filters were decoration.** Five pills, all `href="#deals"`. Now filter off
  real catalog fields and produce distinct result sets.
- **Preferences silently destroyed your delivery location.** Local state was seeded
  from `useState(store.location)`, which captures the *pre-hydration* default. The
  form showed "Pakistan" while the stored value was something else, and saving wrote
  the stale default back. Found by exercising the flow, not by reading the code.

## Automated checks beat visual inspection

Three of the defects above were found by scripted checks rather than looking:

- `scrollWidth > clientWidth` catches horizontal overflow that is nearly invisible
  by eye. It caught a regression **I introduced** — a 6-column department grid that
  broke mobile.
- Hit-testing every heading/link/button's centre point with `elementFromPoint`
  finds z-index and overlay bugs across a full 6,800px page, not just the viewport.
- Cross-referencing every `className` in the codebase against defined CSS selectors
  found 13 classes with no styling at all — including `.department-strip`, which was
  rendering raw full-size images with overlapping captions.

## Deliberately not done

- **No wholesale import of an existing GitHub clone.** The popular Next.js Amazon
  clones are Tailwind/Firebase builds driven by the FakeStore API's generic catalog;
  one candidate was unlicensed. Importing would have replaced exactly-matching design
  tokens and real product imagery with placeholder data.
- **No fabricated product attributes.** Amazon's PLP carries category-specific facets
  (Connectivity, Battery Life, Water Resistance). Ours doesn't, because the catalog has
  no such fields and inventing them across 191 products would be fake depth.
- **No real payments, auth, or backend.** Checkout creates a local demo order and
  never requests payment details.
- **USD throughout.** Amazon geo-localises currency; simulating that is a rabbit hole
  with no payoff here.

## Agent capture

Prompts and responses are captured automatically to `.agent-logs/` via Claude Code
`UserPromptSubmit` and `Stop` hooks. See [CAPTURE-TEST.md](./CAPTURE-TEST.md) for the
mechanism, verification, and what broke on the way.

The log is unedited, including the dead ends — the regressions I introduced and later
caught, the pushback when I called something finished prematurely, and the pivot from
"import a clone" to measuring the real site.

## Attribution

Reference lineage and image sourcing are documented in `docs/`. Amazon and its marks
are trademarks of Amazon.com, Inc. This is an independent educational reconstruction;
checkout creates local demo orders only.

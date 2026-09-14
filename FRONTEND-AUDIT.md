# Frontend Audit

Review of render behaviour, hook lifecycle, CSS class surface, and container
overflow. Companion to `SECURITY-AUDIT.md` (application security) and
`ARCHITECTURE.md` (system design).

Every finding was **measured in a running browser**, not inferred from reading
code. Where a fix is claimed, the before/after numbers are given. Checks that
found nothing are recorded too, so the negative results are auditable.

**Audit date:** 2026-09-14 · **Commit:** `8e36367`
**Scope:** `components/`, `app/`, and the three stylesheets (`globals.css`,
`search-fidelity.css`, `mobile-fidelity.css`).

## Method

Reading code reliably finds *missing* things and reliably misses *behavioural*
things. Three of the five findings below are invisible in a diff:

- **Render waste** cannot be seen in the DOM. React reconciliation produces
  byte-identical markup whether a component re-rendered or not, so the only way
  to measure it is to count renders. A temporary counter was added to the
  component, the interaction driven, the counter read, and the instrumentation
  removed.
- **Overflow** was detected numerically (`scrollWidth > clientWidth`, and
  `getBoundingClientRect().right > clientWidth`) rather than by eye, with
  elements clipped by a scrolling ancestor excluded so that horizontal rails
  do not register as false positives.
- **Class leakage** was found by cross-referencing every `className` literal in
  JSX against every class selector in the stylesheets, in both directions.

---

## Findings

### FE-01 — Store context value had unstable identity · **High** · FIXED

**Where:** `components/store.tsx`

The provider's value was a fresh object literal on every render:

```tsx
return { ...state, ready, toast, total, count, add, quantity, /* ... */ };
```

Every consumer of `useStore()` re-rendered on any state change, including
components whose data had not changed. `subtotalCents` does a catalog lookup per
cart line, so `total` ran O(lines x catalog) on every render as well.

**Fix.** Derived values wrapped in `useMemo`, the seven actions in `useCallback`,
and the returned object in `useMemo`. All seven actions already used the
functional `setState` form, so none needed to close over current state — their
dependency arrays are genuinely empty rather than empty-by-omission.

---

### FE-02 — `placeOrder` returned `null`, breaking the checkout redirect · **High** · FIXED

**Where:** `components/store.tsx`

`placeOrder` must return the new order id **synchronously** — checkout redirects
on it. An intermediate refactor computed the id inside the `setState` updater,
which React may run later, so the function returned `null` and `router.push()`
never fired.

This is the failure mode of the previous fix: making the updater pure is correct
in general, but not when the caller needs a value back in the same tick. A ref
tracks the latest cart instead — fresh data, stable identity, synchronous return.

**Verified end to end:** cart → checkout → redirect fires, order total $202.96,
cart cleared.

---

### FE-03 — Rails re-rendered on every carousel tick · **Medium** · FIXED

**Where:** `components/home.tsx`

`Home` owns the hero carousel's `slide` state. Every arrow click, and every
auto-advance tick, re-rendered all six `Rail` components, each of which
re-filtered the 191-product catalog. `Rail`'s props never change.

**Measured** with a temporary render counter, four carousel clicks:

| | Rail renders caused by carousel |
|---|---|
| Before | **36** |
| After (`memo` + `useMemo` on the filter) | **0** |

The instrumentation was removed after measuring; the A/B was run by toggling
`memo` off and on so the baseline is real, not assumed.

---

### FE-04 — Department drawer rendered as a centred dialog · **Medium** · FIXED

**Where:** `app/globals.css`, class applied in `components/shell.tsx`

`.department-drawer` was applied to the `<dialog>` but **had no CSS rule
anywhere**. The shared `.modal` geometry therefore won, and Amazon's hamburger
menu rendered as a floating rounded box in the middle of the screen.

| | x | y | size | radius |
|---|---|---|---|---|
| Before | 17 | 37 | 341 x 738 | 8px |
| After | 0 | 0 | 365 x 768 (full height) | 0 |

Now flush to the left edge, full viewport height, square, dark header, with the
long department list scrolling inside the panel and a slide-in transition that
respects `prefers-reduced-motion`. Drill-down into a department (back button,
heading, sub-links) verified intact at both breakpoints.

---

### FE-05 — Department rows rendered as grey pills · **Medium** · FIXED

**Where:** `app/globals.css`, markup in `components/shell.tsx`

Inside the drawer, the Trending and Help rows are `<a>`; the **Shop by
Department** rows are `<button>`. Only `.drawer-content a` was styled, so the 18
department rows fell back to default browser button chrome and rendered as
inline grey pills next to correctly-styled full-width link rows.

This is the subtle half of FE-04 and the reason the drawer looked wrong in two
different ways at once. Department rows now match the anchor rows exactly —
measured at 365px wide against the links' 365px, transparent background, no
border, right-aligned chevron.

---

### FE-06 — Dead CSS · **Low** · FIXED

`.hero-product` and the `.results-grid` rules were left over from the grid
layout that `/s` replaced with horizontal product rows. Removed; braces verified
balanced. This follows an earlier pass that removed 35 dead rule blocks
(167 lines).

---

## Checks performed that found nothing

| Area | Method | Result |
|---|---|---|
| Rules of Hooks | scope-aware AST-style check (a naive line-based heuristic gave 4 false positives on files with multiple components, and was rewritten) | **0 violations** |
| Effect dependencies | every `useEffect` inspected | all 9 have dependency arrays |
| Effect cleanup | timers/subscriptions traced | cleanups present on both effects that need one; no listeners or observers left attached |
| Nested component definitions | searched for components declared inside render | none |
| Missing/unstable `key` props | all 9 flagged `.map()` calls reviewed | all are data transforms, not element lists — 0 real issues |
| Horizontal overflow | `scrollWidth > clientWidth` across every element on `/`, `/s`, `/dp/1`, `/cart` at 1280px and 375px | **0 overflowing**, `document.scrollWidth === 375` on mobile |
| Viewport spill | `getBoundingClientRect().right`, excluding elements clipped by a scrolling ancestor | **0 unclipped spills** (1,252 raw hits on `/` were all legitimate rail-carousel children) |
| Stylesheet imports | checked all three stylesheets are actually imported | all three imported in `app/layout.tsx` |
| Console errors | read after each navigation | none beyond dev-only HMR websocket noise |

### One flagged item that is not a defect

`.best-seller` reports `scrollWidth` 111 vs `clientWidth` 103. The 8px delta is
`.best-seller i` — a `position: absolute; right: -8px` triangle that cuts the
ribbon notch into the badge's right edge. 103 + 8 = 111 exactly. Intentional
design, not overflow. Recorded here because an automated overflow check will
flag it again on the next audit.

---

## Accepted: inert marker classes

Eight classes appear in JSX with no corresponding CSS rule:

`checkout-main` · `checkout-wide` · `help-page` · `link-text` · `lower-cards` ·
`order-list` · `page-step` · `reference-home`

Each was checked individually and **none causes a visual defect**:

- `link-text` sits on anchors, which already inherit the correct Amazon link
  colour from the base `a` rule.
- `page-step` is redundant with `.pagination a` / `.pagination a.disabled`,
  which carry the styling.
- `checkout-wide` marks the content cell of checkout steps 2 and 3, but
  `.checkout-section` is `grid-template-columns: 36px 1fr` — those cells are
  already full width, so the class expresses intent rather than applying it.
- The rest are semantic wrappers on elements styled by a sibling class.

They are left in place as readable hooks for future styling. They are documented
here rather than silently removed so the gap between markup and stylesheet is a
recorded decision instead of an unanswered question at the next audit.

## Known limitation

Render-count measurements were taken in development, where React StrictMode
double-invokes renders (hence 12 mount renders for 6 rails). This inflates
absolute counts but not the before/after delta, which is what FE-03 claims.

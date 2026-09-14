# Amazon Storefront Clone — Final Submission Walkthrough

**Target runtime:** 4:30–4:50 (never exceed five minutes)<br>
**Recording:** camera on, voiceover on, deployed HTTPS URL in a private window

Replace `YOUR_DEPLOYED_URL` before recording. The walkthrough should feel like a
short product demo: keep the pointer moving, narrate the customer benefit, and
show each state change on screen.

## Preflight (before pressing record)

1. Open `YOUR_DEPLOYED_URL` in a private/incognito window and confirm the homepage
   loads without a sign-in requirement.
2. Close unrelated tabs, terminals, notifications, browser extensions, and any
   personal information. Keep the browser at a readable zoom level.
3. Confirm the microphone and camera are working. Keep your face visible for the
   entire recording and share only the browser window.
4. Keep these submission links ready:
   - **Live product:** `YOUR_DEPLOYED_URL`
   - **Repository:** https://github.com/QuantumBreakz/amz-cl
5. Use a throwaway account during the demo (for example,
   `ali.demo+<timestamp>@example.com`). Never show a real password on screen.

## Run of show

### 0:00–0:25 — Open with the product

**On screen:** Homepage at the top of the page. Slowly move across the header,
search bar, department navigation, hero area, and first product rail.

**Say:**

> “This is my Amazon storefront clone: a responsive shopping experience that
> takes a customer from discovery to a server-backed order. The interface covers
> the homepage, search, product detail, cart, checkout, account, wishlist,
> preferences, deals, and help.”

Point out the delivery location, account entry point, cart count, and the
department menu so the information architecture is immediately clear.

### 0:25–0:58 — Search and discovery

**On screen:** Click the search box labelled **Search Amazon** and type
`active gear`. Pause long enough for the suggestion list to appear, then submit.
On the results page, apply a category or price filter, change the sort order, and
move to the next page.

**Say:**

> “Search suggestions are served from the catalog, and the results page supports
> real keyword matching, filters, sorting, and pagination. Each change is reflected
> in the URL, so the view can be revisited or shared.”

Show that the result cards change after the filter and that the page number changes
after pagination. Do not spend time reading individual product copy.

### 0:58–1:35 — Product detail and cart

**On screen:** Open a result. Show the product image gallery, title, rating,
price, availability, delivery message, and buy box. Click **Add to Cart**, open
the cart, increase the quantity once, then decrease it back.

**Say:**

> “The product page exposes the information a buyer needs before purchasing. Cart
> mutations are persisted through the commerce backend, and the subtotal is
> calculated from the catalog’s authoritative price.”

Briefly show the recommendation rail or saved-items action if visible, then leave
the item in the cart for checkout.

### 1:35–2:25 — Account, checkout, and validation

**On screen:** Open **Account** and choose registration. Enter a throwaway email,
the name **Ali Ahmed**, and a demo password. Submit and return to the cart. Click
**Proceed to checkout**.

Fill the shipping form:

- Full name: `Ali Ahmed`
- Street address: `42 Test Avenue`
- City: `Karachi`
- State / Province: `Sindh`
- ZIP / Postal code: `75500`

Click **Place your order**.

**Say:**

> “Registration creates a real server session. The guest cart is carried into the
> signed-in account, checkout validates the shipping fields, and placing the order
> is an authoritative backend mutation rather than a client-only success screen.”

If the form displays an error, correct the field visibly and continue; the recovery
is useful evidence that validation is wired up.

### 2:25–2:58 — Confirmation and order history

**On screen:** Show the confirmation heading **Order placed, thank you!**, order
number, shipping name, and purchased item. Navigate to **Your Orders** and show the
same item and total in the order list.

Reload the orders page once.

**Say:**

> “The confirmation and order history read the order that was just created. A full
> reload keeps the signed-in account and its order because the state is persisted on
> the backend.”

### 2:58–3:28 — Wishlist and preferences

**On screen:** Open another product, click **Add to List**, then open **Wishlist**
and show the saved item. Open **Preferences**, change the delivery country or
language, click **Save changes**, and reload the page.

**Say:**

> “Saved items and customer preferences use the same account-backed persistence.
> The values remain after navigation and a full browser reload.”

### 3:28–3:55 — Deals, help, and responsive behavior

**On screen:** Open **Deals** and switch between two deal filters, then open
**Help** and expand one topic. Resize the window or use a mobile viewport for a
quick view of the responsive header, cards, and navigation.

**Say:**

> “The supporting surfaces are part of the product too: deals are interactive,
> help topics expand in place, and the layout adapts for smaller screens.”

### 3:55–4:25 — Engineering proof

**On screen:** Open the public GitHub repository in a second tab, briefly show the
product README and `.agent-logs/` directory, then return to the live site.

**Say:**

> “The repository contains the Next.js storefront, typed commerce backend, and
> captured agent work. Automated checks run on every main-branch change: typecheck,
> backend and unit tests, Playwright browser journeys, and a production build.”

Keep this repository view under 20 seconds; the live product is the focus.

### 4:25–4:45 — Close clearly

**Say:**

> “This is the complete Amazon storefront experience. The live HTTPS link is open
> for anyone to use, and the public repository contains the implementation and
> required capture logs. Thank you.”

Return to the homepage, keep the camera on, and stop the recording before five
minutes.

## Submission fields

**Walkthrough:** paste the public HTTPS video link.<br>
**GitHub:** `https://github.com/QuantumBreakz/amz-cl`<br>
**Live Deployed URL:** paste `YOUR_DEPLOYED_URL`

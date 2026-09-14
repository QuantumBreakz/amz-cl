# Amazon Storefront Clone — Submission Walkthrough

**Target length:** 4 minutes 30 seconds maximum  
**Recording:** camera on, voiceover on, deployed HTTPS site open

Replace `YOUR_DEPLOYED_URL` with the live deployment URL before recording.

## Before recording

- Open `YOUR_DEPLOYED_URL` in a private window.
- Close unrelated tabs, notifications, terminals, and personal information.
- Keep these links ready for the submission form:
  - **Live product:** `YOUR_DEPLOYED_URL`
  - **Repository:** https://github.com/QuantumBreakz/amz-cl
- Keep the camera visible for the entire recording.

## Spoken walkthrough

### 0:00–0:25 — Product overview

“This is my Amazon storefront clone. It is a responsive shopping experience with
product discovery, search, product detail, cart, checkout, authentication,
wishlist, preferences, deals, help, and server-backed orders.”

Show the homepage header, department navigation, hero content, and product rails.

### 0:25–0:55 — Search and discovery

Use the search box and enter **headphones**. Show the live suggestions, submit the
search, then demonstrate one category or price filter and a sort change. Scroll to
the pagination controls and change pages.

Say: “Search results are backed by the catalog API, with real filtering, sorting,
and pagination reflected in the URL.”

### 0:55–1:35 — Product detail and cart

Open a product from the results. Show the image gallery, title, rating, price,
availability, and buy box. Click **Add to Cart**, open the cart, change the
quantity, and show the updated subtotal.

Say: “The cart is persistent and the total is calculated from authoritative
catalog prices.”

### 1:35–2:25 — Account and checkout

Open **Account** and create a demo account with a throwaway email. Return to the
cart, select **Proceed to checkout**, fill the shipping form, and click **Place
your order**.

Say: “Authentication uses a server session, and checkout creates the order on the
backend rather than simulating a client-only redirect.”

### 2:25–2:55 — Confirmation and orders

Show the order confirmation number and line item. Open **Your Orders** and show
the same order in order history.

Reload the page once to demonstrate that the signed-in state and order remain
available after a full browser reload.

### 2:55–3:25 — Wishlist and preferences

Open another product, click **Add to List**, and open **Wishlist**. Then open
**Preferences**, change the delivery country or language, save, and reload.

Say: “Wishlist items and profile preferences are also persisted through the
backend.”

### 3:25–3:55 — Deals, help, and responsive layout

Show the **Deals** page and switch between two deal filters. Open **Help** and
expand one help topic. Resize the browser or use a mobile viewport briefly to show
the responsive header, product cards, and navigation.

### 3:55–4:20 — Engineering close

“The repository includes the Next.js storefront, typed commerce backend, browser
end-to-end coverage, and automated CI checks for type safety, backend tests,
Playwright journeys, and production builds.”

Show the repository README or GitHub repository briefly, then return to the live
site.

### 4:20–4:30 — Submission close

“The live link is open for anyone to use, and the public repository contains the
complete implementation and required agent capture logs.”

Stop before five minutes.

## Submission fields

**Walkthrough:** paste the public HTTPS video link.  
**GitHub:** `https://github.com/QuantumBreakz/amz-cl`  
**Live Deployed URL:** paste `YOUR_DEPLOYED_URL`

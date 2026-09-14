# Amazon Clone — Submission Walkthrough Script

Target length: **4 minutes 30 seconds maximum**. Keep the camera on for the
entire recording and share the deployed HTTPS site, not localhost.

## Before recording

- Open the deployed site in a private/incognito window so the first screen is
  visibly signed out.
- Keep this repository URL ready: `https://github.com/QuantumBreakz/amz-cl`
- Replace the live-link placeholder below with the actual HTTPS deployment URL.
- Close unrelated tabs, notifications, terminals, and personal information.
- Confirm the microphone and camera are on before pressing record.

## Spoken and on-screen sequence

### 0:00–0:20 — Introduction

Say:

> Hi, I’m Ali Ahmed. This is my Amazon.com reconstruction, built as a complete
> storefront and commerce flow in a monorepo. I’ll show the main shopping journey,
> server-backed persistence, and the supporting account experiences.

Show the deployed homepage and briefly point out the Amazon-style header, search,
department navigation, promotional hero, category cards, product rails, and footer.

### 0:20–0:55 — Search and product discovery

1. Type `active gear` into the header search.
2. Show the suggestions returned by the catalog service.
3. Submit the search.
4. Select **Under $25**.
5. Change **Sort by** to **Price: Low to High**.
6. Open page 2, then return to the first result.

Say:

> Search, filtering, sorting, and pagination are reflected in the URL and update
> the actual result set rather than only changing the visual state.

Open a product detail page and show the product image, rating, price, availability,
quantity selector, add-to-cart action, related products, and product information.

### 0:55–1:35 — Cart and persistence

1. Add the product to the cart.
2. Open the cart and change the quantity.
3. Point out the subtotal and the item count.
4. Reload the page and show that the quantity and total remain correct.
5. Use **Save for later**, show the saved item, then use **Move to Cart**.

Say:

> Cart and saved-item state comes from the backend session. The browser UI updates
> optimistically, then reconciles with the server response.

### 1:35–2:15 — Registration and checkout

1. Open **Create account**.
2. Register with a test email and password.
3. Show the account page and the preserved cart count.
4. Return to the cart and select **Proceed to checkout**.
5. Fill the demo shipping form with non-sensitive test data.
6. Show the “Demo payment — no card required” notice.
7. Place the order.

Say:

> Registration creates a real backend session, merges the guest cart, and checkout
> creates an authoritative server-side order. This demo never collects payment data.

### 2:15–2:45 — Confirmation and orders

1. Show the order confirmation number and total.
2. Reload the confirmation page.
3. Open **Returns & Orders**.
4. Show the order in history with the same total, recipient name, and product.

Say:

> The confirmation and order history are reading the persisted order from the
> backend, not a client-only success screen.

### 2:45–3:20 — Wishlist and preferences

1. Open a product and choose **Add to List**.
2. Open **Your Lists** and show the saved item.
3. Open **Preferences**.
4. Select **Español** and **United States**, save, and reload.
5. Show that both selections remain selected and the delivery country updates.

Say:

> Wishlist and preferences also survive a full reload through the profile and
> wishlist APIs. Commerce state is not stored in localStorage.

### 3:20–3:50 — Deals, help, and resilience

1. Open **Today's Deals** and switch to **Lightning Deals**.
2. Open a help topic from the navigation.
3. Visit an invalid product URL and an invalid route to show the two not-found states.
4. If useful, briefly show the empty-cart checkout message or an invalid checkout
   form message.

Say:

> The secondary routes have their own working states, validation, and not-found
> handling instead of falling back to blank pages.

### 3:50–4:30 — Engineering close

Show the public repository and briefly open the README. Point to the backend,
automated tests, end-to-end test, and capture evidence.

Say:

> The repository includes a typed commerce backend, authenticated and guest actor
> isolation, authoritative prices and stock limits, JSON persistence, API tests,
> Chrome end-to-end tests, and the required append-only agent capture logs. I’m Ali
> Ahmed, the sole contributor and developer of this reconstruction.

Stop before 5 minutes.

## Submission fields

Paste these as labeled links in the assignment form:

- **GitHub:** `https://github.com/QuantumBreakz/amz-cl`
- **Live Deployed URL:** `PASTE_YOUR_PUBLIC_HTTPS_DEPLOYMENT_URL_HERE`
- **Walkthrough:** `PASTE_YOUR_PUBLIC_VIDEO_URL_HERE`

Before sending, verify in a private window that the live URL opens while signed out,
the GitHub repository is public and contains `.agent-logs/`, and the video link is
publicly viewable with camera and voiceover enabled.

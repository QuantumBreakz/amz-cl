"use client";

import Link from "next/link";
import { ChevronDown, Lock, ShoppingCart } from "lucide-react";
import { productById, productUrl } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";

export default function CartPage() {
  const store = useStore();
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
          <div className="cart-price-label">Price</div>
          {store.cart.map((line) => {
            const product = productById(line.id);
            if (!product) return null;
            return (
              <article className="cart-line" key={line.id}>
                <input
                  type="checkbox"
                  defaultChecked
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
            Subtotal ({store.count} {store.count === 1 ? "item" : "items"}):{" "}
            <Price value={store.total} />
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
            Subtotal ({store.count} {store.count === 1 ? "item" : "items"}):{" "}
            <Price value={store.total} />
          </div>
          <label>
            <input type="checkbox" /> This order contains a gift
          </label>
          <Link className="yellow-button round" href="/checkout">
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
    </div>
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

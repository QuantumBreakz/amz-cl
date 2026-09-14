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
  // server-backed value once the session request completes.
  useEffect(() => {
    if (!store.ready) return;
    const resolved = store.location.includes("US")
      ? "United States"
      : store.location;
    setCountry(COUNTRIES.includes(resolved) ? resolved : "United States");
  }, [store.ready, store.location]);
  async function submit(event: FormEvent) {
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
    store.setName(name.trim());
    try {
      const id = await store.placeOrder(
        name.trim(),
        `${address.trim()}, ${city.trim()}, ${region.trim()} ${postal.trim()}, ${country}`,
      );
      router.push(`/order-confirmation?id=${encodeURIComponent(id)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to place your order.");
      setPlacing(false);
    }
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

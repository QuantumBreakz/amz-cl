"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Headphones,
  MapPin,
  Package,
  Shield,
  Star,
  Tags,
} from "lucide-react";
import { productById, productUrl } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";

export function AuthPage({ register = false }: { register?: boolean }) {
  const store = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (
      (register && name.trim().length < 2) ||
      !email.includes("@") ||
      password.length < (register ? 8 : 1)
    ) {
      setError(
        register
          ? "Enter your name, a valid email, and a password of at least 8 characters."
          : "Enter your email address and password.",
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await store.authenticate({
        mode: register ? "register" : "login",
        name: register ? name.trim() : undefined,
        email: email.trim(),
        password,
      });
      router.push("/account");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-page">
      <Link href="/" aria-label="Amazon home">
        <img src="/assets/amazon-logo.svg" alt="amazon" />
      </Link>
      <form className="auth-card" onSubmit={submit}>
        <h1>{register ? "Create account" : "Sign in"}</h1>
        {register && (
          <label>
            Your name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
            />
          </label>
        )}
        <label>
          Email or mobile phone number
          <input
            autoFocus={!register}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={register ? "At least 8 characters" : undefined}
            autoComplete={register ? "new-password" : "current-password"}
          />
          {register && <small>ⓘ Passwords must be at least 8 characters.</small>}
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="yellow-button" disabled={submitting}>
          {submitting
            ? register
              ? "Creating account…"
              : "Signing in…"
            : register
              ? "Create your Amazon account"
              : "Sign in"}
        </button>
        <p>
          By continuing, you agree to Amazon's{" "}
          <Link href="/help?topic=conditions">Conditions of Use</Link> and{" "}
          <Link href="/help?topic=privacy">Privacy Notice</Link>.
        </p>
        <details>
          <summary>Need help?</summary>
          <Link href="/help?topic=signin">Forgot your password?</Link>
        </details>
        {register && (
          <>
            <hr />
            <p>
              Buying for work?{" "}
              <Link href="/help?topic=business">
                Create a free business account
              </Link>
            </p>
          </>
        )}
      </form>
      {!register && (
        <div className="new-divider">
          <span>New to Amazon?</span>
        </div>
      )}
      {!register && (
        <Link className="outline-button auth-create" href="/ap/register">
          Create your Amazon account
        </Link>
      )}
      <footer className="auth-footer">
        <div>
          <Link href="/help?topic=conditions">Conditions of Use</Link>
          <Link href="/help?topic=privacy">Privacy Notice</Link>
          <Link href="/help">Help</Link>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}

const tiles = [
  {
    icon: Package,
    title: "Your Orders",
    copy: "Track, return, cancel an order",
    href: "/orders",
  },
  {
    icon: Shield,
    title: "Login & security",
    copy: "Edit login, name, and mobile number",
    href: "/ap/signin",
  },
  {
    icon: Star,
    title: "Your Lists",
    copy: "View, modify, and share your lists",
    href: "/wishlist",
  },
  {
    icon: CreditCard,
    title: "Your Payments",
    copy: "Manage payment methods and settings",
    href: "/help?topic=payments",
  },
  {
    icon: MapPin,
    title: "Your Addresses",
    copy: "Edit addresses for orders and gifts",
    href: "/preferences",
  },
  {
    icon: Tags,
    title: "Prime",
    copy: "View benefits and payment settings",
    href: "/help?topic=prime",
  },
  {
    icon: Headphones,
    title: "Customer Service",
    copy: "Browse help topics and contact us",
    href: "/help",
  },
  {
    icon: CircleUserRound,
    title: "Your Profiles",
    copy: "Manage your household profiles",
    href: "/help?topic=profiles",
  },
];
export function Account() {
  const store = useStore();
  return (
    <div className="account-page">
      <h1>Your Account</h1>
      {store.user && (
        <div className="account-signin">
          <p>
            Signed in as <b>{store.user.email}</b>
          </p>
          <button
            className="outline-button"
            onClick={() =>
              void store.logout().catch((reason) =>
                store.notify(reason instanceof Error ? reason.message : "Unable to sign out."),
              )
            }
          >
            Sign out
          </button>
        </div>
      )}
      {!store.name && (
        <div className="account-signin">
          <p>Sign in for your personalized account experience.</p>
          <Link className="yellow-button" href="/ap/signin">
            Sign in
          </Link>
        </div>
      )}
      <div className="account-grid">
        {tiles.map(({ icon: Icon, ...tile }) => (
          <Link href={tile.href} key={tile.title}>
            <Icon />
            <div>
              <h2>{tile.title}</h2>
              <p>{tile.copy}</p>
            </div>
          </Link>
        ))}
      </div>
      <section className="account-links">
        <h2>More ways to manage your Amazon experience</h2>
        {[
          "Manage your content and devices",
          "Amazon Household",
          "Your Subscribe & Save Items",
          "Memberships & Subscriptions",
          "Your Seller Account",
        ].map((x) => (
          <Link href={`/help?topic=${encodeURIComponent(x)}`} key={x}>
            {x}
            <ChevronRight size={16} />
          </Link>
        ))}
      </section>
    </div>
  );
}
export function Wishlist() {
  const store = useStore();
  return (
    <div className="wishlist-page">
      <h1>Your Lists</h1>
      <section>
        <h2>Shopping List</h2>
        {!store.saved.length ? (
          <>
            <p className="muted">You haven't saved any items yet.</p>
            <Link href="/" className="yellow-button">
              Discover products
            </Link>
          </>
        ) : (
          store.saved.map((id) => {
            const p = productById(id);
            return p ? (
              <article key={id}>
                <img src={p.images[0]} alt={p.name} />
                <div>
                  <Link href={productUrl(id)}>
                    <h3>{p.name}</h3>
                  </Link>
                  <Price value={p.price} />
                  <span className="stock">In Stock</span>
                  <button
                    className="yellow-button"
                    onClick={() => {
                      store.unsave(id);
                      store.add(id);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="link-button"
                    onClick={() => store.unsave(id)}
                  >
                    Delete item
                  </button>
                </div>
              </article>
            ) : null;
          })
        )}
      </section>
    </div>
  );
}
const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "United Arab Emirates",
  "Australia",
  "Germany",
];

export function Preferences() {
  const store = useStore();
  const [language, setLanguage] = useState(store.language);
  const [country, setCountry] = useState(store.location);
  // store.location only becomes the server-backed value after session hydration,
  // so adopt it once ready — otherwise saving would overwrite it with the default.
  useEffect(() => {
    if (store.ready) setCountry(store.location);
  }, [store.ready, store.location]);
  useEffect(() => {
    if (store.ready) setLanguage(store.language);
  }, [store.ready, store.language]);
  return (
    <div className="preferences-page">
      <h1>Language Settings</h1>
      <p>
        Select the language you prefer for browsing, shopping, and
        communications.
      </p>
      <section>
        <h2>Language</h2>
        {["English", "Español", "العربية", "Deutsch", "हिन्दी"].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="language"
              checked={language === value}
              onChange={() => setLanguage(value)}
            />
            {value}
          </label>
        ))}
      </section>
      <section>
        <h2>Country/Region</h2>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {[
            ...(COUNTRIES.includes(country) ? [] : [country]),
            ...COUNTRIES,
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </section>
      <button
        className="yellow-button"
        onClick={() => {
          store.setLocation(country);
          store.setLanguage(language);
          store.notify("Preferences saved");
        }}
      >
        Save changes
      </button>
    </div>
  );
}

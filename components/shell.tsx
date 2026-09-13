"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  X,
  Globe,
  ChevronRight,
} from "lucide-react";
import { products, searchUrl, categories } from "@/lib/catalog";
import { useStore } from "./store";
export function Modal({
  title,
  onClose,
  children,
  drawer = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${drawer ? "department-drawer" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <b>{title}</b>
        <button aria-label="Close dialog" onClick={onClose}>
          <X size={22} />
        </button>
      </header>
      <div className="modal-content">{children}</div>
    </dialog>
  );
}
const departments = ["All", ...categories.map(c => c.name)];
export function Header() {
  const s = useStore(),
    router = useRouter(),
    path = usePathname();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [focus, setFocus] = useState(false),
    [active, setActive] = useState(-1),
    [drawer, setDrawer] = useState(false),
    [location, setLocation] = useState(false),
    [country, setCountry] = useState("Pakistan"),
    [zip, setZip] = useState(""),
    [account, setAccount] = useState(false);
  const [department, setDepartment] = useState("");
  const [showAppBanner, setShowAppBanner] = useState(true);
  const suggestions = [
    ...new Set(
      products
        .filter((p) => `${p.name} ${p.category} ${p.subCategory}`.toLowerCase().includes(query.toLowerCase()) && (category === "All" || p.category === category))
        .map((p) => p.name),
    ),
  ].slice(0, 5);
  useEffect(() => {
    setFocus(false);
    setAccount(false);
    setDrawer(false);
  }, [path]);
  function submit(e: FormEvent) {
    e.preventDefault();
    setFocus(false);
    router.push(searchUrl(query, category === "All" ? "" : category));
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      {showAppBanner && (
        <div className="app-banner">
          <span>Fast. Easy. Shop in our free App today</span>
          <button aria-label="Dismiss" onClick={() => setShowAppBanner(false)}>
            ✕
          </button>
        </div>
      )}
      <header className="header">
        <Link className="logo header-item" href="/" aria-label="Amazon home">
          <img src="/assets/amazon-logo-light.svg" alt="" />
        </Link>
        <button
          className="location header-item"
          onClick={() => setLocation(true)}
        >
          <MapPin size={19} />
          <span>
            <small>Deliver to</small>
            <strong>{s.location}</strong>
          </span>
        </button>
        <form
          className={`search-box ${focus ? "focused" : ""}`}
          onSubmit={submit}
        >
          <select
            aria-label="Search department"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {departments.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <div className="search-input-wrap">
            <input
              placeholder="Search Amazon"
              aria-label="Search Amazon"
              value={query}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 150)}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setFocus(false);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, suggestions.length - 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, -1));
                }
                if (e.key === "Enter" && active >= 0) {
                  e.preventDefault();
                  setQuery(suggestions[active]);
                  setFocus(false);
                  router.push(searchUrl(suggestions[active]));
                }
              }}
              autoComplete="off"
              role="combobox"
              aria-expanded={
                focus && query.length > 0 && suggestions.length > 0
              }
              aria-controls="search-suggestions"
              aria-activedescendant={
                active >= 0 ? `suggestion-${active}` : undefined
              }
            />
            {query && (
              <button
                className="clear-search"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
            {focus && query && suggestions.length > 0 && (
              <ul
                className="suggestions"
                id="search-suggestions"
                role="listbox"
              >
                {suggestions.map((x, i) => (
                  <li
                    key={x}
                    id={`suggestion-${i}`}
                    role="option"
                    aria-selected={active === i}
                  >
                    <button
                      type="button"
                      className={active === i ? "selected" : ""}
                      onClick={() => {
                        setQuery(x);
                        setFocus(false);
                        router.push(searchUrl(x));
                      }}
                    >
                      <Search size={18} />
                      {x}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="search-button" aria-label="Search">
            <Search size={27} />
          </button>
        </form>
        <button
          className="language header-item"
          onClick={() => router.push("/preferences")}
        >
          <span>🇺🇸</span>
          <strong>EN</strong>
          <ChevronDown size={12} />
        </button>
        <div
          className="account-wrap"
          onMouseEnter={() => setAccount(true)}
          onMouseLeave={() => setAccount(false)}
        >
          <button
            className="account header-item"
            aria-expanded={account}
            onClick={() => setAccount(!account)}
          >
            <small>Hello, {s.name || "sign in"}</small>
            <strong>
              Account & Lists <ChevronDown size={12} />
            </strong>
          </button>
          {account && (
            <div className="account-popover">
              <Link className="yellow-button" href={s.name ? "/account" : "/ap/signin"}>
                {s.name ? "Your account" : "Sign in"}
              </Link>
              <p>
                New customer? <Link href="/ap/register">Start here.</Link>
              </p>
              <div className="account-columns">
                <div>
                  <h3>Your Lists</h3>
                  <Link href="/wishlist">Shopping List</Link>
                  <Link href="/wishlist">Saved for later</Link>
                </div>
                <div>
                  <h3>Your Account</h3>
                  <Link href="/account">Your Account</Link>
                  <Link href="/orders">Your Orders</Link>
                  <Link href="/wishlist">Your Lists</Link>
                  {s.name && (
                    <button
                      onClick={() => {
                        s.login("");
                        setAccount(false);
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Link href="/orders" className="orders-link header-item">
          <small>Returns</small>
          <strong>& Orders</strong>
        </Link>
        <Link className="cart-link header-item" href="/cart">
          <span className="cart-icon">
            <b>{s.count}</b>
            <ShoppingCart size={39} strokeWidth={1.7} />
          </span>
          <strong>Cart</strong>
        </Link>
        <button
          className="header-item hamburger-button"
          aria-label="Open menu"
          onClick={() => {
            setDrawer(true);
            setDepartment("");
          }}
        >
          <Menu size={22} />
        </button>
      </header>
      <nav className="subnav" aria-label="Main navigation">
        <button onClick={() => {setDrawer(true);setDepartment("");}}>
          <Menu size={22} />
          <b>All</b>
        </button>
        {[
          ["Prime Video", "/help?topic=Prime%20Video"],
          ["Coupons", "/deals?tab=Coupons"],
          ["Customer Service", "/help?topic=Customer%20Service"],
          ["Today's Deals", "/deals"],
          ["Registry", "/help?topic=Registry"],
          ["Gift Cards", "/help?topic=Gift%20Cards"],
          ["Sell", "/help?topic=Sell"],
          ["Disability Customer Support", "/help?topic=Customer%20Service"],
        ].map(([label, href]) => (
          <Link key={label} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <button className="mobile-location-bar" onClick={() => setLocation(true)}>
        <MapPin size={16} /> Deliver to {s.location} <ChevronDown size={12} />
      </button>
      {drawer && (
        <Modal
          drawer
          title={`Hello, ${s.name || "sign in"}`}
          onClose={() => setDrawer(false)}
        >
          <div className="drawer-content">
            {department ? <><button className="drawer-back" onClick={()=>setDepartment("")}>← MAIN MENU</button><h3>{department}</h3><Link href={searchUrl("",department)} onClick={()=>setDrawer(false)}>Shop all {department}</Link>{categories.find(c=>c.name===department)?.subCategories.map(sub=><Link key={sub.id} href={searchUrl(sub.name,department)} onClick={()=>setDrawer(false)}>{sub.name}<ChevronRight size={18}/></Link>)}</> : <>
            <h3>Trending</h3>
            {["Best Sellers", "New Releases", "Movers & Shakers"].map((x) => (
              <Link href="/deals" onClick={() => setDrawer(false)} key={x}>
                {x}
                <ChevronRight size={18} />
              </Link>
            ))}
            <hr />
            <h3>Shop by Department</h3>
            {categories.map((x) => (
              <button
                key={x.name}
                onClick={() => setDepartment(x.name)}
              >
                {x.name}
                <ChevronRight size={18} />
              </button>
            ))}
            <hr />
            <h3>Help & Settings</h3>
            <Link href="/account">Your Account</Link>
            <Link href="/help">Customer Service</Link>
            <Link href="/ap/signin">Sign in</Link>
            </>}
          </div>
        </Modal>
      )}
      {location && (
        <Modal title="Choose your location" onClose={() => setLocation(false)}>
          <p className="muted">
            Delivery options and delivery speeds may vary for different
            locations
          </p>
          <Link
            href="/ap/signin"
            className="yellow-button"
            onClick={() => setLocation(false)}
          >
            Sign in to see your addresses
          </Link>
          <p className="divider-label">or enter a US zip code</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (/^\d{5}$/.test(zip)) {
                s.setLocation(`US ${zip}`);
                setLocation(false);
              }
            }}
          >
            <div className="zip-row">
              <input
                aria-label="US ZIP code"
                pattern="[0-9]{5}"
                required
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP code"
              />
              <button className="outline-button">Apply</button>
            </div>
          </form>
          <p className="divider-label">or ship outside the US</p>
          <select
            aria-label="Delivery country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {[
              "Pakistan",
              "United States",
              "United Kingdom",
              "Canada",
              "India",
              "United Arab Emirates",
              "Australia",
              "Germany",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            className="yellow-button"
            onClick={() => {
              s.setLocation(country);
              setLocation(false);
            }}
          >
            Done
          </button>
        </Modal>
      )}
    </>
  );
}
const footers = [
  [
    "Get to Know Us",
    "Careers",
    "Blog",
    "About Amazon",
    "Investor Relations",
    "Amazon Devices",
    "Amazon Science",
  ],
  [
    "Make Money with Us",
    "Sell products on Amazon",
    "Sell on Amazon Business",
    "Sell apps on Amazon",
    "Become an Affiliate",
    "Advertise Your Products",
    "Self-Publish with Us",
    "Host an Amazon Hub",
  ],
  [
    "Amazon Payment Products",
    "Amazon Business Card",
    "Shop with Points",
    "Reload Your Balance",
    "Amazon Currency Converter",
  ],
  [
    "Let Us Help You",
    "Your Account",
    "Your Orders",
    "Shipping Rates & Policies",
    "Returns & Replacements",
    "Manage Your Content and Devices",
    "Help",
  ],
];
export function Footer() {
  return (
    <footer>
      <button
        className="back-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
      <div className="footer-columns">
        {footers.map(([title, ...links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map((x) => (
              <Link
                key={x}
                href={
                  x === "Your Orders"
                    ? "/orders"
                    : x === "Your Account"
                      ? "/account"
                      : `/help?topic=${encodeURIComponent(x)}`
                }
              >
                {x}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-locale">
        <Link href="/" aria-label="Amazon home">
          <img src="/assets/amazon-logo-light.svg" alt="amazon" />
        </Link>
        <Link href="/preferences">
          <Globe size={16} /> English
        </Link>
        <span>$ USD - U.S. Dollar</span>
        <span>🇺🇸 United States</span>
      </div>
      <div className="footer-bottom">
        <div className="footer-services">
          {[
            ["Amazon Music", "Stream millions of songs"],
            ["Amazon Ads", "Reach customers wherever they spend their time"],
            ["6pm", "Score deals on fashion brands"],
            ["AbeBooks", "Books, art & collectibles"],
            ["ACX", "Audiobook Publishing Made Easy"],
            ["Sell on Amazon", "Start a Selling Account"],
            ["Amazon Business", "Everything For Your Business"],
          ].map(([a, b]) => (
            <Link key={a} href={`/help?topic=${a}`}>
              <b>{a}</b>
              <span>{b}</span>
            </Link>
          ))}
        </div>
        <div>
          <Link href="/help?topic=Conditions of Use">Conditions of Use</Link>
          <Link href="/help?topic=Privacy Notice">Privacy Notice</Link>
          <Link href="/help?topic=Consumer Health Data Privacy Disclosure">
            Consumer Health Data Privacy Disclosure
          </Link>
          <Link href="/help?topic=Your Ads Privacy Choices">
            Your Ads Privacy Choices
          </Link>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates</p>
        <small>Independent educational storefront. Demo orders only.</small>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const compact = path.startsWith("/ap/") || path === "/checkout";
  return compact ? (
    <main id="main">{children}</main>
  ) : (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

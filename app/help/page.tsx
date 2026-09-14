import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
const topics = [
  ["Your Orders", "Track or cancel orders"],
  ["Returns & Refunds", "Exchange or return items"],
  ["Payment Settings", "Add or edit payment methods"],
  ["Manage Addresses", "Update your delivery locations"],
  ["Prime", "Manage your membership"],
  ["Security & Privacy", "Protect your account"],
];
const articles: Record<string, string[]> = {
  returns: [
    "Most items in this demo show a 30-day return window on the order and order-confirmation pages, mirroring how Amazon frames its real return policy.",
    "Because this is a portfolio project, choosing \"Buy it again\" or opening an order never triggers a real refund or replacement — the return window is shown for realism only.",
    "If you're looking for the real Amazon return center, this demo doesn't connect to it; demo state stays within this application's own backend.",
  ],
  prime: [
    "Prime membership on the real Amazon bundles fast shipping, Prime Video streaming, and other perks into one subscription.",
    "This project reproduces the look of those Prime touchpoints — badges, banners, and account links — but there is no membership to join and nothing is ever charged.",
    "Any \"Prime Video\" or \"Prime\" link you followed to get here is for visual fidelity only.",
  ],
  conditions: [
    "On amazon.com, the Conditions of Use lay out the legal terms for using the site and making purchases.",
    "This project is a front-end clone built for demonstration purposes, so no real conditions of use apply and no agreement is formed by browsing it.",
    "Nothing you do here, including creating a demo account or placing a demo order, creates a binding relationship with anyone.",
  ],
  privacy: [
    "The real Amazon's Privacy Notice explains what customer data it collects and how it's used.",
    "This demo is far simpler: your cart, saved items, profile, account, and demo orders are stored by this application's backend and scoped to an opaque guest or signed-in session.",
    "There is no analytics or third-party sharing in this repository. Passwords are salted and hashed, session cookies are HttpOnly, and no payment information is collected.",
  ],
  "customer service": [
    "On a real retail site, Customer Service is where you'd reach a support agent by chat, phone, or email.",
    "This help center is the extent of support in this demo — use the search box above or browse a topic tile to find the answer you're after.",
    "There's no live chat or phone line behind this page, since no real orders or accounts exist to support.",
  ],
  "gift cards": [
    "Amazon gift cards can normally be bought, sent, or redeemed toward a balance on an account.",
    "In this demo, gift cards are illustrative only — the \"Learn more\" link from your cart brings you here rather than to a real redemption flow.",
    "No balance is issued or tracked, and the promo/gift card field at checkout does not apply a real discount.",
  ],
  shipping: [
    "Delivery dates shown throughout this demo, like the estimate on the checkout and order pages, are placeholders meant to resemble a real Amazon order timeline.",
    "No item is actually packed or shipped — placing a demo order saves it to the application backend so you can review it under Your Orders.",
  ],
  secure: [
    "The real Amazon encrypts payment details end-to-end during checkout.",
    "This demo goes a step further and never collects payment information at all — the checkout page states this directly, and \"Place your order\" only creates a demo order in this application's backend.",
  ],
};
const topicAliases: Record<string, string> = {
  returns: "returns",
  "returns & refunds": "returns",
  "returns & replacements": "returns",
  prime: "prime",
  "prime video": "prime",
  conditions: "conditions",
  "conditions of use": "conditions",
  privacy: "privacy",
  "privacy notice": "privacy",
  "customer service": "customer service",
  gifts: "gift cards",
  "gift cards": "gift cards",
  shipping: "shipping",
  secure: "secure",
};
function articleFor(topic: string) {
  return articles[topicAliases[topic.trim().toLowerCase()]] ?? null;
}
export default async function Help({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const article = topic ? articleFor(topic) : null;
  return (
    <div className="help-page">
      <div className="help-hero">
        <h1>Hello. What can we help you with?</h1>
        <form action="/help">
          <Search />
          <input
            name="topic"
            defaultValue={topic}
            placeholder="Search our help library"
          />
        </form>
      </div>
      {topic ? (
        <section className="help-article">
          <div className="breadcrumbs">
            <Link href="/help">Help</Link>
            <span>›</span>
            <span>{topic}</span>
          </div>
          <h2>{topic}</h2>
          {article ? (
            article.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : (
            <>
              <p>
                This demo reproduces the customer-facing Amazon help experience. For
                this assignment, all checkout, account, shipping, and order actions
                stay inside this demo application and never reach Amazon or a payment provider.
              </p>
              <h2>Quick answers</h2>
              <p>
                You can explore the storefront, search and filter products, add
                items to the cart, place a demo order, and view it under Your
                Orders. Accounts are local to this demo backend and no real purchase is created.
              </p>
            </>
          )}
          <Link href="/help">Browse all help topics</Link>
        </section>
      ) : (
        <section className="help-topics">
          <h2>Some things you can do here</h2>
          <div>
            {topics.map(([title, copy]) => (
              <Link
                href={`/help?topic=${encodeURIComponent(title)}`}
                key={title}
              >
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ChevronRight />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

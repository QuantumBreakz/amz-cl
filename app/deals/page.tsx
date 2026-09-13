import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/ui";

const TABS = [
  "All Deals",
  "Lightning Deals",
  "Customers’ Most-Loved",
  "Outlet",
  "Coupons",
] as const;

function discountOf(product: { price: number; originalPrice: number }) {
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export default async function Deals({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.includes(tab as (typeof TABS)[number])
    ? (tab as (typeof TABS)[number])
    : "All Deals";
  const deals = products
    .filter((p) => p.isDeal)
    .filter((p) => {
      if (active === "Lightning Deals") return discountOf(p) >= 40;
      if (active === "Customers’ Most-Loved")
        return p.isBestseller || p.rating >= 4.5;
      if (active === "Outlet") return p.price < 25;
      if (active === "Coupons") return discountOf(p) >= 10 && discountOf(p) < 40;
      return true;
    });
  return (
    <div className="deals-page">
      <div className="deals-hero">
        <h1>Today&apos;s Deals</h1>
        <p>Great savings. Every day.</p>
      </div>
      <div className="deal-filters">
        <b>Today&apos;s Deals</b>
        {TABS.map((x) => (
          <Link
            className={active === x ? "active" : ""}
            href={x === "All Deals" ? "/deals#deals" : `/deals?tab=${encodeURIComponent(x)}#deals`}
            key={x}
          >
            {x}
          </Link>
        ))}
      </div>
      <section id="deals">
        <h2>
          {active} <span className="deal-count">({deals.length})</span>
        </h2>
        {deals.length ? (
          <div className="deals-grid">
            {deals.map((product) => (
              <ProductCard product={product} deal key={product.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No deals in this category right now</h3>
            <Link className="yellow-button" href="/deals">
              See all deals
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

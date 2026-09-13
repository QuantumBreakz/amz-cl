import Link from "next/link";
import { Product, productUrl } from "@/lib/catalog";
// amazon.com abbreviates review counts past 1,000 as e.g. "74.1K"
export function abbreviateCount(count: number) {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}K`;
}
export function Price({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [whole, cents] = value.toFixed(2).split(".");
  return (
    <span className={`price ${className}`} aria-label={`$${value.toFixed(2)}`}>
      <sup>$</sup>
      {whole}
      <sup>{cents}</sup>
    </span>
  );
}
export function Stars({ rating = 4.5 }: { rating?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}
export function ProductCard({
  product: p,
  deal = false,
}: {
  product: Product;
  deal?: boolean;
}) {
  return (
    <article className="product-card">
      <Link className="product-image" href={productUrl(p.id)}>
        <img src={p.images[0]} alt={p.name} loading="lazy" />
      </Link>
      <div className="product-card-copy">
        {deal && (
          <div className="deal-label">
            <span>
              {Math.round((1 - p.price / p.originalPrice) * 100)}% off
            </span>{" "}
            Limited time deal
          </div>
        )}
        <Link className="product-title" href={productUrl(p.id)}>
          {p.name}
        </Link>
        <div>
          <Stars rating={p.rating} />
          <span className="link-text ratings">
            {" "}
            {abbreviateCount(p.ratingCount)}
          </span>
        </div>
        <Link href={productUrl(p.id)} className="price-link">
          <Price value={p.price} />
        </Link>
        <div className="muted">
          List: <s>${p.originalPrice.toFixed(2)}</s>
        </div>
        <div className="prime">
          ✓<b>prime</b>
        </div>
        <div className="delivery-small">FREE delivery on eligible orders</div>
      </div>
    </article>
  );
}

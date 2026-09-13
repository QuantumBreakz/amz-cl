"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { productUrl } from "@/lib/catalog";
import { abbreviateCount, Price, Stars } from "./ui";
import { useStore } from "./store";

function boughtInPastMonth(ratingCount: number) {
  if (ratingCount > 1000)
    return `${Math.round(ratingCount / 1000)}K+ bought in past month`;
  if (ratingCount > 100) return "100+ bought in past month";
  return "";
}

export function ProductRow({
  product,
  rank,
}: {
  product: Product;
  rank: number;
}) {
  const store = useStore();
  const bought = boughtInPastMonth(product.ratingCount);
  const isClothing = product.category === "Clothing, Shoes & Jewelry";
  return (
    <article className="product-row">
      <Link href={productUrl(product.id)} className="product-row-image">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-row-body">
        {rank === 0 && product.isBestseller && (
          <span className="overall-pick-badge">Overall Pick</span>
        )}
        {product.isDeal && <span className="sponsored-label">Sponsored</span>}
        <Link href={productUrl(product.id)} className="product-row-title">
          {product.name}
        </Link>
        <div className="product-row-meta">
          <Stars rating={product.rating} />
          <span className="link-text ratings">
            {" "}
            ({abbreviateCount(product.ratingCount)})
          </span>
        </div>
        {bought && <div className="bought-count">{bought}</div>}
        <div>
          <Price value={product.price} />
          {product.originalPrice > product.price && (
            <span className="muted">
              {" "}
              <s>${product.originalPrice.toFixed(2)}</s>
            </span>
          )}
        </div>
        <div className="prime">
          ✓<b>prime</b>
        </div>
        {isClothing ? (
          <div className="row-swatches">
            {["Black", "Blue", "White"].map((value) => (
              <span key={value} className="row-swatch">
                {value}
              </span>
            ))}
            <Link href={productUrl(product.id)} className="outline-button">
              See options
            </Link>
          </div>
        ) : (
          <button
            className="outline-button"
            onClick={() => store.add(product.id, 1)}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}

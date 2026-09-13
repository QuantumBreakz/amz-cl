"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Heart,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/lib/catalog";
import { products, productUrl, searchUrl } from "@/lib/catalog";
import { Price, ProductCard, Stars } from "./ui";
import { useStore } from "./store";

const REVIEWERS = [
  "Amazon Customer",
  "Michael R.",
  "Sarah T.",
  "David K.",
  "Jenny L.",
  "Robert P.",
  "Amanda C.",
  "Chris W.",
];

const REVIEW_SNIPPETS = [
  {
    title: "Excellent quality and fast delivery",
    body: "The item matched the description, arrived in good condition, and was easy to use. I would recommend it.",
  },
  {
    title: "Works exactly as described",
    body: "Works exactly as described, arrived faster than expected, and has held up well so far.",
  },
  {
    title: "Good value for the price",
    body: "Good value for the price and would buy again. Packaging was solid and it was easy to set up.",
  },
  {
    title: "Better than I expected",
    body: "I was skeptical at first, but it has held up well with regular use. Happy with this purchase.",
  },
  {
    title: "Solid, reliable product",
    body: "Does what it's supposed to do without any fuss. Shipping was quick and it arrived well packaged.",
  },
  {
    title: "Would recommend to a friend",
    body: "Easy to set up and has worked reliably since day one. Would recommend it to a friend.",
  },
  {
    title: "Exactly what I needed",
    body: "Exactly what I was looking for. Good build quality and it arrived earlier than the estimate.",
  },
];

const REVIEW_DATES = [
  "June 30, 2026",
  "July 14, 2026",
  "August 2, 2026",
  "August 21, 2026",
  "September 8, 2026",
  "September 19, 2026",
];

function hashProductId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Plausible star distribution derived from the product's own rating, so the
// histogram always agrees with the headline number instead of being arbitrary.
function ratingHistogram(rating: number) {
  const five = Math.round(Math.min(92, Math.max(8, (rating - 2.2) * 32)));
  const four = Math.round((100 - five) * 0.5);
  const three = Math.round((100 - five - four) * 0.5);
  const two = Math.round((100 - five - four - three) * 0.5);
  return { 5: five, 4: four, 3: three, 2: two, 1: 100 - five - four - three - two };
}

const QUESTIONS = [
  {
    q: "Does this come with everything needed to use it out of the box?",
    a: "Yes — it ships complete. Anything optional is listed under Product information.",
  },
  {
    q: "How long does delivery usually take?",
    a: "Standard delivery is free on eligible orders and the estimate is shown in the buy box before you order.",
  },
  {
    q: "What is the return window?",
    a: "30 days from delivery, through Your Orders.",
  },
  {
    q: "Is this the current model?",
    a: "Yes. The model number is listed in the Product information table on this page.",
  },
];

const SENTIMENT = [
  "Quality",
  "Value for money",
  "Ease of use",
  "Appearance",
  "Shipping speed",
];

export default function ProductDetail({ product }: { product: Product }) {
  const store = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(
    product.category === "Electronics" ? "Black" : "Navy",
  );
  const related = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.id !== product.id && item.category === product.category,
        )
        .slice(0, 5),
    [product],
  );
  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );
  const reviews = [0, 1, 2].map((index) => {
    const seed = hashProductId(`${product.id}:${index}`);
    // offset by index so the three reviews never collide on the same pool entry
    const snippet =
      REVIEW_SNIPPETS[
        (Math.floor(seed / 7) + index) % REVIEW_SNIPPETS.length
      ];
    return {
      key: index,
      reviewer: REVIEWERS[(seed + index) % REVIEWERS.length],
      title: snippet.title,
      body: snippet.body,
      date: REVIEW_DATES[
        (Math.floor(seed / 13) + index) % REVIEW_DATES.length
      ],
      rating: seed % 4 === 0 ? 4 : 5,
      helpful: (seed % 180) + 4,
      verified: seed % 6 !== 0,
    };
  });
  const histogram = ratingHistogram(product.rating);

  return (
    <div className="detail-page">
      <div className="breadcrumbs">
        <Link href="/">Amazon</Link>
        <span>›</span>
        <Link href={searchUrl("", product.category)}>{product.category}</Link>
        <span>›</span>
        <span>{product.subCategory}</span>
      </div>
      <div className="detail-grid">
        <aside className="thumbs">
          {product.images.map((image, index) => (
            <button
              key={image}
              className={selectedImage === index ? "active" : ""}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </aside>
        <section className="main-product-image">
          <img src={product.images[selectedImage]} alt={product.name} />
          <p>Roll over image to zoom in</p>
        </section>
        <section className="product-info">
          <h1>{product.name}</h1>
          <Link href={searchUrl(product.brand)} className="link-text">
            Visit the {product.brand} Store
          </Link>
          <div className="rating-line">
            <span>{product.rating}</span>
            <Stars rating={product.rating} />
            <ChevronDown size={14} />
            <Link href="#reviews">
              {product.ratingCount.toLocaleString()} ratings
            </Link>
          </div>
          {product.isBestseller && (
            <div className="best-seller">
              #1 Best Seller <i />
            </div>
          )}
          <hr />
          <div className="deal-price">
            <span>-{discount}%</span>
            <Price value={product.price} />
          </div>
          <div className="muted">
            List Price: <s>${product.originalPrice.toFixed(2)}</s>
          </div>
          <p className="small-copy">
            $15.00 Shipping & Import Fees Deposit to {store.location}{" "}
            <Link href="/help?topic=shipping">Details</Link>{" "}
            <ChevronDown size={12} />
          </p>
          {product.category === "Clothing, Shoes & Jewelry" && (
            <>
              <p>
                <b>Color:</b> {color}
              </p>
              <div className="swatches">
                {["Black", "Blue", "White"].map((value, index) => (
                  <button
                    key={value}
                    className={color === value ? "selected" : ""}
                    onClick={() => {
                      setColor(value);
                      setSelectedImage(
                        index < product.images.length ? index : 0,
                      );
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="feature-table">
            <b>Brand</b>
            <span>{product.brand}</span>
            <b>Category</b>
            <span>{product.subCategory}</span>
            <b>Model</b>
            <span>{product.id.padStart(4, "0")}</span>
            <b>Connectivity</b>
            <span>
              {product.category === "Electronics" ? "Wireless" : "Standard"}
            </span>
          </div>
          <hr />
          <h2>About this item</h2>
          <ul className="bullets">
            <li>{product.description}</li>
            <li>
              Designed for everyday use with a durable, comfortable finish.
            </li>
            <li>
              Backed by easy returns through this demo shopping experience.
            </li>
          </ul>
        </section>
        <aside className="buy-box">
          <Price value={product.price} />
          <p className="small-copy">
            $15.00 Shipping & Import Fees Deposit to {store.location}{" "}
            <Link href="/help?topic=shipping">Details</Link>
          </p>
          <p>
            <b>FREE delivery</b> <strong>Tuesday, September 22</strong>
          </p>
          <p className="fast-delivery">
            Or fastest delivery <b>Friday, September 18</b>
          </p>
          <button
            className="deliver-link"
            onClick={() =>
              document.querySelector<HTMLButtonElement>(".location")?.click()
            }
          >
            <MapPin size={17} /> Deliver to {store.location}
          </button>
          <div className="stock">In Stock</div>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            aria-label="Quantity"
          >
            {Array.from(
              { length: Math.min(8, product.stockQuantity) },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Quantity: {i + 1}
                </option>
              ),
            )}
          </select>
          <button
            className="yellow-button round"
            onClick={() => store.add(product.id, quantity, color)}
          >
            Add to Cart
          </button>
          <Link
            className="orange-button round"
            href="/checkout"
            onClick={() => store.add(product.id, quantity, color)}
          >
            Buy Now
          </Link>
          <div className="secure">
            <Lock size={14} />
            <Link href="/help?topic=secure">Secure transaction</Link>
          </div>
          <div className="shipping-table">
            <span>Ships from</span>
            <b>Amazon.com</b>
            <span>Sold by</span>
            <b>Amazon.com</b>
            <span>Returns</span>
            <Link href="/help?topic=returns">30-day refund/replacement</Link>
            <span>Payment</span>
            <Link href="/help?topic=secure">Secure transaction</Link>
          </div>
          <button
            className="outline-button full"
            onClick={() => store.save(product.id)}
          >
            <Heart size={16} /> Add to List
          </button>
        </aside>
      </div>
      <section className="recommendations">
        <h2>Products related to this item</h2>
        <div className="recommendation-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
      {related.length > 0 && (
        <section className="comparison">
          <h2>Compare with similar items</h2>
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th />
                  <th className="this-item">
                    <img src={product.images[0]} alt="" />
                    <span>{product.name}</span>
                    <em>This item</em>
                  </th>
                  {related.slice(0, 3).map((item) => (
                    <th key={item.id}>
                      <Link href={productUrl(item.id)}>
                        <img src={item.images[0]} alt="" />
                        <span>{item.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Price</th>
                  <td>
                    <Price value={product.price} />
                  </td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>
                      <Price value={item.price} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Customer Rating</th>
                  <td>
                    <Stars rating={product.rating} /> ({product.ratingCount})
                  </td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>
                      <Stars rating={item.rating} /> ({item.ratingCount})
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Brand</th>
                  <td>{product.brand}</td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>{item.brand}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{product.subCategory}</td>
                  {related.slice(0, 3).map((item) => (
                    <td key={item.id}>{item.subCategory}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="product-information">
        <h2>Product information</h2>
        <table>
          <tbody>
            <tr>
              <th scope="row">Brand</th>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <th scope="row">Model number</th>
              <td>{product.id.padStart(4, "0")}</td>
            </tr>
            <tr>
              <th scope="row">Department</th>
              <td>{product.category}</td>
            </tr>
            <tr>
              <th scope="row">Category</th>
              <td>{product.subCategory}</td>
            </tr>
            <tr>
              <th scope="row">Customer Reviews</th>
              <td>
                <Stars rating={product.rating} /> {product.rating} out of 5 (
                {product.ratingCount.toLocaleString()} ratings)
              </td>
            </tr>
            <tr>
              <th scope="row">Best Sellers Rank</th>
              <td>
                {product.isBestseller
                  ? `#1 in ${product.subCategory}`
                  : `#${(hashProductId(product.id) % 400) + 12} in ${product.subCategory}`}
              </td>
            </tr>
            <tr>
              <th scope="row">Availability</th>
              <td>
                {product.inStock
                  ? `In stock — ${product.stockQuantity} available`
                  : "Currently unavailable"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="product-description">
        <h2>Product description</h2>
        <p>{product.description}</p>
        <div className="trust-row">
          <span>
            <Check /> Quality checked
          </span>
          <span>
            <ShieldCheck /> Secure demo checkout
          </span>
          <span>
            <Lock /> No payment collected
          </span>
        </div>
      </section>
      <section id="questions" className="qanda">
        <h2>Looking for specific info?</h2>
        <div className="qanda-list">
          {QUESTIONS.map((item, i) => (
            <details key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
              <small>
                Answered by Amazon · {(hashProductId(product.id) % 40) + 3} people
                found this helpful
              </small>
            </details>
          ))}
        </div>
        <Link className="link-text" href="/help?topic=Customer Service">
          See more answered questions
        </Link>
      </section>
      <section id="reviews" className="reviews">
        <h2>Customer reviews</h2>
        <div className="review-summary">
          <div>
            <b>{product.rating}</b>
            <Stars rating={product.rating} />
            <p>{product.ratingCount} global ratings</p>
          </div>
          <div>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star}>
                <span>{star} star</span>
                <i>
                  <em style={{ width: `${histogram[star]}%` }} />
                </i>
                <span>{histogram[star]}%</span>
              </div>
            ))}
          </div>
        </div>
        <section className="customers-say">
          <h3>Customers say</h3>
          <p>
            Customers are generally satisfied with this {product.subCategory.toLowerCase()}
            , frequently mentioning its {SENTIMENT[0].toLowerCase()} and{" "}
            {SENTIMENT[1].toLowerCase()}. Reviews are generated from customer
            feedback in this demo catalog.
          </p>
          <div className="sentiment-chips">
            {SENTIMENT.map((chip, i) => (
              <span key={chip} className={i < 3 ? "positive" : ""}>
                {chip} {i < 3 ? "✓" : "~"}
              </span>
            ))}
          </div>
        </section>
        <div className="review-list">
          {reviews.map((entry) => (
            <article className="review-card" key={entry.key}>
              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  {entry.reviewer.charAt(0)}
                </span>
                <b>{entry.reviewer}</b>
              </div>
              <div>
                <Stars rating={entry.rating} />{" "}
                <strong>{entry.title}</strong>
              </div>
              <small>
                Reviewed in the United States on {entry.date}
                {entry.verified && (
                  <span className="verified-purchase">Verified Purchase</span>
                )}
              </small>
              <p>{entry.body}</p>
              <div className="review-actions">
                <span>{entry.helpful} people found this helpful</span>
                <button type="button" className="outline-button">
                  Helpful
                </button>
                <Link href="/help?topic=Customer Service">Report</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

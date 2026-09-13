import Link from "next/link";
import { products, searchUrl } from "@/lib/catalog";
import { ProductRow } from "@/components/product-row";
import SearchSort from "@/components/search-sort";
import BrandFilter from "@/components/brand-filter";

const PAGE_SIZE = 16;

type Query = {
  k?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  brand?: string;
  rating?: string;
  deal?: string;
  page?: string;
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const term = (query.k || "").trim().toLowerCase();
  const category = query.category || "";
  const min = Number(query.min || 0);
  const max = Number(query.max || 0);
  const brand = query.brand || "";
  const rating = Number(query.rating || 0);
  let results = products.filter(
    (product) =>
      (!term ||
        `${product.name} ${product.brand} ${product.subCategory}`
          .toLowerCase()
          .includes(term)) &&
      (!category ||
        product.category
          .toLowerCase()
          .startsWith(category.toLowerCase().replace(/s$/, ""))) &&
      (!brand || product.brand === brand) &&
      (!min || product.price >= min) &&
      (!max || product.price <= max) &&
      (!query.deal || product.isDeal) &&
      (!rating || product.rating >= rating),
  );
  if (query.sort === "price-asc")
    results = [...results].sort((a, b) => a.price - b.price);
  if (query.sort === "price-desc")
    results = [...results].sort((a, b) => b.price - a.price);
  if (query.sort === "rating")
    results = [...results].sort((a, b) => b.rating - a.rating);
  const href = (changes: Query) =>
    searchUrl(
      changes.k ?? query.k ?? "",
      changes.category ?? query.category ?? "",
    ) +
    `${(changes.min ?? query.min) ? `&min=${changes.min ?? query.min}` : ""}${(changes.max ?? query.max) ? `&max=${changes.max ?? query.max}` : ""}${(changes.sort ?? query.sort) ? `&sort=${changes.sort ?? query.sort}` : ""}${(changes.brand ?? query.brand) ? `&brand=${encodeURIComponent(changes.brand ?? query.brand ?? "")}` : ""}${(changes.rating ?? query.rating) ? `&rating=${changes.rating ?? query.rating}` : ""}${(changes.deal ?? query.deal) ? `&deal=${changes.deal ?? query.deal}` : ""}${changes.page ? `&page=${changes.page}` : ""}`;
  const brands = [
    ...new Set(
      products
        .filter(
          (p) =>
            !category ||
            p.category
              .toLowerCase()
              .startsWith(category.toLowerCase().replace(/s$/, "")),
        )
        .map((p) => p.brand),
    ),
  ];
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(query.page || 1) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageResults = results.slice(start, start + PAGE_SIZE);
  return (
    <div className="search-page">
      <div className="result-bar">
        <span>
          {results.length
            ? `${start + 1}-${start + pageResults.length} of ${results.length.toLocaleString()} results for`
            : "No results for"}
        </span>
        <b>“{query.k || category || "all products"}”</b>
        <SearchSort value={query.sort || "featured"} />
      </div>
      <div className="search-layout">
        <aside className="filters">
          <section>
            <h3>Department</h3>
            <Link href={searchUrl(query.k)}>‹ Any Department</Link>
            <Link
              className={!category ? "active" : ""}
              href={searchUrl(query.k)}
            >
              All
            </Link>
            <Link
              className={category === "Electronics" ? "active" : ""}
              href={href({ category: "Electronics" })}
            >
              Electronics
            </Link>
            <Link
              className={category === "Fashions" ? "active" : ""}
              href={href({ category: "Fashions" })}
            >
              Clothing, Shoes & Jewelry
            </Link>
          </section>
          <section>
            <h3>Customer Reviews</h3>
            {[4, 3, 2, 1].map((value) => (
              <Link
                key={value}
                className={rating === value ? "active" : ""}
                href={href({ rating: String(value) })}
              >
                <span className="stars">
                  {"★".repeat(value)}
                  {"☆".repeat(5 - value)}
                </span>{" "}
                & Up
              </Link>
            ))}
          </section>
          <section>
            <h3>Price</h3>
            <Link
              className={!min && max === 25 ? "active" : ""}
              href={href({ min: "", max: "25" })}
            >
              Under $25
            </Link>
            <Link
              className={min === 25 && max === 50 ? "active" : ""}
              href={href({ min: "25", max: "50" })}
            >
              $25 to $50
            </Link>
            <Link
              className={min === 50 && max === 125 ? "active" : ""}
              href={href({ min: "50", max: "125" })}
            >
              $50 to $125
            </Link>
            <Link
              className={min === 125 && !max ? "active" : ""}
              href={href({ min: "125", max: "" })}
            >
              $125 &amp; Above
            </Link>
            <Link href={href({ min: "", max: "" })}>Clear price</Link>
          </section>
          <section>
            <h3>Deals &amp; Discounts</h3>
            <Link
              className={!query.deal ? "active" : ""}
              href={href({ deal: "" })}
            >
              All Discounts
            </Link>
            <Link
              className={query.deal ? "active" : ""}
              href={href({ deal: "1" })}
            >
              Today&apos;s Deals
            </Link>
          </section>
          <BrandFilter
            brands={brands.map((value) => ({
              value,
              href: href({ brand: value }),
              active: brand === value,
            }))}
          />
        </aside>
        <section className="results">
          <h1>Results</h1>
          <p className="muted">
            Check each product page for other buying options.
          </p>
          {results.length ? (
            <>
              <div className="results-list">
                {pageResults.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    rank={start + index}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Search results pages">
                  <Link
                    className={`page-step ${page === 1 ? "disabled" : ""}`}
                    href={href({ page: String(Math.max(1, page - 1)) })}
                    aria-disabled={page === 1}
                  >
                    ← Previous
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === totalPages ||
                        Math.abs(n - page) <= 2,
                    )
                    .map((n, i, arr) => (
                      <span key={n}>
                        {i > 0 && arr[i - 1] !== n - 1 && (
                          <span className="page-gap">…</span>
                        )}
                        <Link
                          className={n === page ? "current" : ""}
                          href={href({ page: String(n) })}
                          aria-current={n === page ? "page" : undefined}
                        >
                          {n}
                        </Link>
                      </span>
                    ))}
                  <Link
                    className={`page-step ${page === totalPages ? "disabled" : ""}`}
                    href={href({ page: String(Math.min(totalPages, page + 1)) })}
                    aria-disabled={page === totalPages}
                  >
                    Next →
                  </Link>
                </nav>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h2>No results for “{query.k}”</h2>
              <p>Try checking your spelling or use more general terms.</p>
              <Link className="yellow-button" href="/s?k=">
                Browse all products
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

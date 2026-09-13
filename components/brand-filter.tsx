"use client";
import Link from "next/link";
import { useState } from "react";

const VISIBLE_COUNT = 10;

export default function BrandFilter({
  brands,
}: {
  brands: { value: string; href: string; active: boolean }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? brands : brands.slice(0, VISIBLE_COUNT);
  const hidden = brands.length - VISIBLE_COUNT;
  return (
    <section>
      <h3>Brands</h3>
      {visible.map((brand) => (
        <Link
          key={brand.value}
          className={brand.active ? "active" : ""}
          href={brand.href}
        >
          □ {brand.value}
        </Link>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="link-text see-more-brands"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "See less" : `See more (${hidden})`}
        </button>
      )}
    </section>
  );
}

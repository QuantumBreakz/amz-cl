"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchSort({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <label>
      Sort by:{" "}
      <select
        value={value}
        onChange={(event) => {
          const next = new URLSearchParams(searchParams.toString());
          if (event.target.value === "featured") next.delete("sort");
          else next.set("sort", event.target.value);
          router.push(`${pathname}?${next.toString()}`);
        }}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Avg. Customer Review</option>
      </select>
    </label>
  );
}

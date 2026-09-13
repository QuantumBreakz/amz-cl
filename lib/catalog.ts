import catalog from "./catalog.json";
export const products = catalog.products;
export const categories = catalog.categories;
export const banners = catalog.banners;
export type Product = (typeof products)[number];
export const productById = (id: string) => products.find((p) => p.id === id);
export const productUrl = (id: string) => `/dp/${id}`;
export const searchUrl = (q = "", category = "") =>
  `/s?k=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ""}`;

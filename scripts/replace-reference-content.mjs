#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const catalogPath = join(root, "lib", "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const imageSets = {
  "Arts & Crafts": ["/assets/original/catalog/arts-office-books.png"],
  Automotive: ["/assets/original/catalog/tools-auto.png"],
  Baby: ["/assets/original/catalog/toys-baby.png"],
  "Beauty & Personal Care": ["/assets/original/catalog/beauty-health.png"],
  Books: ["/assets/original/catalog/arts-office-books.png"],
  "Clothing, Shoes & Jewelry": [
    "/assets/original/catalog/clothing-a.png",
    "/assets/original/catalog/clothing-b.png",
  ],
  Computers: [
    "/assets/original/catalog/electronics-a.png",
    "/assets/original/catalog/electronics-b.png",
  ],
  Electronics: [
    "/assets/original/catalog/electronics-a.png",
    "/assets/original/catalog/electronics-b.png",
  ],
  "Health & Household": ["/assets/original/catalog/beauty-health.png"],
  "Home & Kitchen": [
    "/assets/original/catalog/home-a.png",
    "/assets/original/catalog/home-b.png",
  ],
  "Kitchen & Dining": [
    "/assets/original/catalog/kitchen-a.png",
    "/assets/original/catalog/kitchen-b.png",
  ],
  "Luggage & Travel": ["/assets/original/catalog/travel.png"],
  "Office Products": ["/assets/original/catalog/arts-office-books.png"],
  "Pet Supplies": ["/assets/original/catalog/pets.png"],
  "Sports & Outdoors": [
    "/assets/original/catalog/sports-a.png",
    "/assets/original/catalog/sports-b.png",
  ],
  "Tools & Home Improvement": ["/assets/original/catalog/tools-auto.png"],
  "Toys & Games": ["/assets/original/catalog/toys-baby.png"],
  "Video Games": ["/assets/original/catalog/electronics-b.png"],
};

const categoryNouns = {
  "Arts & Crafts": "Creative Supply Set",
  Automotive: "Roadside Accessory",
  Baby: "Baby Care Essential",
  "Beauty & Personal Care": "Personal Care Essential",
  Books: "Contemporary Paperback",
  "Clothing, Shoes & Jewelry": "Wardrobe Essential",
  Computers: "Computer Accessory",
  Electronics: "Tech Accessory",
  "Health & Household": "Home Wellness Essential",
  "Home & Kitchen": "Home Essential",
  "Kitchen & Dining": "Kitchen Essential",
  "Luggage & Travel": "Travel Essential",
  "Office Products": "Desk and Office Essential",
  "Pet Supplies": "Pet Care Essential",
  "Sports & Outdoors": "Active Gear Essential",
  "Tools & Home Improvement": "Home Project Essential",
  "Toys & Games": "Playtime Essential",
  "Video Games": "Gaming Accessory",
};

const descriptors = [
  "Everyday",
  "Classic",
  "Compact",
  "Modern",
  "Refined",
  "Versatile",
  "Easy-Care",
  "Lightweight",
  "Premium",
  "Smart",
  "Durable",
  "Reliable",
];

const perCategoryIndex = new Map();
catalog.products = catalog.products.map((product) => {
  const index = perCategoryIndex.get(product.category) ?? 0;
  perCategoryIndex.set(product.category, index + 1);
  const images = imageSets[product.category] ?? ["/assets/original/catalog/general.png"];
  const noun = categoryNouns[product.category] ?? "Marketplace Essential";
  const descriptor = descriptors[index % descriptors.length];
  const subcategory = product.subCategory ? ` · ${product.subCategory}` : "";

  return {
    ...product,
    name: `${descriptor} ${noun}${subcategory}`,
    images: [images[index % images.length]],
    description: `An original, unbranded ${noun.toLowerCase()} selected for the ${product.category} demo catalog. Product details, pricing, ratings, and availability are illustrative.`,
    brand: "Unbranded",
  };
});

catalog.categories = catalog.categories.map((category) => ({
  ...category,
  image: (imageSets[category.name] ?? ["/assets/original/catalog/general.png"])[0],
}));

catalog.banners = [
  { id: "1", image: "/assets/original/campaign/gaming.png", title: "Electronics", link: "/s?category=Electronics" },
  { id: "2", image: "/assets/original/campaign/school.png", title: "Back to School", link: "/s?category=Office%20Products" },
  { id: "3", image: "/assets/original/campaign/kitchen.png", title: "Kitchen Essentials", link: "/s?category=Kitchen%20%26%20Dining" },
  { id: "4", image: "/assets/original/campaign/toys.png", title: "Playtime Picks", link: "/s?category=Toys%20%26%20Games" },
];

writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Replaced product copy and imagery for ${catalog.products.length} catalog entries.`);

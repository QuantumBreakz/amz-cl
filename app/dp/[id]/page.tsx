import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { productById } from "@/lib/catalog";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

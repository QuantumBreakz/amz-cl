import { OrderConfirmation } from "@/components/orders";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id = "" } = await searchParams;
  return <OrderConfirmation id={id} />;
}

export type CartLine = { id: string; quantity: number; color?: string };
export type ProductPrice = { id: string; price: number; stockQuantity: number };
export function setQuantity(
  lines: CartLine[],
  id: string,
  quantity: number,
  catalog: ProductPrice[],
  color?: string,
): CartLine[] {
  const product = catalog.find((p) => p.id === id);
  if (!product || !Number.isFinite(quantity)) return lines;
  const next = Math.min(
    product.stockQuantity,
    Math.max(0, Math.floor(quantity)),
  );
  const remaining = lines.filter((line) => line.id !== id);
  if (!next) return remaining;
  const existing = lines.find((line) => line.id === id);
  return existing
    ? lines.map((line) =>
        line.id === id
          ? { ...line, quantity: next, color: color ?? line.color }
          : line,
      )
    : [...remaining, { id, quantity: next, color }];
}
export function subtotalCents(lines: CartLine[], catalog: ProductPrice[]) {
  return lines.reduce(
    (sum, line) =>
      sum +
      Math.round((catalog.find((p) => p.id === line.id)?.price ?? 0) * 100) *
        line.quantity,
    0,
  );
}
export function validCart(value: unknown, catalog: ProductPrice[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartLine[]>((result, line) => {
    if (
      !line ||
      typeof line.id !== "string" ||
      typeof line.quantity !== "number"
    )
      return result;
    return setQuantity(
      result,
      line.id,
      line.quantity,
      catalog,
      typeof line.color === "string" ? line.color : undefined,
    );
  }, []);
}
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

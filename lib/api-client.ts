import type {
  CatalogProduct,
  CommerceState,
  Order,
} from "@amazon-clone/backend";

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers,
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiClientError(
      payload?.error?.code ?? "REQUEST_FAILED",
      payload?.error?.message ?? "The server could not complete the request.",
      response.status,
      payload?.error?.details,
    );
  }
  return payload.data as T;
}

const json = (value: unknown) => JSON.stringify(value);

export const apiClient = {
  catalog: (input: { q: string; category?: string; limit?: number }, signal?: AbortSignal) => {
    const search = new URLSearchParams({ q: input.q });
    if (input.category) search.set("category", input.category);
    search.set("limit", String(input.limit ?? 5));
    return request<{
      items: CatalogProduct[];
      total: number;
      offset: number;
      limit: number;
    }>(`/catalog?${search}`, { signal });
  },
  session: () => request<CommerceState>("/session"),
  register: (input: { name: string; email: string; password: string }) =>
    request<CommerceState>("/auth/register", { method: "POST", body: json(input) }),
  login: (input: { email: string; password: string }) =>
    request<CommerceState>("/auth/login", { method: "POST", body: json(input) }),
  logout: () => request<CommerceState>("/auth/logout", { method: "POST", body: json({}) }),
  addCart: (productId: string, quantity: number, color?: string) =>
    request<CommerceState>("/cart", {
      method: "POST",
      body: json({ productId, quantity, color }),
    }),
  setCartLine: (productId: string, quantity: number, color?: string) =>
    request<CommerceState>(`/cart/${encodeURIComponent(productId)}`, {
      method: "PATCH",
      body: json({ quantity, color }),
    }),
  removeCartLine: (productId: string) =>
    request<CommerceState>(`/cart/${encodeURIComponent(productId)}`, {
      method: "DELETE",
    }),
  saveItem: (productId: string) =>
    request<CommerceState>("/wishlist", {
      method: "POST",
      body: json({ productId }),
    }),
  removeSavedItem: (productId: string) =>
    request<CommerceState>(`/wishlist/${encodeURIComponent(productId)}`, {
      method: "DELETE",
    }),
  updateProfile: (input: { name?: string; location?: string; language?: string }) =>
    request<CommerceState>("/profile", { method: "PATCH", body: json(input) }),
  placeOrder: (input: { name: string; address: string; idempotencyKey: string }) =>
    request<{ order: Order; state: CommerceState }>("/orders", {
      method: "POST",
      body: json(input),
    }),
};

export type { CommerceState, Order };

import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest, NextResponse } from "next/server";
import { backend } from "../lib/server/backend";
import * as sessionRoute from "../app/api/v1/session/route";
import * as registerRoute from "../app/api/v1/auth/register/route";
import * as loginRoute from "../app/api/v1/auth/login/route";
import * as logoutRoute from "../app/api/v1/auth/logout/route";
import * as cartRoute from "../app/api/v1/cart/route";
import * as cartLineRoute from "../app/api/v1/cart/[id]/route";
import * as wishlistRoute from "../app/api/v1/wishlist/route";
import * as wishlistItemRoute from "../app/api/v1/wishlist/[id]/route";
import * as ordersRoute from "../app/api/v1/orders/route";
import * as orderRoute from "../app/api/v1/orders/[id]/route";
import * as catalogRoute from "../app/api/v1/catalog/route";
import * as catalogItemRoute from "../app/api/v1/catalog/[id]/route";
import * as profileRoute from "../app/api/v1/profile/route";
import * as healthRoute from "../app/api/v1/health/route";

class CookieJar {
  private values = new Map<string, string>();

  apply(response: NextResponse) {
    for (const cookie of response.cookies.getAll()) {
      if (cookie.value) this.values.set(cookie.name, cookie.value);
      else this.values.delete(cookie.name);
    }
  }

  header() {
    return [...this.values].map(([name, value]) => `${name}=${value}`).join("; ");
  }
}

function request(
  path: string,
  options: { method?: string; body?: unknown; jar?: CookieJar } = {},
) {
  const headers = new Headers({ origin: "http://localhost:3000" });
  if (options.body !== undefined) headers.set("content-type", "application/json");
  if (options.jar?.header()) headers.set("cookie", options.jar.header());
  return new NextRequest(`http://localhost:3000${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

async function data(response: Response) {
  return (await response.json()).data;
}

beforeEach(() => backend.database.reset());

test("guest cart survives requests and enforces catalog stock", async () => {
  const jar = new CookieJar();
  const session = await sessionRoute.GET(request("/api/v1/session"));
  jar.apply(session);
  const added = await cartRoute.POST(
    request("/api/v1/cart", { method: "POST", body: { productId: "1", quantity: 999 }, jar }),
  );
  jar.apply(added);
  assert.equal(added.status, 201);
  const state = await data(await sessionRoute.GET(request("/api/v1/session", { jar })));
  assert.equal(state.cart[0].id, "1");
  assert.equal(state.cart[0].quantity, 50);
});

test("registration, logout, login, and duplicate account errors work over HTTP", async () => {
  const jar = new CookieJar();
  jar.apply(await sessionRoute.GET(request("/api/v1/session")));
  const registered = await registerRoute.POST(
    request("/api/v1/auth/register", {
      method: "POST",
      jar,
      body: { name: "Ali Ahmed", email: "api@example.com", password: "password-123" },
    }),
  );
  jar.apply(registered);
  assert.equal((await data(registered)).user.email, "api@example.com");

  const duplicateJar = new CookieJar();
  duplicateJar.apply(await sessionRoute.GET(request("/api/v1/session")));
  const duplicate = await registerRoute.POST(
    request("/api/v1/auth/register", {
      method: "POST",
      jar: duplicateJar,
      body: { name: "Ali Ahmed", email: "api@example.com", password: "password-456" },
    }),
  );
  assert.equal(duplicate.status, 409);

  const loggedOut = await logoutRoute.POST(
    request("/api/v1/auth/logout", { method: "POST", body: {}, jar }),
  );
  jar.apply(loggedOut);
  assert.equal((await data(loggedOut)).user, null);

  const wrong = await loginRoute.POST(
    request("/api/v1/auth/login", {
      method: "POST",
      jar,
      body: { email: "api@example.com", password: "wrong" },
    }),
  );
  assert.equal(wrong.status, 401);

  const loggedIn = await loginRoute.POST(
    request("/api/v1/auth/login", {
      method: "POST",
      jar,
      body: { email: "api@example.com", password: "password-123" },
    }),
  );
  assert.equal((await data(loggedIn)).user.name, "Ali Ahmed");
});

test("wishlist, cart, order creation, idempotency, and ownership compose through routes", async () => {
  const first = new CookieJar();
  first.apply(await sessionRoute.GET(request("/api/v1/session")));
  first.apply(
    await cartRoute.POST(
      request("/api/v1/cart", { method: "POST", body: { productId: "1", quantity: 2 }, jar: first }),
    ),
  );
  const saved = await wishlistRoute.POST(
    request("/api/v1/wishlist", { method: "POST", body: { productId: "2" }, jar: first }),
  );
  assert.deepEqual((await data(saved)).saved, ["2"]);

  const input = {
    name: "Ali Ahmed",
    address: "123 Main Street, Lahore, Punjab 54000, Pakistan",
    idempotencyKey: "api-order-attempt-00001",
  };
  const placed = await ordersRoute.POST(
    request("/api/v1/orders", { method: "POST", body: input, jar: first }),
  );
  const placedData = await data(placed);
  const retry = await ordersRoute.POST(
    request("/api/v1/orders", { method: "POST", body: input, jar: first }),
  );
  assert.equal((await data(retry)).order.id, placedData.order.id);
  assert.equal(placedData.state.cart.length, 0);

  const detail = await orderRoute.GET(request(`/api/v1/orders/${placedData.order.id}`, { jar: first }), {
    params: Promise.resolve({ id: placedData.order.id }),
  });
  assert.equal(detail.status, 200);

  const second = new CookieJar();
  second.apply(await sessionRoute.GET(request("/api/v1/session")));
  const forbidden = await orderRoute.GET(
    request(`/api/v1/orders/${placedData.order.id}`, { jar: second }),
    { params: Promise.resolve({ id: placedData.order.id }) },
  );
  assert.equal(forbidden.status, 404);

  const removed = await cartLineRoute.DELETE(request("/api/v1/cart/1", { method: "DELETE", jar: first }), {
    params: Promise.resolve({ id: "1" }),
  });
  assert.equal(removed.status, 200);
});

test("catalog endpoint supports search, category filters, pagination, and validation", async () => {
  const filtered = await catalogRoute.GET(
    request("/api/v1/catalog?q=audio&category=Electronics&limit=5"),
  );
  const result = await data(filtered);
  assert.equal(result.limit, 5);
  assert.ok(result.total > 0);
  assert.ok(result.items.every((item: { category: string }) => item.category === "Electronics"));

  const invalid = await catalogRoute.GET(request("/api/v1/catalog?offset=-1"));
  assert.equal(invalid.status, 400);

  const item = await catalogItemRoute.GET(request("/api/v1/catalog/1"), {
    params: Promise.resolve({ id: "1" }),
  });
  assert.equal((await data(item)).id, "1");
  const missing = await catalogItemRoute.GET(request("/api/v1/catalog/missing"), {
    params: Promise.resolve({ id: "missing" }),
  });
  assert.equal(missing.status, 404);
});

test("profile and health reads expose only public state", async () => {
  const jar = new CookieJar();
  jar.apply(await sessionRoute.GET(request("/api/v1/session")));
  const updated = await profileRoute.PATCH(
    request("/api/v1/profile", {
      method: "PATCH",
      jar,
      body: { name: "Ali Ahmed", location: "Canada", language: "Español" },
    }),
  );
  assert.equal((await data(updated)).location, "Canada");
  const profile = await data(await profileRoute.GET(request("/api/v1/profile", { jar })));
  assert.deepEqual(profile, { name: "Ali Ahmed", location: "Canada", language: "Español", user: null });

  const health = await healthRoute.GET();
  assert.equal((await data(health)).catalogProducts, 191);
});

test("HTTP boundary rejects foreign origins and non-JSON mutation bodies", async () => {
  const foreign = new NextRequest("http://localhost:3000/api/v1/cart", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
      "content-type": "application/json",
    },
    body: JSON.stringify({ productId: "1", quantity: 1 }),
  });
  const rejected = await cartRoute.POST(foreign);
  assert.equal(rejected.status, 403);
  assert.equal((await rejected.json()).error.code, "INVALID_ORIGIN");

  const wrongMedia = new NextRequest("http://localhost:3000/api/v1/cart", {
    method: "POST",
    headers: { origin: "http://localhost:3000", "content-type": "text/plain" },
    body: JSON.stringify({ productId: "1", quantity: 1 }),
  });
  const unsupported = await cartRoute.POST(wrongMedia);
  assert.equal(unsupported.status, 415);
});

test("every cart, wishlist, and order read/update endpoint returns current actor state", async () => {
  const jar = new CookieJar();
  jar.apply(await sessionRoute.GET(request("/api/v1/session")));
  jar.apply(
    await cartRoute.POST(
      request("/api/v1/cart", {
        method: "POST",
        jar,
        body: { productId: "1", quantity: 1 },
      }),
    ),
  );
  const patched = await cartLineRoute.PATCH(
    request("/api/v1/cart/1", {
      method: "PATCH",
      jar,
      body: { quantity: 3, color: "Black" },
    }),
    { params: Promise.resolve({ id: "1" }) },
  );
  assert.deepEqual((await data(patched)).cart[0], {
    id: "1",
    quantity: 3,
    color: "Black",
  });
  assert.equal((await data(await cartRoute.GET(request("/api/v1/cart", { jar }))))[0].quantity, 3);

  await wishlistRoute.POST(
    request("/api/v1/wishlist", {
      method: "POST",
      jar,
      body: { productId: "2" },
    }),
  );
  assert.deepEqual(
    await data(await wishlistRoute.GET(request("/api/v1/wishlist", { jar }))),
    ["2"],
  );
  const unsaved = await wishlistItemRoute.DELETE(
    request("/api/v1/wishlist/2", { method: "DELETE", jar }),
    { params: Promise.resolve({ id: "2" }) },
  );
  assert.deepEqual((await data(unsaved)).saved, []);

  const placed = await ordersRoute.POST(
    request("/api/v1/orders", {
      method: "POST",
      jar,
      body: {
        name: "Ali Ahmed",
        address: "42 Test Avenue, Karachi, Sindh 75500, Pakistan",
        idempotencyKey: "all-endpoints-order-00001",
      },
    }),
  );
  const orderId = (await data(placed)).order.id;
  const orders = await data(await ordersRoute.GET(request("/api/v1/orders", { jar })));
  assert.equal(orders[0].id, orderId);
});

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BackendDatabase, BackendError, CommerceBackend } from "../src/index";

const products = [
  {
    id: "p1",
    name: "Product One",
    price: 19.99,
    stockQuantity: 3,
    category: "Electronics",
    subCategory: "Audio",
    brand: "Unbranded",
    images: ["/one.png"],
    inStock: true,
  },
  {
    id: "p2",
    name: "Product Two",
    price: 0.1,
    stockQuantity: 10,
    category: "Home",
    subCategory: "Decor",
    brand: "Unbranded",
    images: ["/two.png"],
    inStock: true,
  },
];

function setup() {
  const database = new BackendDatabase();
  const service = new CommerceBackend(products, database);
  const first = service.resolveActor("guest-0000000000000001");
  const second = service.resolveActor("guest-0000000000000002");
  return { database, service, first, second };
}

test("cart mutations floor quantities, clamp stock, remove lines, and reject unknown products", () => {
  const { service, first } = setup();
  assert.deepEqual(service.addCartLine(first, { productId: "p1", quantity: 2.9 }).cart, [
    { id: "p1", quantity: 2, color: undefined },
  ]);
  assert.equal(
    service.addCartLine(first, { productId: "p1", quantity: 99 }).cart[0].quantity,
    3,
  );
  assert.deepEqual(service.removeCartLine(first, "p1").cart, []);
  assert.throws(
    () => service.addCartLine(first, { productId: "missing" }),
    (error: unknown) => error instanceof BackendError && error.code === "PRODUCT_NOT_FOUND",
  );
});

test("guest actors cannot read or mutate each other's commerce state", () => {
  const { service, first, second } = setup();
  service.addCartLine(first, { productId: "p1" });
  service.saveItem(first, "p2");
  assert.equal(service.getState(first).cart.length, 1);
  assert.deepEqual(service.getState(first).saved, ["p2"]);
  assert.deepEqual(service.getState(second).cart, []);
  assert.deepEqual(service.getState(second).saved, []);
});

test("registration hashes credentials, merges guest state, and establishes a server session", () => {
  const { database, service, first } = setup();
  service.addCartLine(first, { productId: "p1", quantity: 2 });
  service.saveItem(first, "p2");
  const result = service.register(first, {
    name: "Ali Ahmed",
    email: "ALI@example.com",
    password: "correct-horse-123",
  });
  assert.equal(result.state.user?.email, "ali@example.com");
  assert.equal(result.state.cart[0].quantity, 2);
  assert.deepEqual(result.state.saved, ["p2"]);
  assert.notEqual(database.read().users[0].passwordHash, "correct-horse-123");
  assert.ok(database.read().sessions[0].tokenHash);
  assert.equal(service.resolveActor(first.guestId, result.token).user?.name, "Ali Ahmed");
});

test("duplicate registration and invalid login return stable public errors", () => {
  const { service, first, second } = setup();
  service.register(first, {
    name: "Ali Ahmed",
    email: "ali@example.com",
    password: "correct-horse-123",
  });
  assert.throws(
    () =>
      service.register(second, {
        name: "Other",
        email: "ali@example.com",
        password: "another-pass-123",
      }),
    (error: unknown) => error instanceof BackendError && error.status === 409,
  );
  assert.throws(
    () => service.login(second, { email: "ali@example.com", password: "wrong" }),
    (error: unknown) =>
      error instanceof BackendError && error.code === "INVALID_CREDENTIALS" && error.status === 401,
  );
});

test("login merges a later guest cart and logout invalidates only that session", () => {
  const { service, first, second } = setup();
  const registered = service.register(first, {
    name: "Ali Ahmed",
    email: "ali@example.com",
    password: "correct-horse-123",
  });
  service.addCartLine(second, { productId: "p1", quantity: 2 });
  const loggedIn = service.login(second, {
    email: "ali@example.com",
    password: "correct-horse-123",
  });
  assert.equal(loggedIn.state.cart[0].quantity, 2);
  service.logout(loggedIn.token);
  assert.equal(service.resolveActor(second.guestId, loggedIn.token).user, null);
  assert.equal(service.resolveActor(first.guestId, registered.token).user?.email, "ali@example.com");
});

test("orders use authoritative prices, clear the cart, and are idempotent", () => {
  const { service, first, second } = setup();
  service.addCartLine(first, { productId: "p1", quantity: 2 });
  service.addCartLine(first, { productId: "p2", quantity: 3 });
  const input = {
    name: "Ali Ahmed",
    address: "123 Main Street, Lahore, Punjab 54000, Pakistan",
    idempotencyKey: "checkout-attempt-00000001",
  };
  const firstResult = service.placeOrder(first, input);
  const retry = service.placeOrder(first, input);
  assert.equal(firstResult.order.total, 40.28);
  assert.deepEqual(firstResult.state.cart, []);
  assert.equal(retry.order.id, firstResult.order.id);
  assert.equal(retry.state.orders.length, 1);
  assert.throws(
    () => service.getOrder(second, firstResult.order.id),
    (error: unknown) => error instanceof BackendError && error.status === 404,
  );
});

test("profile and catalog queries validate and return scoped results", () => {
  const { service, first } = setup();
  const state = service.updateProfile(first, { name: "Ali Ahmed", location: "Canada" });
  assert.equal(state.name, "Ali Ahmed");
  assert.equal(state.location, "Canada");
  assert.equal(service.listProducts({ q: "product", category: "Electronics" }).total, 1);
  assert.equal(service.getProduct("p2").price, 0.1);
});

test("file storage survives restart and rejects malformed persisted records", () => {
  const directory = mkdtempSync(join(tmpdir(), "amazon-backend-"));
  const file = join(directory, "data.json");
  try {
    const firstDatabase = new BackendDatabase(file);
    const firstService = new CommerceBackend(products, firstDatabase);
    const actor = firstService.resolveActor("guest-persistent-000001");
    firstService.addCartLine(actor, { productId: "p1", quantity: 2 });

    const saved = JSON.parse(readFileSync(file, "utf8"));
    assert.equal(saved.actors[actor.actorId].cart[0].quantity, 2);
    const restarted = new CommerceBackend(products, new BackendDatabase(file));
    assert.equal(restarted.getState(actor).cart[0].quantity, 2);

    writeFileSync(
      file,
      JSON.stringify({
        version: 1,
        users: [],
        sessions: [],
        actors: {
          [actor.actorId]: {
            cart: [{ id: "p1", quantity: { malicious: true } }],
            saved: [],
            orders: [],
            name: "",
            location: "Pakistan",
            orderKeys: {},
          },
        },
      }),
    );
    const recovered = new CommerceBackend(products, new BackendDatabase(file));
    assert.deepEqual(recovered.getState(actor).cart, []);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

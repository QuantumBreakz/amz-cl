import test from "node:test";
import assert from "node:assert/strict";
import { setQuantity, subtotalCents, validCart } from "../lib/commerce.ts";

const catalog = [
  { id: "a", price: 19.99, stockQuantity: 3 },
  { id: "b", price: 0.1, stockQuantity: 10 },
];

test("adds, updates, clamps, and removes cart quantities", () => {
  assert.deepEqual(setQuantity([], "a", 2, catalog), [
    { id: "a", quantity: 2, color: undefined },
  ]);
  assert.equal(
    setQuantity([{ id: "a", quantity: 2 }], "a", 99, catalog)[0].quantity,
    3,
  );
  assert.deepEqual(
    setQuantity([{ id: "a", quantity: 2 }], "a", 0, catalog),
    [],
  );
});

test("calculates totals in cents to avoid floating point drift", () => {
  assert.equal(
    subtotalCents(
      [
        { id: "a", quantity: 2 },
        { id: "b", quantity: 3 },
      ],
      catalog,
    ),
    4028,
  );
});

test("sanitizes malformed persisted cart state", () => {
  const result = validCart(
    [
      { id: "a", quantity: 2.9, color: "Blue" },
      { id: "missing", quantity: 4 },
      null,
      { id: "b", quantity: -1 },
    ],
    catalog,
  );
  assert.deepEqual(result, [{ id: "a", quantity: 2, color: "Blue" }]);
});

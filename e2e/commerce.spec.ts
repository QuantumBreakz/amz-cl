import { expect, test } from "@playwright/test";

test("header suggestions are served by the catalog API", async ({ page }) => {
  await page.goto("/");
  const response = page.waitForResponse(
    (candidate) =>
      candidate.url().includes("/api/v1/catalog?") && candidate.ok(),
  );
  await page.getByRole("combobox", { name: "Search Amazon" }).fill("active gear");
  await response;
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.locator("#search-suggestions [role=option]").first()).toContainText(
    "Active Gear",
  );
});

test("guest cart survives registration and becomes a persisted order", async ({
  page,
}) => {
  const sessionReady = page.waitForResponse((response) =>
    response.url().endsWith("/api/v1/session"),
  );
  await page.goto("/dp/ref-1");
  await sessionReady;
  const productName = (await page.locator(".product-info h1").textContent())?.trim();
  expect(productName).toBeTruthy();

  const added = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/cart") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
  const addResponse = await added;
  expect(addResponse.status(), await addResponse.text()).toBe(201);
  await page.reload();
  await expect(page.locator(".cart-icon b")).toHaveText("1");

  const email = `ali.e2e+${Date.now()}@example.com`;
  await page.goto("/ap/register");
  await page.getByLabel("Your name").fill("Ali Ahmed");
  await page.getByLabel("Email or mobile phone number").fill(email);
  await page.getByLabel("Password").fill("amazon-clone-test-password");
  await page
    .getByRole("button", { name: "Create your Amazon account" })
    .click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByText(email)).toBeVisible();

  await page.reload();
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.locator(".cart-icon b")).toHaveText("1");

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();
  await expect(page.getByText(productName!, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Proceed to checkout" }).click();

  await page.getByLabel("Full name (First and Last name)").fill("Ali Ahmed");
  await page.getByLabel("Street address").fill("42 Test Avenue");
  await page.getByLabel("City").fill("Karachi");
  await page.getByLabel("State / Province").fill("Sindh");
  await page.getByLabel("ZIP / Postal code").fill("75500");
  await page.getByRole("button", { name: "Place your order" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?id=/);
  await expect(
    page.getByRole("heading", { name: "Order placed, thank you!" }),
  ).toBeVisible();
  await expect(page.getByText("Ali Ahmed", { exact: true })).toBeVisible();

  await page.goto("/orders");
  await expect(page.getByRole("heading", { name: "Your Orders" })).toBeVisible();
  await expect(page.getByText(productName!, { exact: true })).toBeVisible();

  const response = await page.request.get("/api/v1/session");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.data.user.email).toBe(email);
  expect(payload.data.cart).toEqual([]);
  expect(payload.data.orders).toHaveLength(1);
  expect(payload.data.orders[0].name).toBe("Ali Ahmed");
});

test("preferences are backend-backed and survive a full reload", async ({ page }) => {
  await page.goto("/preferences");
  await page.getByRole("radio", { name: "Español" }).check();
  await page.getByRole("combobox").last().selectOption({ label: "United States" });
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForTimeout(250);
  await page.reload();
  await expect(page.getByRole("radio", { name: "Español" })).toBeChecked();
  await expect(page.getByRole("combobox").last()).toHaveValue("United States");
});

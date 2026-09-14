import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "line",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command:
      "AMAZON_BACKEND_DATA_FILE=.data/e2e.json npx next dev --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/api/v1/health",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".playwright-artifacts",
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:8137",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run serve -- --bind 127.0.0.1",
    url: "http://127.0.0.1:8137",
    reuseExistingServer: true,
  },
});

import { expect, test } from "@playwright/test";

test("runs PHP on a phone", async ({ page }) => {
  await page.goto("/playground");
  await page.getByRole("button", { name: /^Run$/ }).click();
  await expect(page.locator("pre.terminal").first()).toContainText("Hello, world!", { timeout: 30_000 });
  await expect(page.getByRole("navigation", { name: "Main" }).last()).toBeVisible();
});

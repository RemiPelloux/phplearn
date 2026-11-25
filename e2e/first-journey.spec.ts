import { expect, test } from "@playwright/test";

test("a newcomer writes and runs their first PHP", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("real PHP");
  await page.getByRole("link", { name: /Start learning/ }).first().click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.waitForURL("**/learn/hello-php");

  // Discover → example → watch
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Run$/ }).first().click();
  await expect(page.locator("pre.terminal").first()).toContainText("Hello, world!", { timeout: 30_000 });
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Skip ahead|Your turn/ }).click();

  // Try: edit the code and run it on real PHP
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.type('<?php\necho "Hello, PHP!";\n');
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(page.getByText("Every objective passes")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/PHP 8\.5\.\d+/).first()).toBeVisible();
});

test("the playground traces code and explains errors", async ({ page }) => {
  await page.goto("/playground");
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.type('<?php\n$total = 10;\necho $Total;\n');
  await page.getByRole("button", { name: /^Run$/ }).click();
  await expect(page.getByRole("tab", { name: /Problems/ })).toHaveAttribute("aria-selected", "true", { timeout: 30_000 });
  await expect(page.getByText("Undefined variable $Total").first()).toBeVisible();
  await expect(page.getByText("What it means:")).toBeVisible();
  await page.getByRole("tab", { name: /Trace/ }).click();
  await expect(page.getByText(/Step 1 · line 2/)).toBeVisible();
});

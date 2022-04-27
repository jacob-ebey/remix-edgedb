import type { Page } from "@playwright/test";

export async function signup(page: Page) {
  const username = `test-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  const password = "12345678";

  await page.goto("/signup");
  await page.fill("#username", username);
  await page.fill("#password", username);
  await page.fill("#verifyPassword", username);
  await page.click("#signup");
  await page.waitForLoadState("networkidle");

  return { username, password };
}

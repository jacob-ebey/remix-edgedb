import { test, expect } from "@playwright/test";

import { signup } from "./utils";

test.beforeEach(async ({ page }) => {
  await signup(page);
  await page.goto("/tasks/");
});

test.describe("Tasks", () => {
  test("should allow me to create update and delete tasks", async ({
    page,
  }) => {
    await page.fill("#text", "Buy milk");
    await page.click("#create");
    await page.waitForSelector("text=Buy milk");

    const taskForm = await page.locator("form", {
      has: page.locator("text=Buy milk"),
    });
    const setCompletedButton = await taskForm.locator(
      "button[value=set-completed]"
    );
    expect(setCompletedButton).toHaveText("😑");

    await setCompletedButton.click();
    await page.waitForLoadState("networkidle");
    expect(setCompletedButton).toHaveText("😍");

    await setCompletedButton.click();
    await page.waitForLoadState("networkidle");
    expect(setCompletedButton).toHaveText("😑");

    await taskForm.locator("button[value=delete]").click();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("text=Buy milk", { state: "detached" });
  });
});

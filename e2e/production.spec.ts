import { expect, test } from "@playwright/test";

test("authenticates and runs the retrieval evaluator", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "ENTER DEMO LAB" }).click();
  await expect(page.getByRole("button", { name: "SAVE QUERY" })).toBeVisible();
  await page.getByRole("button", { name: "RUN DIAGNOSTIC" }).click();
  await expect(page.getByText(/match rank 1/).first()).toBeVisible();
  await expect(page.getByText("1.000", { exact: true })).toBeVisible();
});

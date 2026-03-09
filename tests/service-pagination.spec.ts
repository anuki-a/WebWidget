import { test, expect } from "@playwright/test";
import { ServiceSelectionPage } from "./pages";

test.describe("Appointment Widget", () => {
  test(
    "Select a service from paginated list",
    { tag: ["@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);

      await servicePage.goto();

      await expect(servicePage.personalAccountsButton).toBeVisible();
      await expect(servicePage.businessAccountsButton).toBeVisible();
      await expect(servicePage.estateAccountsButton).toBeVisible();

      await servicePage.selectCategory("Speak with a Department");

      await servicePage.selectServiceByPattern(/Mins/);

      await expect(
        page
          .getByRole("button", { name: "No, continue with scheduling" })
          .or(page.getByRole("heading", { name: "Select a Location" })),
      ).toBeVisible();
    },
  );
});

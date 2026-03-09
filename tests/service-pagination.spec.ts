import { test, expect } from "@playwright/test";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Service pagination / dynamic list
  test(
    "Select a service from paginated list",
    { tag: ["@functional"] },
    async ({ page }) => {
      // Navigate to service selection
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      // Verify multiple service categories are available
      await expect(
        page.getByRole("button", { name: "Personal Accounts" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Business and Specialized Accounts" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Estate Accounts" }),
      ).toBeVisible();

      // Select a service from different category
      await page
        .getByRole("button", { name: "Speak with a Department" })
        .click();

      // Wait for and verify services
      const serviceLinks = page.getByRole("link").filter({ hasText: /Mins/ });
      await expect(async () => {
        expect(await serviceLinks.count()).toBeGreaterThan(0);
      }).toPass();

      // Select the first available service
      await serviceLinks.first().click();

      // Verify we proceed to the next step (should handle the online dialog or location selection)
      await expect(
        page
          .getByRole("button", { name: "No, continue with scheduling" })
          .or(page.getByRole("heading", { name: "Select a Location" })),
      ).toBeVisible();
    },
  );
});

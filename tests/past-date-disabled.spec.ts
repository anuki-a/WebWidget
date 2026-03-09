import { test, expect } from "@playwright/test";
import { getDateLocator, getWorkingDay } from "./utils/date-helpers";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Calendar edge-case - past date
  test(
    "Prevent selection of past dates in calendar",
    { tag: ["@negative", "@functional"] },
    async ({ page }) => {
      // Navigate to service selection
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      // Select service
      await page.getByRole("button", { name: "Personal Accounts" }).click();
      await page
        .getByRole("link", { name: "Update Personal Account  60" })
        .click();
      await page
        .getByRole("button", { name: "No, continue with scheduling" })
        .click();

      // Select location
      await page
        .getByRole("button", { name: "McKinney 2093 N. Central" })
        .click();

      // Select meeting preference
      await page.getByRole("button", { name: "Meet in Person" }).click();

      // 2. Verify Past Working Days are Disabled (checking last 2)
      for (const offset of [1, 2]) {
        const pastDate = getWorkingDay(offset, "Past");
        await expect(getDateLocator(page, pastDate)).toBeDisabled();
      }

      // 3. Verify Future Working Days are Enabled (checking next 2)
      for (const offset of [1, 2]) {
        const futureDate = getWorkingDay(offset, "Future");
        await expect(getDateLocator(page, futureDate)).toBeEnabled();
      }
    },
  );
});

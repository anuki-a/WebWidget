import { test, expect } from "@playwright/test";
import { getDateLocator, getWorkingDay } from "./utils/date-helpers";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  test(
    "Display validation errors for missing required fields",
    { tag: ["@negative", "@functional"] },
    async ({ page }) => {
      // 1. Navigate
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      // 2. Select service (Dynamic verify & select)
      await page.getByRole("button", { name: "Personal Accounts" }).click();

      const serviceLinks = page.getByRole("link").filter({ hasText: /Mins/ });
      await expect(async () => {
        expect(await serviceLinks.count()).toBeGreaterThan(0);
      }).toPass();

      await serviceLinks.first().click();

      await page
        .getByRole("button", { name: "No, continue with scheduling" })
        .click();

      // 3. Select location
      await page
        .getByRole("button", { name: "McKinney 2093 N. Central" })
        .click();

      // 4. Select meeting preference
      await page.getByRole("button", { name: "Meet in Person" }).click();

      // 5. Select dynamic future working date (e.g., 2 working days from now)
      const futureDate = getWorkingDay(2, "Future");
      await getDateLocator(page, futureDate).click();

      // Select any available time slot
      await page.getByRole("button", { name: /AM|PM/ }).first().click();

      // 6. Verify Personal Details page
      await expect(
        page.getByRole("heading", { name: "Personal Details" }),
      ).toBeVisible();

      // 7. Attempt to submit without required fields
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // 8. Verify validation errors
      await expect(page.locator("text=First Name is required")).toBeVisible();
      await expect(page.locator("text=Last Name is required")).toBeVisible();

      // 9. Verify the form is still on the same page
      await expect(
        page.getByRole("button", { name: "Book My Appointment" }),
      ).toBeVisible();
    },
  );
});

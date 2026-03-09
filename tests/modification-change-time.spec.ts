import { test, expect } from "@playwright/test";
import { getDateLocator, getWorkingDay } from "./utils/date-helpers";

test.describe("Appointment Widget", () => {
  test(
    "Modify appointment time after booking",
    { tag: ["@smoke", "@functional"] },
    async ({ page }) => {
      // 1. Initial Setup and Navigation
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      await page.getByRole("button", { name: "Personal Accounts" }).click();
      await page
        .getByRole("link", { name: "Update Personal Account  60" })
        .click();
      await page
        .getByRole("button", { name: "No, continue with scheduling" })
        .click();
      await page
        .getByRole("button", { name: "McKinney 2093 N. Central" })
        .click();
      await page.getByRole("button", { name: "Meet in Person" }).click();

      // 2. Select First Working Date (e.g., 3 working days in the future)
      const initialDate = getWorkingDay(3, "Future");
      await getDateLocator(page, initialDate).click();

      // Define time slot locator (re-usable)
      const getTimeSlot = () =>
        page
          .locator("div, span, a, button")
          .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ })
          .filter({
            hasNot: page.locator(".disabled, [disabled], .grayed-out"),
          })
          .first();

      await expect(getTimeSlot()).toBeVisible();
      await getTimeSlot().click();

      // 3. Fill customer details and Book
      await page.getByRole("textbox", { name: "First Name *" }).fill("Jane");
      await page.getByRole("textbox", { name: "Last Name *" }).fill("Doe");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("jane.doe@example.com");
      await page
        .getByRole("textbox", { name: "Phone No." })
        .fill("555-987-6543");
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // 4. Verify initial booking success
      await expect(
        page.getByRole("heading", { name: /appointment has been scheduled/i }),
      ).toBeVisible({ timeout: 20000 });

      // 5. Modification Flow
      await page.getByRole("link", { name: "Edit Date and Time" }).click();

      // Select a different working date (e.g., 2 working days in the future)
      const newDate = getWorkingDay(2, "Future");
      await getDateLocator(page, newDate).click();

      // IMPORTANT: Wait for the UI to refresh the time slots for the new date
      // This prevents capturing the time from the 'previous' date selection
      await page.waitForTimeout(10000);

      // Select a new time and capture it for verification
      await expect(getTimeSlot()).toBeVisible();
      const newSelectedTime = (await getTimeSlot().innerText()).trim();
      await getTimeSlot().click();

      // 6. Submit modification
      await expect(
        page.getByRole("textbox", { name: "First Name *" }),
      ).toHaveValue("Jane");

      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Check if the "Already created an appointment" popup appears
      const duplicatePopup = page.getByText(
        /You have already booked appointment*/i,
      );
      const continueButton = page.getByRole("button", { name: /YES/ });

      // Using a short timeout for the popup check to keep the test fast
      if (await duplicatePopup.isVisible({ timeout: 5000 })) {
        await continueButton.click();
      }

      // 7. Final Verification
      await expect(
        page.getByRole("heading", { name: /appointment has been scheduled/i }),
      ).toBeVisible({ timeout: 20000 });

      const fullDateString = newDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Verify the new date and time are reflected in the confirmation text
      await expect(page.locator("text=McKinney")).toBeVisible();
      await expect(page.locator(`text=${fullDateString}`)).toBeVisible();
      await expect(page.locator(`text=${newSelectedTime}`)).toBeVisible();
    },
  );
});

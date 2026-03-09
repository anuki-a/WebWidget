import { test, expect } from "@playwright/test";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Invalid email format
  test(
    "Prevent booking with invalid email format",
    { tag: ["@smoke", "@functional"] },
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

      // Select the first available location
      const locationButtons = page
        .getByRole("button")
        .filter({ hasText: /CUSO|Live Oak|Windcrest|McKinney/ });
      const firstLocation = locationButtons.first();
      await expect(firstLocation).toBeVisible();
      await firstLocation.click();

      // Select meeting preference
      await page.getByRole("button", { name: "Meet in Person" }).click();

      // --- DYNAMIC DATE LOGIC ---
      // Create the dynamic date (today)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate());

      // For Clicking: "Mar 5," and "5"
      const shortMonth = targetDate.toLocaleString("default", {
        month: "short",
      });
      const dayNum = targetDate.getDate();
      const datePickerLabel = `${shortMonth} ${dayNum},`;

      // Select today's date
      await page
        .getByLabel(datePickerLabel)
        .getByRole("link", { name: dayNum.toString(), exact: true })
        .click();

      let selectedTime = "";
      await expect(async () => {
        const availableTimeLocator = page
          .locator("div, span, a, button")
          .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ })
          .filter({
            hasNot: page.locator(".disabled, [disabled], .grayed-out"),
          })
          .first();
        await expect(availableTimeLocator).toBeVisible({ timeout: 5000 });
        selectedTime = (await availableTimeLocator.innerText()).trim();
        await availableTimeLocator.click();
      }).toPass({
        timeout: 120000,
      });
      // --- END OF DYNAMIC DATE LOGIC ---

      // Fill in personal details with an invalid email
      await page.getByRole("textbox", { name: "First Name *" }).fill("John");
      await page.getByRole("textbox", { name: "Last Name *" }).fill("Doe");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("invalid-email-format");
      await page
        .getByRole("textbox", { name: "Phone No." })
        .fill("555-123-4567");

      // Attempt to submit
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Verify email validation error is shown
      // Note: The app may show an error or prevent submission - check for typical email error messages
      await expect(page.getByText("Email is invalid")).toBeVisible({
        timeout: 10000,
      });
    },
  );
});

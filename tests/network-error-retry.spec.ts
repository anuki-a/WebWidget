import { test, expect } from "@playwright/test";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Network error / retry
  test(
    "Recover from network error and retry form submission",
    { tag: ["@negative"] },
    async ({ page, context }) => {
      // Navigate to service selection
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      // Navigate through booking flow
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
      // --- DYNAMIC DATE LOGIC ---
      // Create the dynamic date (today)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 4);
      const shortMonth = targetDate.toLocaleString("default", {
        month: "short",
      });
      const dayNum = targetDate.getDate();
      const datePickerLabel = `${shortMonth} ${dayNum},`;

      // Select Date
      await page
        .getByLabel(datePickerLabel)
        .getByRole("link", { name: dayNum.toString(), exact: true })
        .click();

      // Select Time
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

      // Fill in customer details
      await page.getByRole("textbox", { name: "First Name *" }).fill("John");
      await page.getByRole("textbox", { name: "Last Name *" }).fill("Smith");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("john.smith@example.com");
      await page
        .getByRole("textbox", { name: "Phone No." })
        .fill("512-666-7777");

      // Simulate network offline condition
      await context.setOffline(true);

      // Attempt to submit form
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Expect error notification or page to remain on form
      await page.waitForTimeout(2000); // Wait a moment for any error to appear

      // Restore network connectivity
      await context.setOffline(false);

      // Retry the submission
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Verify the booking was successful after retry
      // Either confirmation page or success message should appear
      await expect(
        page
          .locator("text=/success|confirmation|scheduled/i")
          .or(page.getByRole("heading", { name: /scheduled|confirmation/ })),
      ).toBeVisible({ timeout: 10000 });
    },
  );
});

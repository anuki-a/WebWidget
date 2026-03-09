import { test, expect } from "@playwright/test";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Modification - cancel appointment
  test(
    "Cancel appointment after booking",
    { tag: ["@functional"] },
    async ({ page }) => {
      // Complete initial booking
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

      // Select the first available location
      const locationButton = page.getByRole("button", {
        name: "McKinney 2093 N. Central",
      });
      await expect(locationButton).toBeVisible();
      await locationButton.click();

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

      // Fill in customer details
      await page.getByRole("textbox", { name: "First Name *" }).fill("John");
      await page.getByRole("textbox", { name: "Last Name *" }).fill("Smith");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("john.smith@example.com");
      await page
        .getByRole("textbox", { name: "Phone No." })
        .fill("512-666-7777");
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Verify confirmation page with retry/wait pattern
      await expect(async () => {
        await expect(
          page.getByRole("heading", {
            name: /.*appointment has been scheduled/,
          }),
        ).toBeVisible({ timeout: 10000 });
      }).toPass({ timeout: 220000 });

      // Click Cancel Appointment button
      await page.getByRole("button", { name: "Cancel Appointment" }).click();

      // Verify 1: confirmation dialog appears
      await expect(page.getByText("Appointment Cancellation")).toBeVisible({
        timeout: 10000,
      });
      await page.getByRole("button", { name: "YES" }).click();

      // Verify 2:  cancellation confirmation appears
      await expect(
        page.getByText(
          "This appointment has been cancelled. Do you want to book another?",
        ),
      ).toBeVisible({
        timeout: 10000,
      });

      // Verify 3: Clicking BOOK ANOTHER returns to service selection
      await page.getByRole("button", { name: "BOOK ANOTHER" }).click();
      await expect(
        page.getByRole("button", { name: "Personal Accounts" }),
      ).toBeVisible();
    },
  );
});

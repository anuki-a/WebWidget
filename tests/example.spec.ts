import { test, expect } from "@playwright/test";

// FEATURE: Appointment Widget
test.describe("Appointment Widget", () => {
  // Scenario: Happy-path booking
  test(
    "Complete booking with valid customer details",
    { tag: ["@smoke", "@functional"] },
    async ({ page }) => {
      // Navigate to the service widget
      await page.goto(
        "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768",
      );

      // Verify service categories are visible
      await expect(
        page.getByRole("button", { name: "Personal Accounts" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Speak with a Department" }),
      ).toBeVisible();

      // Select a service category and service
      await page.getByRole("button", { name: "Personal Accounts" }).click();
      const firstService = page.getByRole("link", {
        name: "Update Personal Account  60",
      });
      await firstService.click();

      // Handle the online application dialog
      await page
        .getByRole("button", { name: "No, continue with scheduling" })
        .click();

      // Select the first available location
      const locationButton = page.getByRole("button", {
        name: "McKinney 2093 N. Central",
      });
      await expect(locationButton).toBeVisible();
      await locationButton.click();

      // Select a meeting preference
      await page.getByRole("button", { name: "Meet in Person" }).click();

      // --- DYNAMIC DATE LOGIC ---
      //const randomDaysAhead = Math.floor(Math.random() * 7);

      // 2. Create the dynamic date
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate());

      // For Clicking: "Mar 5," and "5"
      const shortMonth = targetDate.toLocaleString("default", {
        month: "short",
      });
      const dayNum = targetDate.getDate();
      const datePickerLabel = `${shortMonth} ${dayNum},`;

      // For Assertion: "Thursday, March 5, 2026"
      const fullDateString = targetDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // 2. Select today's date
      await page
        .getByLabel(datePickerLabel)
        .getByRole("link", { name: dayNum.toString(), exact: true })
        .click();

      let selectedTime = "";
      await expect(async () => {
        // this await block retried if it fails. (the feature has a loader which sometimes takes a while to load )
        const availableTimeLocator = page
          .locator("div, span, a, button") // Check all common clickable tags
          .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ }) // Matches exact time format like "6:15 AM"
          .filter({
            hasNot: page.locator(".disabled, [disabled], .grayed-out"),
          }) // Exclude typical disabled classes
          .first();
        await expect(availableTimeLocator).toBeVisible({ timeout: 5000 });
        selectedTime = (await availableTimeLocator.innerText()).trim();
        await availableTimeLocator.click();
      }).toPass({
        timeout: 120000, // Total time to keep trying (2 minute)
      });
      // --- END OF DYNAMIC DATE LOGIC ---

      // Enter valid customer details
      await page.getByRole("textbox", { name: "First Name *" }).fill("Ronha");
      await page.getByRole("textbox", { name: "Last Name *" }).fill("Smith");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("ronha.smith@example.com");
      await page
        .getByRole("textbox", { name: "Phone No." })
        .fill("512-555-9876");

      // Submit the booking form
      await page.getByRole("button", { name: "Book My Appointment" }).click();

      // Verify confirmation page with booking details
      await expect(async () => {
        await expect(
          page.getByRole("heading", {
            name: /.*appointment has been scheduled/,
          }),
        ).toBeVisible({ timeout: 10000 }); // Wait up to 10 seconds for the confirmation heading to appear rerun the check if it fails
      }).toPass({ timeout: 220000 }); // Wait up to 120 seconds for the confirmation to appear (because this step has a loader which takes some time to finish loading))

      const expectedConfirmationText = `${fullDateString} at ${selectedTime}`;
      await expect(page.locator("text=McKinney")).toBeVisible();
      await expect(
        page.locator(`text=${expectedConfirmationText}`),
      ).toBeVisible();
      await expect(page.locator("text=Update Personal Account")).toBeVisible();
      await expect(page.locator("text=ronha.smith@example.com")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Cancel Appointment" }),
      ).toBeVisible();
    },
  );
});

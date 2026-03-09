import { test, expect } from "@playwright/test";
import {
  ServiceSelectionPage,
  LocationPage,
  MeetingPreferencePage,
  DateTimePage,
  PersonalDetailsPage,
} from "./pages";

test.describe("Appointment Widget", () => {
  test(
    "Recover from network error and retry form submission",
    { tag: ["@negative"] },
    async ({ page, context }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);

      await servicePage.goto();
      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectService("Update Personal Account  60");
      await servicePage.continueWithScheduling();

      await locationPage.selectLocation("McKinney 2093 N. Central");

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectWorkingDay(4, "Future");
      await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.fillPersonalDetails({
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "512-666-7777",
      });

      await context.setOffline(true);

      await personalDetailsPage.submitBooking();

      await page.waitForTimeout(2000);

      await context.setOffline(false);

      await personalDetailsPage.submitBooking();

      await expect(
        page
          .locator("text=/success|confirmation|scheduled/i")
          .or(page.getByRole("heading", { name: /scheduled|confirmation/ })),
      ).toBeVisible({ timeout: 10000 });
    },
  );
});

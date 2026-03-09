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
    "Display validation errors for missing required fields",
    { tag: ["@negative", "@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);

      await servicePage.goto();
      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectServiceByPattern(/Mins/);
      await servicePage.continueWithScheduling();

      await locationPage.selectLocation("McKinney 2093 N. Central");

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectWorkingDay(2, "Future");
      await page.getByRole("button", { name: /AM|PM/ }).first().click();

      await personalDetailsPage.verifyPageVisible();

      await personalDetailsPage.submitBooking();

      await personalDetailsPage.verifyValidationError("First Name is required");
      await personalDetailsPage.verifyValidationError("Last Name is required");

      await personalDetailsPage.verifyFormStillVisible();
    },
  );
});

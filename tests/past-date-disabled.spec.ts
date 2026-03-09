import { test, expect } from "@playwright/test";
import {
  ServiceSelectionPage,
  LocationPage,
  MeetingPreferencePage,
  DateTimePage,
} from "./pages";

test.describe("Appointment Widget", () => {
  test(
    "Prevent selection of past dates in calendar",
    { tag: ["@negative", "@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);

      await servicePage.goto();
      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectService("Update Personal Account  60");
      await servicePage.continueWithScheduling();

      await locationPage.selectLocation("McKinney 2093 N. Central");

      await meetingPage.selectMeetInPerson();

      await dateTimePage.verifyPastDatesDisabled([1, 2]);
      await dateTimePage.verifyFutureDatesEnabled([1, 2]);
    },
  );
});

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
    "Prevent booking with invalid email format",
    { tag: ["@smoke", "@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);

      await servicePage.goto();
      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectService("Update Personal Account  60");
      await servicePage.continueWithScheduling();

      await locationPage.selectFirstAvailableLocation();

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectToday();
      await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.fillAndSubmit({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email-format",
        phone: "555-123-4567",
      });

      await expect(page.getByText("Email is invalid")).toBeVisible({
        timeout: 10000,
      });
    },
  );
});

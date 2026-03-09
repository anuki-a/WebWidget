import { test, expect } from "@playwright/test";
import { getWorkingDay } from "./utils/date-helpers";
import {
  ServiceSelectionPage,
  LocationPage,
  MeetingPreferencePage,
  DateTimePage,
  PersonalDetailsPage,
  ConfirmationPage,
} from "./pages";

test.describe("Appointment Widget", () => {
  test(
    "Modify appointment time after booking",
    { tag: ["@smoke", "@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);
      const confirmationPage = new ConfirmationPage(page);

      await servicePage.goto();
      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectService("Update Personal Account  60");
      await servicePage.continueWithScheduling();

      await locationPage.selectLocation("McKinney 2093 N. Central");

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectWorkingDay(3, "Future");
      await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.fillAndSubmit({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        phone: "555-987-6543",
      });

      await expect(confirmationPage.confirmationHeading).toBeVisible({
        timeout: 20000,
      });

      await confirmationPage.editDateTime();

      const newDate = getWorkingDay(2, "Future");
      await dateTimePage.selectDate(newDate);

      await dateTimePage.waitForTimeSlotsToLoad(10000);

      const newSelectedTime = await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.verifyFieldValue("firstName", "Jane");

      await personalDetailsPage.submitBooking();

      await confirmationPage.handleDuplicateAppointmentPopup();

      await expect(confirmationPage.confirmationHeading).toBeVisible({
        timeout: 20000,
      });

      const fullDateString = newDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      await expect(page.locator("text=McKinney")).toBeVisible();
      await expect(page.locator(`text=${fullDateString}`)).toBeVisible();
      await expect(page.locator(`text=${newSelectedTime}`)).toBeVisible();
    },
  );
});

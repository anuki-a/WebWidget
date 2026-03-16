import { test, expect } from "@playwright/test";
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
    "Complete booking with valid customer details",
    { tag: ["@smoke", "@functional"] },
    async ({ page }) => {
      const servicePage = new ServiceSelectionPage(page);
      const locationPage = new LocationPage(page);
      const meetingPage = new MeetingPreferencePage(page);
      const dateTimePage = new DateTimePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);
      const confirmationPage = new ConfirmationPage(page);

      await servicePage.goto();
      await servicePage.verifyServiceCategoriesVisible();

      await servicePage.selectCategory("Personal Accounts");
      await servicePage.selectService("Update Personal Account  60");
      await servicePage.continueWithScheduling();

      await locationPage.searchSelectLocation(
        "75071",
        "McKinney 2093 N. Central",
      );

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectToday();
      const selectedTime = await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.fillAndSubmit({
        firstName: "Ronha",
        lastName: "Smith",
        email: "ronha.smith@example.com",
        phone: "512-555-9876",
      });

      await confirmationPage.handleDuplicateAppointmentPopup();

      await confirmationPage.verifyConfirmation();

      const targetDate = new Date();
      const fullDateString = targetDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      await confirmationPage.verifyAppointmentDetails({
        location: "McKinney",
        service: "Update Personal Account",
        email: "ronha.smith@example.com",
        dateTime: `${fullDateString} at ${selectedTime}`,
      });

      await expect(confirmationPage.cancelAppointmentButton).toBeVisible();
    },
  );
});

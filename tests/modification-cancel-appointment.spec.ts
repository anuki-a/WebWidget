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
    "Cancel appointment after booking",
    { tag: ["@functional"] },
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

      await locationPage.searchSelectLocation(
        "75071",
        "McKinney 2093 N. Central",
      );

      await meetingPage.selectMeetInPerson();

      await dateTimePage.selectToday();
      await dateTimePage.selectFirstAvailableTime();

      await personalDetailsPage.fillAndSubmit({
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "512-666-7777",
      });

      await confirmationPage.verifyConfirmation();

      await confirmationPage.cancelAppointment();

      await confirmationPage.handleCancellationConfirmationPopup();

      await confirmationPage.verifyCancellationConfirmation();

      await confirmationPage.bookAnother();
      await expect(servicePage.personalAccountsButton).toBeVisible();
    },
  );
});

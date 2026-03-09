import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class ConfirmationPage extends BasePage {
  readonly confirmationHeading: Locator;
  readonly cancelAppointmentButton: Locator;
  readonly editDateTimeLink: Locator;
  readonly bookAnotherButton: Locator;
  readonly cancellationDialog: Locator;
  readonly confirmCancellationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.getByRole("heading", {
      name: /.*appointment has been scheduled/,
    });
    this.cancelAppointmentButton = page.getByRole("button", {
      name: "Cancel Appointment",
    });
    this.editDateTimeLink = page.getByRole("link", {
      name: "Edit Date and Time",
    });
    this.bookAnotherButton = page.getByRole("button", { name: "BOOK ANOTHER" });
    this.cancellationDialog = page.getByText("Appointment Cancellation");
    this.confirmCancellationButton = page.getByRole("button", { name: "YES" });
  }

  async verifyConfirmation(timeout: number = 220000) {
    await expect(async () => {
      await expect(this.confirmationHeading).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout });
  }

  async verifyAppointmentDetails(details: {
    location?: string;
    service?: string;
    email?: string;
    dateTime?: string;
  }) {
    if (details.location) {
      await this.waitForElement(this.page.locator(`text=${details.location}`));
    }
    if (details.service) {
      await this.waitForElement(this.page.locator(`text=${details.service}`));
    }
    if (details.email) {
      await this.waitForElement(this.page.locator(`text=${details.email}`));
    }
    if (details.dateTime) {
      await this.waitForElement(this.page.locator(`text=${details.dateTime}`));
    }
  }

  async cancelAppointment() {
    await this.cancelAppointmentButton.click();
    await this.waitForElement(this.cancellationDialog);
    await this.confirmCancellationButton.click();
  }

  async verifyCancellationConfirmation() {
    const cancellationMessage = this.page.getByText(
      "This appointment has been cancelled. Do you want to book another?",
    );
    await this.waitForElement(cancellationMessage);
  }

  async bookAnother() {
    await this.bookAnotherButton.click();
  }

  async editDateTime() {
    await this.editDateTimeLink.click();
  }

  async handleDuplicateAppointmentPopup() {
    const duplicatePopup = this.page.getByText(
      /You have already booked appointment/i,
    );
    const continueButton = this.page.getByRole("button", { name: "Yes" });

    if (await this.isVisible(duplicatePopup, 3000)) {
      await continueButton.click();
    }
  }
}

import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class PersonalDetailsPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly bookAppointmentButton: Locator;
  readonly personalDetailsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByRole("textbox", { name: "First Name *" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name *" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.phoneInput = page.getByRole("textbox", { name: "Phone No." });
    this.bookAppointmentButton = page.getByRole("button", {
      name: "Book My Appointment",
    });
    this.personalDetailsHeading = page.getByRole("heading", {
      name: "Personal Details",
    });
  }

  async fillPersonalDetails(details: CustomerDetails) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async submitBooking() {
    await this.bookAppointmentButton.click();
  }

  async fillAndSubmit(details: CustomerDetails) {
    await this.fillPersonalDetails(details);
    await this.submitBooking();
  }

  async verifyPageVisible() {
    await this.waitForElement(this.personalDetailsHeading);
  }

  async verifyValidationError(errorMessage: string) {
    const errorLocator = this.page.locator(`text=${errorMessage}`);
    await this.waitForElement(errorLocator);
  }

  async verifyFormStillVisible() {
    await this.waitForElement(this.bookAppointmentButton);
  }

  async verifyFieldValue(field: "firstName" | "lastName" | "email" | "phone", expectedValue: string) {
    const fieldMap = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      email: this.emailInput,
      phone: this.phoneInput,
    };
    await expect(fieldMap[field]).toHaveValue(expectedValue);
  }
}

import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class ServiceSelectionPage extends BasePage {
  readonly personalAccountsButton: Locator;
  readonly businessAccountsButton: Locator;
  readonly estateAccountsButton: Locator;
  readonly speakWithDepartmentButton: Locator;
  readonly continueSchedulingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.personalAccountsButton = page.getByRole("button", {
      name: "Personal Accounts",
    });
    this.businessAccountsButton = page.getByRole("button", {
      name: "Business and Specialized Accounts",
    });
    this.estateAccountsButton = page.getByRole("button", {
      name: "Estate Accounts",
    });
    this.speakWithDepartmentButton = page.getByRole("button", {
      name: "Speak with a Department",
    });
    this.continueSchedulingButton = page.getByRole("button", {
      name: "No, continue with scheduling",
    });
  }

  async selectCategory(categoryName: string) {
    await this.page.getByRole("button", { name: categoryName }).click();
  }

  async selectService(serviceName: string) {
    const serviceLink = this.page.getByRole("link", { name: serviceName });
    await serviceLink.click();
  }

  async selectServiceByPattern(pattern: RegExp) {
    const serviceLinks = this.page.getByRole("link").filter({ hasText: pattern });
    await expect(async () => {
      const count = await serviceLinks.count();
      if (count === 0) throw new Error("No services found");
    }).toPass({ timeout: 120000 });
    await serviceLinks.first().click();
  }

  async continueWithScheduling() {
    await this.continueSchedulingButton.click();
  }

  async verifyServiceCategoriesVisible() {
    await this.waitForElement(this.personalAccountsButton);
    await this.waitForElement(this.speakWithDepartmentButton);
  }
}

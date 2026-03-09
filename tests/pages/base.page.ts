import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl =
      "https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768";
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async waitForElement(locator: Locator, timeout: number = 10000) {
    await expect(locator).toBeVisible({ timeout });
  }

  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }
}

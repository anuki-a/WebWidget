import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class LocationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectLocation(locationName: string) {
    const locationButton = this.page.getByRole("button", { name: locationName });
    await this.waitForElement(locationButton);
    await locationButton.click();
  }

  async selectFirstAvailableLocation() {
    const locationButtons = this.page
      .getByRole("button")
      .filter({ hasText: /CUSO|Live Oak|Windcrest|McKinney/ });
    const firstLocation = locationButtons.first();
    await this.waitForElement(firstLocation);
    await firstLocation.click();
  }

  async selectLocationByPattern(pattern: RegExp) {
    const locationButtons = this.page.getByRole("button").filter({ hasText: pattern });
    const firstLocation = locationButtons.first();
    await this.waitForElement(firstLocation);
    await firstLocation.click();
  }
}

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class LocationPage extends BasePage {
  private readonly searchTextbox: Locator;

  constructor(page: Page) {
    super(page);
    this.searchTextbox = this.page.getByRole("textbox", {
      name: "Enter city and state, or ZIP",
    });
  }

  async searchSelectLocation(locationCode: string, locationName: string) {
    await this.searchTextbox.click();
    await this.searchTextbox.fill(locationCode);
    await this.searchTextbox.press("Enter");

    const locationButton = this.page.getByRole("button", {
      name: locationName,
    });
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
    const locationButtons = this.page
      .getByRole("button")
      .filter({ hasText: pattern });
    const firstLocation = locationButtons.first();
    await this.waitForElement(firstLocation);
    await firstLocation.click();
  }
}

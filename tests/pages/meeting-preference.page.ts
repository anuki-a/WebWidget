import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class MeetingPreferencePage extends BasePage {
  readonly meetInPersonButton: Locator;
  readonly virtualMeetingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.meetInPersonButton = page.getByRole("button", { name: "Meet in Person" });
    this.virtualMeetingButton = page.getByRole("button", { name: "Virtual" });
  }

  async selectMeetingPreference(preference: string) {
    await this.page.getByRole("button", { name: preference }).click();
  }

  async selectMeetInPerson() {
    await this.meetInPersonButton.click();
  }

  async selectVirtual() {
    await this.virtualMeetingButton.click();
  }
}

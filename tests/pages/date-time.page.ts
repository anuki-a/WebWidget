import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { getDateLocator, getWorkingDay, DateDirection } from "../utils/date-helpers";

export class DateTimePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectDate(dateObj: Date) {
    const dateLocator = getDateLocator(this.page, dateObj);
    await dateLocator.click();
  }

  async selectWorkingDay(count: number, direction: DateDirection) {
    const workingDate = getWorkingDay(count, direction);
    await this.selectDate(workingDate);
  }

  async selectToday() {
    const today = new Date();
    await this.selectDate(today);
  }

  private getTimeSlotLocator(): Locator {
    return this.page
      .locator("div, span, a, button")
      .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ })
      .filter({
        hasNot: this.page.locator(".disabled, [disabled], .grayed-out"),
      })
      .first();
  }

  async selectFirstAvailableTime(): Promise<string> {
    let selectedTime = "";
    await expect(async () => {
      const timeSlot = this.getTimeSlotLocator();
      await expect(timeSlot).toBeVisible({ timeout: 5000 });
      selectedTime = (await timeSlot.innerText()).trim();
      await timeSlot.click();
    }).toPass({
      timeout: 120000,
    });
    return selectedTime;
  }

  async selectTime(time: string) {
    const timeButton = this.page.getByRole("button", { name: time });
    await timeButton.click();
  }

  async waitForTimeSlotsToLoad(waitMs: number = 10000) {
    await this.page.waitForTimeout(waitMs);
  }

  async verifyPastDatesDisabled(daysToCheck: number[] = [1, 2]) {
    for (const offset of daysToCheck) {
      const pastDate = getWorkingDay(offset, "Past");
      const dateLocator = getDateLocator(this.page, pastDate);
      await expect(dateLocator).toBeDisabled();
    }
  }

  async verifyFutureDatesEnabled(daysToCheck: number[] = [1, 2]) {
    for (const offset of daysToCheck) {
      const futureDate = getWorkingDay(offset, "Future");
      const dateLocator = getDateLocator(this.page, futureDate);
      await expect(dateLocator).toBeEnabled();
    }
  }
}

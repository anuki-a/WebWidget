import { Page, Locator } from "@playwright/test";

export type DateDirection = "Past" | "Future";

/**
 * Calculates a working date (skipping Sat/Sun).
 */
export function getWorkingDay(count: number, direction: DateDirection): Date {
  const date = new Date();
  let foundDays = 0;
  const modifier = direction === "Past" ? -1 : 1;

  while (foundDays < count) {
    date.setDate(date.getDate() + modifier);
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      foundDays++;
    }
  }
  return date;
}

/**
 * Returns the Playwright locator for a specific calendar date link.
 */
export function getDateLocator(page: Page, dateObj: Date): Locator {
  const monthStr = dateObj.toLocaleString("default", { month: "short" });
  const dayStr = dateObj.getDate().toString();

  // Target label: "Mar 6," and Role: "link", Name: "6"
  return page
    .getByLabel(`${monthStr} ${dayStr},`)
    .getByRole("link", { name: dayStr, exact: true });
}

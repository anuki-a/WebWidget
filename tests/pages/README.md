# Page Object Model (POM) Documentation

This directory contains Page Object classes for the Appointment Widget test automation framework.

## Overview

The Page Object Model is a design pattern that creates an object repository for web UI elements. Each page/component of the application has a corresponding Page Object class that encapsulates the locators and methods for interacting with that page.

## Benefits

- **Maintainability**: UI changes require updates in only one place
- **Reusability**: Page methods can be shared across multiple tests
- **Readability**: Tests read like user stories, not technical implementations
- **Type Safety**: TypeScript interfaces provide better IDE support and compile-time checks

## Page Object Classes

### BasePage (`base.page.ts`)

Base class that all page objects inherit from. Provides common functionality:

- `goto()` - Navigate to the base URL
- `waitForElement()` - Wait for an element to be visible
- `isVisible()` - Check if an element is visible

### ServiceSelectionPage (`service-selection.page.ts`)

Handles service category and service selection.

**Key Locators:**

- `personalAccountsButton`
- `businessAccountsButton`
- `estateAccountsButton`
- `speakWithDepartmentButton`
- `continueSchedulingButton`

**Methods:**

- `selectCategory(categoryName: string)` - Select a service category
- `selectService(serviceName: string)` - Select a specific service
- `selectServiceByPattern(pattern: RegExp)` - Select service matching a pattern
- `continueWithScheduling()` - Click continue scheduling button
- `verifyServiceCategoriesVisible()` - Verify service categories are displayed

### LocationPage (`location.page.ts`)

Handles location selection.

**Methods:**

- `selectLocation(locationName: string)` - Select a specific location
- `selectFirstAvailableLocation()` - Select the first available location
- `selectLocationByPattern(pattern: RegExp)` - Select location matching a pattern

### MeetingPreferencePage (`meeting-preference.page.ts`)

Handles meeting preference selection.

**Key Locators:**

- `meetInPersonButton`
- `virtualMeetingButton`

**Methods:**

- `selectMeetingPreference(preference: string)` - Select meeting preference by name
- `selectMeetInPerson()` - Select in-person meeting
- `selectVirtual()` - Select virtual meeting

### DateTimePage (`date-time.page.ts`)

Handles date and time selection with dynamic date logic.

**Methods:**

- `selectDate(dateObj: Date)` - Select a specific date
- `selectWorkingDay(count: number, direction: DateDirection)` - Select working day relative to today
- `selectToday()` - Select today's date
- `selectFirstAvailableTime()` - Select first available time slot (returns selected time)
- `selectTime(time: string)` - Select specific time
- `waitForTimeSlotsToLoad(waitMs: number)` - Wait for time slots to refresh
- `verifyPastDatesDisabled(daysToCheck: number[])` - Verify past dates are disabled
- `verifyFutureDatesEnabled(daysToCheck: number[])` - Verify future dates are enabled

### PersonalDetailsPage (`personal-details.page.ts`)

Handles customer information form.

**Key Locators:**

- `firstNameInput`
- `lastNameInput`
- `emailInput`
- `phoneInput`
- `bookAppointmentButton`

**Methods:**

- `fillPersonalDetails(details: CustomerDetails)` - Fill all personal details
- `submitBooking()` - Submit the booking form
- `fillAndSubmit(details: CustomerDetails)` - Fill and submit in one call
- `verifyPageVisible()` - Verify personal details page is displayed
- `verifyValidationError(errorMessage: string)` - Verify validation error message
- `verifyFormStillVisible()` - Verify form is still displayed
- `verifyFieldValue(field, expectedValue)` - Verify field has expected value

**Interface:**

```typescript
interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
```

### ConfirmationPage (`confirmation.page.ts`)

Handles booking confirmation and modification actions.

**Key Locators:**

- `confirmationHeading`
- `cancelAppointmentButton`
- `editDateTimeLink`
- `bookAnotherButton`

**Methods:**

- `verifyConfirmation(timeout?: number)` - Verify booking confirmation (with retry)
- `verifyAppointmentDetails(details)` - Verify appointment details are displayed
- `cancelAppointment()` - Cancel the appointment
- `verifyCancellationConfirmation()` - Verify cancellation message
- `bookAnother()` - Click book another button
- `editDateTime()` - Click edit date/time link
- `handleDuplicateAppointmentPopup()` - Handle duplicate appointment popup if present

## Usage Examples

### Basic Happy Path Test

```typescript
import { test, expect } from "@playwright/test";
import {
  ServiceSelectionPage,
  LocationPage,
  MeetingPreferencePage,
  DateTimePage,
  PersonalDetailsPage,
  ConfirmationPage,
} from "./pages";

test("Complete booking flow", async ({ page }) => {
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

  await locationPage.selectLocation("McKinney 2093 N. Central");
  await meetingPage.selectMeetInPerson();

  await dateTimePage.selectToday();
  const selectedTime = await dateTimePage.selectFirstAvailableTime();

  await personalDetailsPage.fillAndSubmit({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
  });

  await confirmationPage.verifyConfirmation();
});
```

### Validation Test

```typescript
test("Verify required field validation", async ({ page }) => {
  const servicePage = new ServiceSelectionPage(page);
  const personalDetailsPage = new PersonalDetailsPage(page);

  // Navigate through flow...

  await personalDetailsPage.submitBooking();
  await personalDetailsPage.verifyValidationError("First Name is required");
  await personalDetailsPage.verifyValidationError("Last Name is required");
});
```

### Date Validation Test

```typescript
test("Verify past dates are disabled", async ({ page }) => {
  const dateTimePage = new DateTimePage(page);

  // Navigate to date selection...

  await dateTimePage.verifyPastDatesDisabled([1, 2]);
  await dateTimePage.verifyFutureDatesEnabled([1, 2]);
});
```

## Best Practices

1. **Use Page Objects Consistently**: Always use page objects instead of direct page interactions in tests
2. **Keep Tests Readable**: Tests should read like user stories, hiding technical implementation details
3. **Single Responsibility**: Each page object should represent one page/component
4. **Reusable Methods**: Create methods that can be used across multiple tests
5. **Meaningful Names**: Use descriptive method and variable names
6. **Type Safety**: Leverage TypeScript interfaces for better type checking
7. **Wait Strategies**: Use built-in wait methods instead of hard-coded timeouts

## Maintenance

When the UI changes:

1. Update only the affected page object class
2. All tests using that page object will automatically use the updated locators
3. Run tests to verify changes work correctly

## Utilities

The `utils/` directory contains helper functions:

- `date-helpers.ts` - Date calculation and locator utilities
  - `getWorkingDay()` - Calculate working days (excluding weekends)
  - `getDateLocator()` - Get Playwright locator for calendar dates

## Migration Status

All test files have been migrated to use the Page Object Model:

- ✅ `happy-path-booking.spec.ts`
- ✅ `example.spec.ts`
- ✅ `required-field-validation.spec.ts`
- ✅ `service-pagination.spec.ts`
- ✅ `invalid-email-format.spec.ts`
- ✅ `past-date-disabled.spec.ts`
- ✅ `modification-cancel-appointment.spec.ts`
- ✅ `modification-change-time.spec.ts`
- ✅ `network-error-retry.spec.ts`

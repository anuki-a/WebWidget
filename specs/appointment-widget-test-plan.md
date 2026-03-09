# Test Plan

## Application Overview

Appointment widget web application at the provided QA URL. Scope focuses on the booking flow, validation, and modification with a 10-test limit.

## Test Scenarios

### 1. Appointment Widget

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy-path booking

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Navigate to the base URL.
    - expect: The service widget loads successfully.
  2. Select the first available Location.
    - expect: A list of locations is displayed.
    - expect: The first location is selected.
  3. Choose the first Service Category and then the first Service.
    - expect: Service categories are visible and non-empty.
    - expect: A service can be selected.
  4. Pick a date and time from the calendar.
    - expect: A date/time slot is chosen.
  5. Enter valid customer details and submit the form.
    - expect: Form submission succeeds.
  6. -
    - expect: A confirmation message with booking details appears.

#### 1.2. Required-field validation on customer info

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Complete steps 1–4 from scenario 1.
    - expect: Booking flow progresses to customer info.
  2. Leave mandatory fields blank and attempt to continue.
    - expect: Validation errors are displayed for missing fields.

#### 1.3. Invalid email format

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Follow steps 1–4 of scenario 1.
    - expect: Reached customer information form.
  2. Enter an incorrectly formatted email and submit.
    - expect: An email-specific validation error is shown.

#### 1.4. No services available for a location

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Choose a location that has no associated services.
    - expect: A notice indicates that no services are available.

#### 1.5. Service pagination / dynamic list

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Scroll or page through the service list.
    - expect: Additional services are loaded or visible.
  2. Select a service that appears only after paging and continue booking.
    - expect: The selected service is retained through navigation.

#### 1.6. Calendar edge-case: past date

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Select a service and attempt to pick a past date.
    - expect: Dates before the current day are disabled or unselectable.

#### 1.7. Modification – change time

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Complete a booking using the happy path.
    - expect: Booking confirmation is shown.
  2. Click the modify option on the confirmation screen.
    - expect: Modification page loads.
  3. Select a different available time and save.
    - expect: The updated appointment details are displayed.

#### 1.8. Modification – cancel appointment

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Complete a booking.
    - expect: Confirmation appears.
  2. Use the cancel option on the confirmation screen.
    - expect: Cancellation confirmation is shown and booking removed.

#### 1.9. Network error / retry

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Simulate a network failure during form submission.
    - expect: An error notification appears.
  2. Attempt to retry the submission.
    - expect: The request succeeds after retry.

#### 1.10. Accessibility / keyboard navigation

**File:** `specs/appointment-widget-test-plan.md`

**Steps:**
  1. Tab through the widget from entry point to confirmation.
    - expect: Focus order is logical and all controls reachable.
  2. Verify form fields have appropriate labels.
    - expect: Labels are present for each input element.

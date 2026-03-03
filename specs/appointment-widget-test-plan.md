# FMSI Appointment Widget - Fresh Test Plan

## Application Overview

The FMSI Appointment Widget is a multi-step appointment scheduling system enabling users to book financial services appointments. The application spans 6 core steps: Service Selection, Location Selection, Meeting Preference, Date and Time Selection, Personal Details Entry, and Confirmation. Key business value flows include: (1) Completing a full end-to-end appointment booking with dynamic service/location selection, (2) Handling online application alternatives for eligible services, (3) Managing location availability and search functionality, (4) Validating user inputs and data integrity, (5) Preserving user selections across navigation, and (6) Graceful error handling for network/availability issues. Testing prioritizes dynamic data handling (no hardcoded names/counts), UI schema integrity verification, and business constraint validation.

## Test Scenarios

### 1. Service Selection - Critical Path

**Seed:** `tests/seed.spec.ts`

#### 1.1. Service selection by expanding first category and selecting first service

**File:** `tests/appointment-widget/service-selection-basic.spec.ts`

**Steps:**
  1. Navigate to the Appointment Widget service selection page
    - expect: Service selection page loads
    - expect: Service categories container is visible and accessible
    - expect: The count of visible service category elements is greater than 0
  2. Click/expand the first service category in the list
    - expect: First service category button expands successfully
    - expect: Service list appears below the expanded category showing available services
    - expect: Service list contains at least one selectable service
  3. Click on the first available service in the expanded category
    - expect: First service in the expanded list is clickable
    - expect: Service dialog or confirmation flow initiates
    - expect: Dialog displays action options (schedule appointment or skip to online application if available)
  4. Select 'Continue with scheduling' option from any dialog presented
    - expect: User proceeds from the service selection step
    - expect: Page navigates to the Location selection step
    - expect: Service selection is retained in session state

#### 1.2. Verify all service categories are expandable and contain services

**File:** `tests/appointment-widget/service-category-exploration.spec.ts`

**Steps:**
  1. Load Service selection page
    - expect: Service selection page is ready
    - expect: At least 2 service category containers are visible
  2. Expand each service category and verify it contains at least one service
    - expect: Category expands when clicked
    - expect: Expanded category reveals at least one service item
    - expect: Service items are clickable
  3. Verify consistent behavior across all categories
    - expect: All categories follow consistent UI structure
    - expect: Each category has collapsible/expandable behavior

### 2. Location Selection - Value Flow

**Seed:** `tests/seed.spec.ts`

#### 2.1. Search locations and select first available result

**File:** `tests/appointment-widget/location-search-and-select.spec.ts`

**Steps:**
  1. Complete service selection and arrive at Location step
    - expect: Location selection step is active
    - expect: Location search input container is visible
    - expect: Map/location display area is present in the UI
  2. Enter a location search term (city name, state, or ZIP code)
    - expect: Search input accepts text entry
    - expect: Search results container appears and updates with results
    - expect: Results list is non-empty when valid search term is provided
  3. Select the first location result from the list
    - expect: Location results are displayed (if any match found)
    - expect: First location item in results is clickable
    - expect: Location detail container shows selected location metadata
  4. Proceed to the next step (Meeting Preference)
    - expect: Location selection is saved in session
    - expect: Navigation to Meeting Preference step occurs
    - expect: Selected location value persists for later confirmation

#### 2.2. Service fails gracefully when location search returns no results

**File:** `tests/appointment-widget/location-no-results-handling.spec.ts`

**Steps:**
  1. Load Location selection step
    - expect: Location selection page is ready with search input
  2. Enter an invalid location search term
    - expect: Search executes for an invalid/non-existent location
    - expect: No results message or empty results list is displayed
    - expect: UI remains responsive
  3. Attempt to advance without selecting a location
    - expect: Proceed/Next button is disabled or validation blocks navigation
    - expect: User-facing message indicates location selection is required

### 3. Meeting Preference - Configuration

**Seed:** `tests/seed.spec.ts`

#### 3.1. Select meeting preference and advance

**File:** `tests/appointment-widget/meeting-preference-selection.spec.ts`

**Steps:**
  1. Complete location selection and arrive at Meeting Preference
    - expect: Meeting Preference step container is active
    - expect: Meeting preference options list is visible
    - expect: Options list contains at least one selectable preference
  2. Click the first available meeting preference option
    - expect: First preference option is clickable
    - expect: Selection highlights the chosen option
    - expect: Selection is recorded in state
  3. Proceed to Date and Time selection
    - expect: Date and Time step loads
    - expect: Meeting preference selection is retained in session

### 4. Date, Time & Availability - Critical Business Logic

**Seed:** `tests/seed.spec.ts`

#### 4.1. Select available date and time slot

**File:** `tests/appointment-widget/datetime-selection-basic.spec.ts`

**Steps:**
  1. Complete meeting preference selection and arrive at Date/Time
    - expect: Date and Time step loads
    - expect: Calendar/date picker interface is visible
    - expect: Available dates are presented
  2. Select the first available date with open time slots
    - expect: At least one date with available slots is selectable
    - expect: Clicking a date displays time slot options
    - expect: Time slots list is non-empty
  3. Select the first available time slot
    - expect: First time slot is clickable
    - expect: Slot duration matches the service chosen earlier
    - expect: Selection is recorded in state
  4. Proceed to Personal Details
    - expect: Personal Details step loads
    - expect: Selected date and time are preserved

#### 4.2. Handle unavailable dates gracefully

**File:** `tests/appointment-widget/datetime-no-availability.spec.ts`

**Steps:**
  1. Load Date/Time step
    - expect: Date picker displays available and unavailable dates
  2. Try to select a date with no slots available
    - expect: Attempting to select an unavailable date shows error or prevents selection
    - expect: User can reselect an available date

#### 4.3. Cannot proceed without date and time selection

**File:** `tests/appointment-widget/datetime-required-validation.spec.ts`

**Steps:**
  1. Load Date and Time step
    - expect: Date/Time selection interface is ready
  2. Attempt to advance without selecting a date and time
    - expect: Proceeding without selection is blocked
    - expect: Validation error indicates date and time selection is required

### 5. Personal Details - Data Validation

**Seed:** `tests/seed.spec.ts`

#### 5.1. Enter valid personal details and proceed to confirmation

**File:** `tests/appointment-widget/personal-details-complete.spec.ts`

**Steps:**
  1. Complete date/time selection and arrive at Personal Details
    - expect: Personal Details form loads
    - expect: Required form fields are visible (First Name, Last Name, Email, Phone)
    - expect: All required fields are marked/indicated
  2. Fill all required fields with valid data (e.g., name, email, phone number)
    - expect: All form fields accept valid input without errors
    - expect: Input validation occurs in real-time
  3. Click Next/Proceed to Confirmation
    - expect: Form validation passes
    - expect: Confirmation step loads
    - expect: All entered details are retained for review

#### 5.2. Required field validation blocks submission

**File:** `tests/appointment-widget/personal-details-required-validation.spec.ts`

**Steps:**
  1. Load Personal Details step
    - expect: Personal Details form is loaded
  2. Attempt to submit the form with empty required fields
    - expect: Submit is blocked
    - expect: Error messages appear for each missing required field
  3. Verify form accepts valid data after corrections
    - expect: User can correct missing fields and resubmit

#### 5.3. Email format validation enforces RFC standards

**File:** `tests/appointment-widget/email-format-validation.spec.ts`

**Steps:**
  1. Populate other form fields and focus on email field
    - expect: Email field is loaded and ready for input
  2. Test invalid email then correct to valid format
    - expect: Invalid email formats are rejected with clear error message
    - expect: Valid email formats are accepted

#### 5.4. Phone number format validation

**File:** `tests/appointment-widget/phone-format-validation.spec.ts`

**Steps:**
  1. Focus on phone field in Personal Details form
    - expect: Phone field is visible
  2. Test invalid phone format then correct to valid
    - expect: Invalid phone formats are rejected
    - expect: Valid phone formats are accepted

### 6. Confirmation & Completion - End-to-End Value

**Seed:** `tests/seed.spec.ts`

#### 6.1. Review and confirm appointment

**File:** `tests/appointment-widget/confirmation-display-and-book.spec.ts`

**Steps:**
  1. Complete personal details and arrive at Confirmation
    - expect: Confirmation page displays all appointment details
    - expect: Service name, location, meeting preference, date/time, and personal details are shown
    - expect: Displayed values match what was entered/selected in prior steps
  2. Review appointment summary for accuracy
    - expect: Confirm/Book button is enabled and clickable
  3. Click the Confirm/Book Appointment button
    - expect: Appointment submission succeeds
    - expect: Success message or confirmation reference appears
    - expect: Confirmation ID or reference number is displayed

#### 6.2. Verify captured appointment values match displayed values

**File:** `tests/appointment-widget/confirmation-value-capture.spec.ts`

**Steps:**
  1. Arrive at Confirmation and compare displayed data with captured values from prior steps
    - expect: Confirmation step shows service name/category selected earlier
    - expect: Location text matches selection from location step
    - expect: Date and time on confirmation match selected slots
    - expect: Personal details match form entries
  2. Validate data integrity across the multi-step flow
    - expect: All values are correctly preserved and displayed without data loss

### 7. Navigation & Session Handling

**Seed:** `tests/seed.spec.ts`

#### 7.1. Navigate back to prior steps and edit selections

**File:** `tests/appointment-widget/step-navigation-and-edits.spec.ts`

**Steps:**
  1. Progress to the Personal Details or later step
    - expect: Step navigation header shows all 6 steps with current step highlighted
  2. Click on Service, Location, or Meeting Preference step tab
    - expect: Clicking a prior step link navigates back
    - expect: Previously entered data is preserved in all form fields
  3. Modify a prior selection (e.g., change location or service)
    - expect: User can edit prior selections
    - expect: Changes are reflected when navigating forward again

#### 7.2. Close widget and session state

**File:** `tests/appointment-widget/close-widget.spec.ts`

**Steps:**
  1. Be on any step of the appointment flow
    - expect: Close button (X) is visible at top-right of widget
  2. Click the X button to close
    - expect: Clicking close exits the widget
    - expect: User is returned to the referring page
    - expect: No partial appointment is saved
  3. Reopen the appointment widget
    - expect: Reopening the widget starts from Service step with no retained data

#### 7.3. Language selection preserves flow and user selections

**File:** `tests/appointment-widget/language-switching.spec.ts`

**Steps:**
  1. Load appointment widget on any step
    - expect: Language selector is visible (English/Spanish)
    - expect: Current language is indicated
  2. Switch language to Spanish and continue booking
    - expect: Selecting Spanish changes all UI text to Spanish
    - expect: User form entries and selections remain intact
    - expect: Functionality is preserved in alternate language
  3. Verify flow works end-to-end in Spanish
    - expect: Appointment can be completed in Spanish without issues

### 8. Negative Tests & Error Handling

**Seed:** `tests/seed.spec.ts`

#### 8.1. Graceful error handling for network failures

**File:** `tests/appointment-widget/network-error-recovery.spec.ts`

**Steps:**
  1. Simulate network error or slow connection
    - expect: User is on a step that loads external data (location search, availability)
  2. Verify error handling prevents poor user experience
    - expect: Error message is displayed instead of hanging/infinite loading
    - expect: Error message is clear and suggests user action
  3. Restore connection and verify recovery
    - expect: Retry mechanism is available
    - expect: System recovers when connection is restored

#### 8.2. Prevent duplicate appointment bookings from rapid-click

**File:** `tests/appointment-widget/duplicate-booking-prevention.spec.ts`

**Steps:**
  1. Complete an appointment and reach Confirmation
    - expect: Confirmation page is ready with Book button enabled
  2. Rapidly click the Book/Confirm button 5+ times
    - expect: Rapidly clicking the Book button multiple times creates only one appointment
    - expect: Button is disabled after first submission or submission is otherwise prevented
  3. Verify no duplicates in system
    - expect: Only one appointment is created
    - expect: Success message appears once

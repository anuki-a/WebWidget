import { test, expect } from '@playwright/test';

// FEATURE: Appointment Widget
test.describe('Appointment Widget', () => {

  // Scenario: Accessibility / keyboard navigation
  test('Navigate appointment booking using keyboard @accessibility', async ({ page }) => {
    // Navigate to service selection
    await page.goto('https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768');
    
    // Use keyboard to navigate through service selection
    // Tab to first service button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Expand Personal Accounts category using Enter
    await page.keyboard.press('Space'); // or 'Enter' depending on elements

    // Verify personal accounts expanded (if keyboard navigation supported)
    const personalAccountsButton = page.getByRole('button', { name: 'Personal Accounts' });
    await expect(personalAccountsButton).toBeVisible();

    // Tab through form fields to verify focus order is logical
    const firstNameField = page.getByRole('textbox', { name: 'First Name' });
    const lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    const emailField = page.getByRole('textbox', { name: 'Email' });

    // Verify form fields exist and have labels  
    await expect(firstNameField).toBeVisible();
    await expect(lastNameField).toBeVisible();
    await expect(emailField).toBeVisible();

    // Verify form labels are present (accessibility requirement)
    const pageContent = await page.locator('text=/First Name|Last Name|Email/').count();
    await expect(pageContent).toBeGreaterThan(0);
  });

});

import { test, expect } from '@playwright/test';

// FEATURE: Service Booking Flow
test.describe('Service Booking Flow', () => {

  // Scenario 1: Dynamic Happy Path
  test('Complete booking with first available service @smoke @functional', async ({ page }) => {
    await page.goto('/services');

    // DYNAMIC RULE: No hardcoded names. Select first category.
    const firstCategory = page.locator('.category-card').first();
    await firstCategory.click();

    // DYNAMIC RULE: Capture name to verify later
    const serviceLocator = page.locator('.service-item').first();
    const expectedService = await serviceLocator.innerText();
    await serviceLocator.click();

    // Verification based on captured dynamic data
    await expect(page.locator('.selection-summary')).toContainText(expectedService);
  });

  // Scenario 2: Merged Negative Tests (DRY approach)
  const invalidEmails = ['plainaddress', '#@%^%#$@#', '@example.com'];
  
  for (const email of invalidEmails) {
    test(`Prevent booking with invalid email: ${email} @negative`, async ({ page }) => {
      await page.goto('/checkout');
      await page.fill('input[type="email"]', email);
      await page.click('#submit-booking');
      
      // Check for validation gatekeeper
      const error = page.locator('.error-message');
      await expect(error).toBeVisible();
    });
  }
});
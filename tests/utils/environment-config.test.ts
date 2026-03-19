import { test, expect } from '@playwright/test';
import { EnvironmentConfigManager } from './environment-config';

test.describe('Environment Configuration', () => {
  test('should load default QA environment', () => {
    // Reset environment for testing
    delete process.env.TEST_ENV;
    
    const config = EnvironmentConfigManager.getCurrentEnvironment();
    expect(config.name).toBe('Quality Assurance');
    expect(config.adminPortal.url).toBe('https://ac-qa.fmsidev.us');
    expect(config.widget.url).toContain('ac-qa.fmsidev.us');
  });

  test('should load STG environment when specified', () => {
    process.env.TEST_ENV = 'stg';
    
    const config = EnvironmentConfigManager.getCurrentEnvironment();
    expect(config.name).toBe('Staging');
    expect(config.adminPortal.url).toBe('https://ac-stg.fmsidev.us');
  });

  test('should throw error for unknown environment', () => {
    process.env.TEST_ENV = 'unknown';
    
    expect(() => {
      EnvironmentConfigManager.getCurrentEnvironment();
    }).toThrow('Unknown environment: unknown');
  });

  test('should get admin portal URL', () => {
    process.env.TEST_ENV = 'qa';
    
    const url = EnvironmentConfigManager.getAdminPortalUrl();
    expect(url).toBe('https://ac-qa.fmsidev.us');
  });

  test('should get API base URL', () => {
    process.env.TEST_ENV = 'qa';
    
    const apiUrl = EnvironmentConfigManager.getApiBaseUrl();
    expect(apiUrl).toBe('https://ac-qa.fmsidev.us/api');
  });

  test('should get widget URL', () => {
    process.env.TEST_ENV = 'qa';
    
    const widgetUrl = EnvironmentConfigManager.getWidgetUrl();
    expect(widgetUrl).toContain('AppointmentWidget');
  });

  test('should throw error when credentials are missing', () => {
    process.env.TEST_ENV = 'qa';
    delete process.env.QA_ADMIN_USER;
    delete process.env.QA_ADMIN_PASS;
    
    expect(() => {
      EnvironmentConfigManager.getAdminCredentials();
    }).toThrow('Missing credentials for environment qa');
  });

  test('should return all available environments', () => {
    const environments = EnvironmentConfigManager.getAllEnvironments();
    expect(environments).toContain('qa');
    expect(environments).toContain('stg');
    expect(environments).toContain('uat');
  });

  test('should validate environment correctly', () => {
    expect(EnvironmentConfigManager.isEnvironmentValid('qa')).toBe(true);
    expect(EnvironmentConfigManager.isEnvironmentValid('invalid')).toBe(false);
  });
});

import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
  name: string;
  adminPortal: {
    url: string;
    apiBase: string;
  };
  widget: {
    url: string;
  };
  environmentVariables: {
    adminUsername: string;
    adminPassword: string;
  };
}

export class EnvironmentConfigManager {
  private static environments: Record<string, EnvironmentConfig>;
  private static currentEnvironment: string;

  static initialize(): void {
    // Load environment configuration
    const configPath = resolve(__dirname, '../../config/environments.json');
    const configData = readFileSync(configPath, 'utf8');
    this.environments = JSON.parse(configData);

    // Set current environment from environment variable
    this.currentEnvironment = process.env.TEST_ENV || 'qa';
    
    if (!this.environments[this.currentEnvironment]) {
      throw new Error(`Unknown environment: ${this.currentEnvironment}. Available: ${Object.keys(this.environments).join(', ')}`);
    }
  }

  static getCurrentEnvironment(): EnvironmentConfig {
    if (!this.environments) {
      this.initialize();
    }
    return this.environments[this.currentEnvironment];
  }

  static getEnvironmentName(): string {
    if (!this.currentEnvironment) {
      this.initialize();
    }
    return this.currentEnvironment;
  }

  static getAdminCredentials(): { username: string; password: string } {
    const env = this.getCurrentEnvironment();
    const username = process.env[env.environmentVariables.adminUsername];
    const password = process.env[env.environmentVariables.adminPassword];

    if (!username || !password) {
      throw new Error(`Missing credentials for environment ${this.currentEnvironment}. ` +
        `Set ${env.environmentVariables.adminUsername} and ${env.environmentVariables.adminPassword} environment variables.`);
    }

    return { username, password };
  }

  static getAdminPortalUrl(): string {
    return this.getCurrentEnvironment().adminPortal.url;
  }

  static getApiBaseUrl(): string {
    return this.getCurrentEnvironment().adminPortal.apiBase;
  }

  static getWidgetUrl(): string {
    return this.getCurrentEnvironment().widget.url;
  }

  static getAllEnvironments(): string[] {
    if (!this.environments) {
      this.initialize();
    }
    return Object.keys(this.environments);
  }

  static isEnvironmentValid(environment: string): boolean {
    if (!this.environments) {
      this.initialize();
    }
    return environment in this.environments;
  }

  // Utility method for testing
  static setTestEnvironment(environment: string): void {
    if (!this.isEnvironmentValid(environment)) {
      throw new Error(`Invalid test environment: ${environment}`);
    }
    this.currentEnvironment = environment;
  }
}

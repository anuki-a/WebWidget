import { APIRequestContext, expect } from "@playwright/test";

/**
 * AC Portal API Helper Functions
 * Provides utilities for creating and managing test data via AC Portal APIs
 */

export interface HolidayRequest {
  clientId: number;
  locationId: number;
  holidayName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  isFullDay: boolean;
}

export interface AppointmentData {
  confirmationNumber: string;
  locationCode: string;
  serviceCode: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail?: string;
  customerPhone?: string;
  appointmentStartDateTime: string; // ISO datetime
  appointmentEndDateTime: string; // ISO datetime
  meetingPreference: string;
  status: string;
  spanishRequested?: boolean;
}

export interface SaveResult {
  success: boolean;
  message?: string;
  id?: number;
}

/**
 * AC Portal API Client
 */
export class ACPortalAPI {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Create a test holiday
   */
  async createHoliday(holidayData: HolidayRequest): Promise<SaveResult> {
    try {
      const response = await this.request.post(`${this.baseURL}/api/client/SaveHoliday`, {
        data: holidayData,
      });

      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      return result as SaveResult;
    } catch (error) {
      console.error("Failed to create holiday:", error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Delete a test holiday
   */
  async deleteHoliday(holidayId: number, clientId: number, locationId: number): Promise<SaveResult> {
    try {
      const response = await this.request.post(`${this.baseURL}/api/client/DeleteHoliday`, {
        data: {
          holidayId,
          clientId,
          currentLocationId: locationId,
        },
      });

      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      return result as SaveResult;
    } catch (error) {
      console.error("Failed to delete holiday:", error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Get holidays for a location
   */
  async getHolidays(locationCode: string): Promise<any[]> {
    try {
      const response = await this.request.get(
        `${this.baseURL}/api/v1/location/${locationCode}/holidays`
      );

      expect(response.ok()).toBeTruthy();
      return await response.json();
    } catch (error) {
      console.error("Failed to get holidays:", error);
      return [];
    }
  }

  /**
   * Create a test appointment
   */
  async createAppointment(appointmentData: AppointmentData): Promise<SaveResult> {
    try {
      const response = await this.request.post(`${this.baseURL}/api/v1/appointment`, {
        data: appointmentData,
        params: {
          allowOverlappedAppts: true,
        },
      });

      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      return result as SaveResult;
    } catch (error) {
      console.error("Failed to create appointment:", error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Get appointment by confirmation number
   */
  async getAppointment(confirmationNumber: string): Promise<any> {
    try {
      const response = await this.request.get(
        `${this.baseURL}/api/v1/appointment/${confirmationNumber}`
      );

      expect(response.ok()).toBeTruthy();
      return await response.json();
    } catch (error) {
      console.error("Failed to get appointment:", error);
      return null;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    confirmationNumber: string,
    status: string,
    statusData?: any
  ): Promise<SaveResult> {
    try {
      const response = await this.request.put(
        `${this.baseURL}/api/v1/appointment/${confirmationNumber}/status/${status}`,
        {
          data: statusData,
        }
      );

      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      return result as SaveResult;
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Edit appointment
   */
  async editAppointment(
    confirmationNumber: string,
    appointmentData: AppointmentData
  ): Promise<SaveResult> {
    try {
      const response = await this.request.put(
        `${this.baseURL}/api/v1/appointment/${confirmationNumber}`,
        {
          data: appointmentData,
          params: {
            allowOverlappedAppts: true,
          },
        }
      );

      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      return result as SaveResult;
    } catch (error) {
      console.error("Failed to edit appointment:", error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Get availability for location/service
   */
  async getAvailability(
    locationCode: string,
    serviceCode: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      const response = await this.request.get(
        `${this.baseURL}/api/Booking/v3/availability/location/${locationCode}/service/${serviceCode}/startDateLocal/${startDate}/endDateLocal/${endDate}/firstAvailableDate`
      );

      expect(response.ok()).toBeTruthy();
      return await response.json();
    } catch (error) {
      console.error("Failed to get availability:", error);
      return null;
    }
  }

  /**
   * Batch availability lookup
   */
  async batchAvailabilityLookup(availabilityRequest: any): Promise<any> {
    try {
      const response = await this.request.post(
        `${this.baseURL}/api/Booking/v3/BatchAvailabilityLookup`,
        {
          data: availabilityRequest,
        }
      );

      expect(response.ok()).toBeTruthy();
      return await response.json();
    } catch (error) {
      console.error("Failed to lookup batch availability:", error);
      return null;
    }
  }
}

/**
 * Test Data Factory
 */
export class TestDataFactory {
  /**
   * Create a partial holiday for testing
   */
  static createPartialHoliday(
    clientId: number,
    locationId: number,
    date: Date,
    startTime: string,
    endTime: string
  ): HolidayRequest {
    return {
      clientId,
      locationId,
      holidayName: `Test Partial Holiday ${Date.now()}`,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0],
      startTime,
      endTime,
      isFullDay: false,
    };
  }

  /**
   * Create a full day holiday for testing
   */
  static createFullDayHoliday(
    clientId: number,
    locationId: number,
    date: Date
  ): HolidayRequest {
    return {
      clientId,
      locationId,
      holidayName: `Test Full Holiday ${Date.now()}`,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0],
      isFullDay: true,
    };
  }

  /**
   * Create test appointment data
   */
  static createTestAppointment(
    confirmationNumber: string,
    locationCode: string,
    serviceCode: string,
    startDateTime: Date,
    endDateTime: Date,
    meetingPreference: string = "InPerson",
    customerData?: Partial<AppointmentData>
  ): AppointmentData {
    const defaultCustomerData = {
      customerFirstName: "Test",
      customerLastName: "User",
      customerEmail: "test.user@example.com",
      customerPhone: "555-123-4567",
      status: "Scheduled",
      spanishRequested: false,
    };

    return {
      confirmationNumber,
      locationCode,
      serviceCode,
      appointmentStartDateTime: startDateTime.toISOString(),
      appointmentEndDateTime: endDateTime.toISOString(),
      meetingPreference,
      ...defaultCustomerData,
      ...customerData,
    };
  }
}

/**
 * API Test Helper
 * Provides setup/teardown utilities for API-based tests
 */
export class APITestHelper {
  private api: ACPortalAPI;
  private createdHolidays: number[] = [];
  private createdAppointments: string[] = [];

  constructor(api: ACPortalAPI) {
    this.api = api;
  }

  /**
   * Create a test holiday and track it for cleanup
   */
  async createTestHoliday(holidayData: HolidayRequest): Promise<SaveResult> {
    const result = await this.api.createHoliday(holidayData);
    if (result.success && result.id) {
      this.createdHolidays.push(result.id);
    }
    return result;
  }

  /**
   * Create a test appointment and track it for cleanup
   */
  async createTestAppointment(appointmentData: AppointmentData): Promise<SaveResult> {
    const result = await this.api.createAppointment(appointmentData);
    if (result.success) {
      this.createdAppointments.push(appointmentData.confirmationNumber);
    }
    return result;
  }

  /**
   * Clean up all created test data
   */
  async cleanup(clientId: number, locationId: number): Promise<void> {
    // Clean up holidays
    for (const holidayId of this.createdHolidays) {
      await this.api.deleteHoliday(holidayId, clientId, locationId);
    }
    this.createdHolidays = [];

    // Clean up appointments (cancel them)
    for (const confirmationNumber of this.createdAppointments) {
      await this.api.updateAppointmentStatus(confirmationNumber, "Cancelled");
    }
    this.createdAppointments = [];
  }
}

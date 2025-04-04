// Try different import approaches to handle various module export patterns
//@ts-ignore
import modNetworkModule from '../../lib/konyLib/common/modules/modNetwork';

// Handle different export patterns
//@ts-ignore
const modNetwork = modNetworkModule.modNetwork || modNetworkModule.default || modNetworkModule;

import type { ApiResponse } from './interface';

/**
 * Success callback type
 */
export type SuccessCallback<T = any> = (response: ApiResponse<T>) => void;

/**
 * Error callback type
 */
export type ErrorCallback = (error: any) => void;

/**
 * A wrapper around the modNetwork function from Kony SDK
 * This provides a consistent interface for making API calls throughout the application
 *
 * @param endpoint - API endpoint to call
 * @param payload - Request payload
 * @param onSuccess - Success callback function
 * @param onError - Optional error callback function
 * @param requestType - Optional request type identifier (default: 'default')
 * @param authToken - Optional authentication token (default: '')
 * @param contentType - Optional content type (default: '')
 * @param acceptType - Optional accept type (default: '')
 */
export function callApi<T = any>(
  endpoint: string,
  payload: any,
  onSuccess: SuccessCallback<T>,
  onError?: ErrorCallback,
  requestType = 'default',
  authToken = '',
  contentType = '',
  acceptType = ''
): void {
  try {
    // Check if modNetwork is available
    if (typeof modNetwork !== 'function') {
      throw new Error('modNetwork function is not available');
    }

    // Call the modNetwork function from the SDK
    modNetwork(
      endpoint,
      payload,
      (response: ApiResponse<T>) => {
        if (response.oprstatus === 0 && response.returnCode === 0) {
          // Success case
          onSuccess(response);
        } else {
          // Error case with API response
          const errorMessage = response.errmsg?.[1] || 'Unknown error occurred';
          console.error('API Error:', errorMessage, response);

          // Call error callback if provided
          if (onError) {
            onError(response);
          } else {
            // Default error handling if no callback provided
            alert(errorMessage);
          }
        }
      },
      authToken,
      contentType,
      acceptType,
      requestType
    );
  } catch (error) {
    // Handle any exceptions
    console.error('Exception in API call:', error);

    if (onError) {
      onError(error);
    } else {
      // Default error handling if no callback provided
      alert('An unexpected error occurred');
    }
  }
}

/**
 * Common API endpoints
 * Add your endpoints here for easy access
 */
export const API = {
  SIGNUP_API: '/api/signup',
  LOGIN_API: '/api/login',
  VERIFY_OTP: '/api/verify-otp',
  // Add more endpoints as needed
};

/**
 * Interface for signup user data
 */
export interface SignupUserData {
  name: string;
  emiratesId: string;
  mobileNumber: string;
  emailId: string;
}

/**
 * User signup function
 */
export function signupUser(userData: SignupUserData, onSuccess: SuccessCallback, onError?: ErrorCallback): void {
  callApi(
    API.SIGNUP_API,
    {
      name: userData.name,
      emiratesld: userData.emiratesId, // Note: This is intentionally 'ld' not 'Id' based on the API requirements
      mobileNumber: userData.mobileNumber,
      emailld: userData.emailId, // Note: This is intentionally 'ld' not 'Id' based on the API requirements
      journeyType: 'CUSTOMER',
    },
    onSuccess,
    onError,
    'register'
  );
}

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * User login function
 */
export function loginUser(credentials: LoginCredentials, onSuccess: SuccessCallback, onError?: ErrorCallback): void {
  callApi(API.LOGIN_API, credentials, onSuccess, onError, 'login');
}

/**
 * Interface for OTP verification data
 */
export interface OtpVerificationData {
  mobileNumber: string;
  otp: string;
}

/**
 * Verify OTP function
 */
export function verifyOtp(data: OtpVerificationData, onSuccess: SuccessCallback, onError?: ErrorCallback): void {
  callApi(API.VERIFY_OTP, data, onSuccess, onError, 'verify');
}

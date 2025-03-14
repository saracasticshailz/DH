import API from '@/utils/apiEnpoints';
import { callApi } from '@/utils/apiService';
import { ApiResponse, SignupInterface } from '@/utils/interface';

export function signupUser(
  requestPayload: SignupInterface,
  onSuccess: (response: ApiResponse) => void,
  onError?: ErrorCallback
): void {
  callApi(API.SIGNUP_API, requestPayload, onSuccess, onError, 'register');
}

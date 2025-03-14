export interface ApiResponse<T = any> {
  oprstatus: number;
  returnCode: number;
  errmsg?: string[];
  data?: T;
  [key: string]: any; // For other properties like mobileMasked
}

export interface SignupInterface<T = any> {
  name: string;
  emiratesId: string;
  mobileNumber: string;
  emailId: string;
  journeyType: string;
}

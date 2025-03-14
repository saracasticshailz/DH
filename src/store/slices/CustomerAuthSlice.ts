import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/index';

// Define loan application status types
export type LoanApplicationStatus =
  | 'Blank' // Empty/initial state
  | 'PR' // Rejected
  | 'PP' // Pending Pre-Approval
  | 'PC' // Approved
  | 'UP' // ADCB Unapproved Property
  | 'NO' // Valuation Draft In-Progress
  | 'CP' // Pending Customer Consent and Payment
  | 'DU' // Pending Customer Consent and Payment
  | 'OI' // Valuation Order In-Progress
  | 'VC' // Valuation Report Generated
  | 'IN_PROGRESS'
  | ''; // Empty string for initialization

// Define customer types
export type CustomerType = 'ETB' | 'NTB' | 'RM' | null; // Existing To Bank / New To Bank

// Define the type for the auth state
export interface AuthState {
  isAuthenticated: boolean;
  applicationRefNumber: string | null;
  displayMessage: string | null;
  addinfoReqFlag: string | null;
  lapsRefNumber: number | null;
  customerName: string | null;
  loanApplicationNo: string | null;
  loanApplicationStatus: LoanApplicationStatus | null;
  rmCode: string | null;
  rmEmailId: string | null;
  rmMobile: string | null;
  orderId: string | null;
  orderStatus: string | null;
  rmName: string | null;
  approvalDate: string | null;
  customerType: CustomerType;
  lastLoginDatetime: string | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: false,
  applicationRefNumber: null,
  displayMessage: null,
  addinfoReqFlag: null,
  lapsRefNumber: null,
  customerName: null,
  loanApplicationNo: null,
  loanApplicationStatus: null,
  rmCode: 'DEMO',
  rmEmailId: 'heisenberg@123.com',
  rmMobile: '+971987898789',
  orderId: null,
  orderStatus: null,
  rmName: null,
  approvalDate: null,
  customerType: null,
  lastLoginDatetime: null,
  loading: false,
  error: null,
};

// Create the auth slice
export const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<Omit<AuthState, 'isAuthenticated' | 'loading' | 'error'>>) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<AuthState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    // Logout - FIXED VERSION
    logout: (state) => {
      // Simply return to initial state
      return initialState;
    },

    // Update application status
    updateApplicationStatus: (
      state,
      action: PayloadAction<{
        loanApplicationStatus?: LoanApplicationStatus;
        orderStatus?: string;
        displayMessage?: string;
      }>
    ) => {
      console.log('updateApplicationStatus', action.payload.loanApplicationStatus);

      if (action.payload.loanApplicationStatus) {
        state.loanApplicationStatus = action.payload.loanApplicationStatus;
      }
      if (action.payload.orderStatus) {
        state.orderStatus = action.payload.orderStatus;
      }
      if (action.payload.displayMessage) {
        state.displayMessage = action.payload.displayMessage;
      }
    },

    // Update RM details
    updateRMDetails: (
      state,
      action: PayloadAction<{
        rmName?: string;
        rmCode?: string;
        rmEmailId?: string;
        rmMobile?: string;
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setLoading, setError, loginSuccess, updateProfile, logout, updateApplicationStatus, updateRMDetails } =
  customerAuthSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.customerAuth;
export const selectIsAuthenticated = (state: RootState) => state.customerAuth.isAuthenticated;
export const selectApplicationDetails = (state: RootState) => ({
  applicationRefNumber: state.customerAuth.applicationRefNumber,
  loanApplicationNo: state.customerAuth.loanApplicationNo,
  loanApplicationStatus: state.customerAuth.loanApplicationStatus,
  lapsRefNumber: state.customerAuth.lapsRefNumber,
});
export const selectRMDetails = (state: RootState) => ({
  rmName: state.customerAuth.rmName,
  rmCode: state.customerAuth.rmCode,
  rmEmailId: state.customerAuth.rmEmailId,
  rmMobile: state.customerAuth.rmMobile,
});
export const selectCustomerDetails = (state: RootState) => ({
  customerName: state.customerAuth.customerName,
  customerType: state.customerAuth.customerType,
  lastLoginDatetime: state.customerAuth.lastLoginDatetime,
});

export const isLoading = (state: RootState) => state.customerAuth.loading;

// Helper function to get human-readable status
export const getLoanStatusText = (status: LoanApplicationStatus | null): string => {
  if (!status) return 'Not Available';

  switch (status) {
    case 'Blank':
      return 'Not Started';
    case 'PR':
      return 'Rejected';
    case 'PP':
      return 'Pending Pre-Approval';
    case 'PC':
      return 'Approved';
    case 'UP':
      return 'Unapproved Property';
    case 'NO':
      return 'Valuation Draft In-Progress';
    case 'CP':
      return 'Pending Consent and Payment';
    case 'DU':
      return 'Pending Consent and Payment';
    case 'OI':
      return 'Valuation In-Progress';
    case 'VC':
      return 'Valuation Complete';
    default:
      return status;
  }
};

export default customerAuthSlice.reducer;

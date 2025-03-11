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
export type CustomerType = 'ETB' | 'NTB' | null; // Existing To Bank / New To Bank

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
  rmCode: null,
  rmEmailId: null,
  rmMobile: null,
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

    // Logout
    logout: (state) => {
      return {
        ...initialState,
      };
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
      // if (action.payload.orderStatus) {
      //   state.orderStatus = action.payload.orderStatus;
      // }
      // if (action.payload.displayMessage) {
      //   state.displayMessage = action.payload.displayMessage;
      // }
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

export const isLoading = (state: RootState) => {
  state.customerAuth.loading;
};

// export const getCustomerJourneyStatus = (status: LoanApplicationStatus | null, customerType: CustomerType): string => {
//   if (!status) return 'Not Available';

//   // Status mapping based on the provided table
//   const statusMap: Record<LoanApplicationStatus, Record<string, string>> = {
//     Blank: { ETB: 'Apply', NTB: 'Apply' },
//     PR: { ETB: 'Rejected', NTB: 'Rejected' },
//     PP: { ETB: 'Pending Pre-Approval', NTB: 'Pending Pre-Approval' },
//     PC: { ETB: 'Approved', NTB: 'Approved' },
//     UP: { ETB: 'ADCB Unapproved Property', NTB: 'ADCB Unapproved Property' },
//     NO: { ETB: 'Valuation Draft In-Progress', NTB: 'Valuation Draft In-Progress' },
//     CP: { ETB: 'Pending Customer Consent and Payment', NTB: 'Pending Customer Consent and Payment' },
//     DU: { ETB: 'Pending Customer Consent and Payment', NTB: 'Pending Customer Consent and Payment' },
//     OI: { ETB: 'Valuation Order In-Progress', NTB: 'Valuation Order In-Progress' },
//     VC: { ETB: 'Valuation Report Generated', NTB: 'Valuation Report Generated' },
//     '': { ETB: 'Not Available', NTB: 'Not Available' },
//     // IP :{}
//   };

//   return statusMap[status][customerType || 'ETB'] || 'Not Available';
// };

// Helper function to get next action button text based on loan status and customer type
// export const getNextActionButtonText = (
//   status: LoanApplicationStatus | null,
//   customerType: CustomerType
// ): string | null => {
//   if (!status || !customerType) return null;

//   // Next action mapping based on the provided table
//   const actionMap: Record<LoanApplicationStatus, Record<string, string | null>> = {
//     Blank: { ETB: 'Apply Preapproval', NTB: 'Apply Preapproval' },
//     PR: { ETB: 'Not Applicable', NTB: 'Not Applicable' },
//     PP: { ETB: 'Not Applicable', NTB: 'Not Applicable' },
//     PC: { ETB: 'REQUEST FOR VALUATION', NTB: 'Not Applicable' },
//     UP: { ETB: 'RESTART VALUATION', NTB: 'Not Applicable' },
//     NO: { ETB: 'CONTINUE JOURNEY', NTB: 'Not Applicable' },
//     CP: { ETB: 'CONTINUE PAYMENT', NTB: 'Not Applicable' },
//     DU: { ETB: 'CONTINUE PAYMENT', NTB: 'Not Applicable' },
//     OI: { ETB: 'Not Applicable', NTB: 'Not Applicable' },
//     VC: { ETB: 'Not Applicable', NTB: 'Not Applicable' },
//     '': { ETB: null, NTB: null },
//   };

//   return actionMap[status][customerType];
// };

// Helper function to check if next action is available
// export const hasNextAction = (status: LoanApplicationStatus | null, customerType: CustomerType): boolean => {
//   const nextAction = getNextActionButtonText(status, customerType);
//   return nextAction !== null && nextAction !== 'Not Applicable';
// };

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

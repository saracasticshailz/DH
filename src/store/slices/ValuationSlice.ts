import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ValuationFormData,
  PropertyDetails,
  AccessDetails,
  DocumentDetails,
  PaymentDetails,
} from '../types/property';

const initialState: ValuationFormData = {
  valuationActiveStep: 0,
  propertyDetails: {
    propertyType: 'Apartment',
    completionStatus: 'Completed',
    developmentProjectName: '',
    buildingName: '',
    locality: '',
    emirate: 'Dubai',
    flatNumber: '',
    floorNumber: '',
    landmarks: '',
  },
  accessDetails: {
    contactName: '',
    email: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    date: '',
    time: '',
    specialInstructions: '',
    emailAddress: '',
    alternateMobile: '',
    selectedDate: '',
    selectedTime: '',
  },
  documents: {
    propertyAddress: null,
    titleDeed: null,
    salePurchaseAgreement: null,
    floorPlan: null,
    oqood: null,
    additionalDocuments: null,
  },
  payment: {
    discountCode: '',
    standardFees: 5000,
    vat: 250,
    totalPayable: 5250,
  },
  termsAccepted: false,
  privacyAccepted: false,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

const valuationSlice = createSlice({
  name: 'valuation',
  initialState,
  reducers: {
    // Navigation actions
    setValuationActiveStep: (state, action: PayloadAction<number>) => {
      state.valuationActiveStep = action.payload;
    },
    nextStep: (state) => {
      state.valuationActiveStep += 1;
    },
    previousStep: (state) => {
      state.valuationActiveStep -= 1;
    },

    // Property Details actions
    updatePropertyDetails: (state, action: PayloadAction<Partial<PropertyDetails>>) => {
      state.propertyDetails = { ...state.propertyDetails, ...action.payload };
    },
    setPropertyType: (state, action: PayloadAction<'Apartment' | 'Townhouse' | 'Villa'>) => {
      state.propertyDetails.propertyType = action.payload;
    },

    // Access Details actions
    updateAccessDetails: (state, action: PayloadAction<Partial<AccessDetails>>) => {
      state.accessDetails = { ...state.accessDetails, ...action.payload };
    },
    setContactDetails: (
      state,
      action: PayloadAction<{
        contactName: string;
        email: string;
        mobileNumber: string;
      }>
    ) => {
      const { contactName, email, mobileNumber } = action.payload;
      state.accessDetails.contactName = contactName;
      state.accessDetails.email = email;
      state.accessDetails.mobileNumber = mobileNumber;
    },
    setAccessDateTime: (state, action: PayloadAction<{ date: string; time: string }>) => {
      state.accessDetails.date = action.payload.date;
      state.accessDetails.time = action.payload.time;
    },

    // Document actions
    updateDocuments: (state, action: PayloadAction<Partial<DocumentDetails>>) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    removeDocument: (state, action: PayloadAction<keyof DocumentDetails>) => {
      state.documents[action.payload] = null;
    },
    clearAllDocuments: (state) => {
      state.documents = initialState.documents;
    },

    // Payment actions
    updatePayment: (state, action: PayloadAction<Partial<PaymentDetails>>) => {
      state.payment = { ...state.payment, ...action.payload };
    },
    applyDiscount: (state, action: PayloadAction<{ discountAmount: number }>) => {
      const { discountAmount } = action.payload;
      state.payment.standardFees -= discountAmount;
      state.payment.vat = state.payment.standardFees * 0.05;
      state.payment.totalPayable = state.payment.standardFees + state.payment.vat;
    },
    calculateTotals: (state) => {
      state.payment.vat = state.payment.standardFees * 0.05;
      state.payment.totalPayable = state.payment.standardFees + state.payment.vat;
    },

    // Terms & Privacy actions
    updateTermsAcceptance: (state, action: PayloadAction<boolean>) => {
      state.termsAccepted = action.payload;
    },
    updatePrivacyAcceptance: (state, action: PayloadAction<boolean>) => {
      state.privacyAccepted = action.payload;
    },

    // Form submission actions
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset actions
    resetForm: () => initialState,
    resetSection: (
      state: any,
      action: PayloadAction<'propertyDetails' | 'accessDetails' | 'documents' | 'payment'>
    ) => {
      state[action.payload] = initialState[action.payload];
    },
  },
});

export const {
  setValuationActiveStep,
  nextStep,
  previousStep,
  updatePropertyDetails,
  setPropertyType,
  updateAccessDetails,
  setContactDetails,
  setAccessDateTime,
  updateDocuments,
  removeDocument,
  clearAllDocuments,
  updatePayment,
  applyDiscount,
  calculateTotals,
  updateTermsAcceptance,
  updatePrivacyAcceptance,
  setSubmitting,
  setSubmitted,
  setError,
  resetForm,
  resetSection,
} = valuationSlice.actions;

// Selectors
export const selectActiveStep = (state: { valuation: ValuationFormData }) => state.valuation.valuationActiveStep;
export const selectPropertyDetails = (state: { valuation: ValuationFormData }) => state.valuation.propertyDetails;
export const selectAccessDetails = (state: { valuation: ValuationFormData }) => state.valuation.accessDetails;
export const selectDocuments = (state: { valuation: ValuationFormData }) => state.valuation.documents;
export const selectPayment = (state: { valuation: ValuationFormData }) => state.valuation.payment;
export const selectTermsAccepted = (state: { valuation: ValuationFormData }) => state.valuation.termsAccepted;
export const selectPrivacyAccepted = (state: { valuation: ValuationFormData }) => state.valuation.privacyAccepted;
export const selectIsSubmitting = (state: { valuation: ValuationFormData }) => state.valuation.isSubmitting;
export const selectIsSubmitted = (state: { valuation: ValuationFormData }) => state.valuation.isSubmitted;
export const selectError = (state: { valuation: ValuationFormData }) => state.valuation.error;

export default valuationSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MortgageState } from '../types/mortgage';

const initialState: MortgageState = {
  activeJourney: 'preApproval',
  journeyProgress: {
    preApproval: false,
    propertyValuation: false,
    finalOffer: false,
  },
  preApproval: {
    activeStep: 0,
    maxSteps: 5,
    completedSteps: [],
    createCustomerProfile: {
      name: '',
      phoneNumber: '',
      email: '',
      emiratesId: '',
    },
    personalDetails: {
      customerName: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      poBox: '',
      countryOfResidence: '',
      state: '',
    },
    loanDetails: {
      loanPreference: 'C',
      financingOption: 'Fixed',
      purchaseType: '',
      loanAmount: '',
      loanTenure: '',
      specialistCode: '',
      specialistName: '',
    },
    employmentDetails: {
      employmentType: 'SA',
      employerName: '',
      joiningDate: '',
      employerCode: '',
    },
    incomeDetails: {
      fixedMonthlyIncome: '',
      annualRentalIncome: '',
      otherMonthlyIncome: '',
      stayingInCompanyAccommodation: '',
      termsAccepted: false,
    },
    isSubmitted: false,
  },
  propertyValuation: {
    valuationActiveStep: 0,
    maxSteps: 4,
    completedSteps: [],
    propertyDetails: {
      propertyType: 'Apartment',
      completionStatus: '',
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
    isSubmitted: false,
  },
  finalOffer: {
    isSubmitted: false,
  },
  isSubmitting: false,
  error: null,
};

const mortgageSlice = createSlice({
  name: 'mortgage',
  initialState,
  reducers: {
    // Journey Level Actions
    setActiveJourney: (state, action: PayloadAction<'preApproval' | 'propertyValuation' | 'finalOffer'>) => {
      state.activeJourney = action.payload;
    },
    completeJourney: (state, action: PayloadAction<'preApproval' | 'propertyValuation' | 'finalOffer'>) => {
      state.journeyProgress[action.payload] = true;
    },

    updatePersonalDetails: (state, action: PayloadAction<Partial<MortgageState['preApproval']['personalDetails']>>) => {
      state.preApproval.personalDetails = {
        ...state.preApproval.personalDetails,
        ...action.payload,
      };
    },

    // Pre-approval Actions
    setPreApprovalStep: (state, action: PayloadAction<number>) => {
      state.preApproval.activeStep = action.payload;
    },
    completePreApprovalStep: (state, action: PayloadAction<number>) => {
      if (!state.preApproval.completedSteps.includes(action.payload)) {
        state.preApproval.completedSteps.push(action.payload);
      }
    },

    updateCreateCustomerProfile: (
      state,
      action: PayloadAction<Partial<MortgageState['preApproval']['createCustomerProfile']>>
    ) => {
      state.preApproval.createCustomerProfile = { ...state.preApproval.createCustomerProfile, ...action.payload };
    },

    updateLoanDetails: (state, action: PayloadAction<Partial<MortgageState['preApproval']['loanDetails']>>) => {
      state.preApproval.loanDetails = { ...state.preApproval.loanDetails, ...action.payload };
    },
    updateEmploymentDetails: (
      state,
      action: PayloadAction<Partial<MortgageState['preApproval']['employmentDetails']>>
    ) => {
      state.preApproval.employmentDetails = { ...state.preApproval.employmentDetails, ...action.payload };
    },
    updateIncomeDetails: (state, action: PayloadAction<Partial<MortgageState['preApproval']['incomeDetails']>>) => {
      state.preApproval.incomeDetails = { ...state.preApproval.incomeDetails, ...action.payload };
    },

    // Property Valuation Actions
    setPropertyValuationStep: (state, action: PayloadAction<number>) => {
      state.propertyValuation.valuationActiveStep = action.payload;
    },
    completePropertyValuationStep: (state, action: PayloadAction<number>) => {
      if (!state.propertyValuation.completedSteps.includes(action.payload)) {
        state.propertyValuation.completedSteps.push(action.payload);
      }
    },
    updatePropertyDetails: (
      state,
      action: PayloadAction<Partial<MortgageState['propertyValuation']['propertyDetails']>>
    ) => {
      state.propertyValuation.propertyDetails = { ...state.propertyValuation.propertyDetails, ...action.payload };
    },
    updateAccessDetails: (
      state,
      action: PayloadAction<Partial<MortgageState['propertyValuation']['accessDetails']>>
    ) => {
      state.propertyValuation.accessDetails = { ...state.propertyValuation.accessDetails, ...action.payload };
    },
    updateDocuments: (state, action: PayloadAction<Partial<MortgageState['propertyValuation']['documents']>>) => {
      state.propertyValuation.documents = { ...state.propertyValuation.documents, ...action.payload };
    },
    updatePayment: (state, action: PayloadAction<Partial<MortgageState['propertyValuation']['payment']>>) => {
      state.propertyValuation.payment = { ...state.propertyValuation.payment, ...action.payload };
    },

    // Common Actions
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetMortgage: () => initialState,
  },
});

export const {
  setActiveJourney,
  completeJourney,
  setPreApprovalStep,
  completePreApprovalStep,
  updateLoanDetails,
  updateEmploymentDetails,
  updateIncomeDetails,
  setPropertyValuationStep,
  completePropertyValuationStep,
  updatePropertyDetails,
  updateAccessDetails,
  updateDocuments,
  updatePayment,
  updateCreateCustomerProfile,
  setSubmitting,
  setError,
  resetMortgage,
  updatePersonalDetails,
} = mortgageSlice.actions;

export default mortgageSlice.reducer;

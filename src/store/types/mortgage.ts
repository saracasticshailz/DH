// Pre-approval Types
export type EmploymentType = 'SA' | 'SE' | 'PE'; //SALAIED, SELF EMPLYEE,PENSIONER
export type LoanPreference = 'C' | 'I'; // ADCB , ISLAMIC
export type FinancingOption = 'Fixed' | 'A' | 'B';

export interface PreApprovalState {
  activeStep: number;
  maxSteps: number;
  completedSteps: number[];

  personalDetails: {
    customerName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
    poBox: string;
    countryOfResidence: string;
    state: string;
  };
  loanDetails: {
    loanPreference: LoanPreference;
    financingOption: FinancingOption;
    purchaseType: string;
    loanAmount: string;
    loanTenure: string;
    specialistCode: string;
    specialistName: string;
  };
  employmentDetails: {
    employmentType: EmploymentType;
    employerName: string;
    employerCode: string;
    joiningDate: string;
  };
  incomeDetails: {
    fixedMonthlyIncome: string;
    annualRentalIncome: string;
    otherMonthlyIncome: string;
    stayingInCompanyAccommodation: string;
    termsAccepted: boolean;
  };
  isSubmitted: boolean;
}

// Property Valuation Types
export interface PropertyValuationState {
  valuationActiveStep: number;
  maxSteps: number;
  completedSteps: number[];

  propertyDetails: {
    propertyType: 'Apartment' | 'Townhouse' | 'Villa';
    completionStatus: string;
    developmentProjectName: string;
    buildingName: string;
    locality: string;
    emirate: string;
    flatNumber: string;
    floorNumber: string;
    landmarks: string;
  };
  accessDetails: {
    contactName: string;
    email: string;
    mobileNumber: string;
    alternateMobileNumber: string;
    date: string;
    time: string;
    specialInstructions: string;
  };
  documents: {
    propertyAddress: File | null;
    titleDeed: File | null;
    salePurchaseAgreement: File | null;
    floorPlan: File | null;
    oqood: File | null;
    additionalDocuments: File | null;
  };
  payment: {
    discountCode: string;
    standardFees: number;
    vat: number;
    totalPayable: number;
  };
  termsAccepted: boolean;
  privacyAccepted: boolean;
  isSubmitted: boolean;
}

// Final Offer Types
export interface FinalOfferState {
  // Add final offer related states here
  isSubmitted: boolean;
}

// Overall Mortgage Journey State
export interface MortgageState {
  activeJourney: 'preApproval' | 'propertyValuation' | 'finalOffer';
  journeyProgress: {
    preApproval: boolean;
    propertyValuation: boolean;
    finalOffer: boolean;
  };
  preApproval: PreApprovalState;
  propertyValuation: PropertyValuationState;
  finalOffer: FinalOfferState;
  isSubmitting: boolean;
  error: string | null;
}

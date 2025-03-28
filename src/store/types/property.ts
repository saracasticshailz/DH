// Property Types

export interface PropertyDetails {
  propertyType: 'Apartment' | 'Townhouse' | 'Villa';
  completionStatus: string;
  developmentProjectName: string;
  buildingName: string;
  locality: string;
  emirate: string;
  flatNumber: string;
  floorNumber: string;
  landmarks: string;
}

export interface AccessDetails {
  contactName: string;
  email: string;
  mobileNumber: string;
  alternateMobileNumber: string;
  date: string;
  time: string;
  specialInstructions: string;
}

export interface DocumentDetails {
  propertyAddress: File | null;
  titleDeed: File | null;
  salePurchaseAgreement: File | null;
  floorPlan: File | null;
  oqood: File | null;
  additionalDocuments: File | null;
}

export interface PaymentDetails {
  discountCode: string;
  standardFees: number;
  vat: number;
  totalPayable: number;
}

export interface ValuationFormData {
  valuationActiveStep: number;
  propertyDetails: PropertyDetails;
  accessDetails: AccessDetails;
  documents: DocumentDetails;
  payment: PaymentDetails;
  termsAccepted: boolean;
  termsConditionDateTime: string;

  privacyAccepted: boolean;
  privacyPolicyDateTime: string;

  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export interface AccessDetails {
  contactName: string;
  emailAddress: string;
  mobileNumber: string;
  alternateMobile: string;
  selectedDate: string;
  selectedTime: string;
  specialInstructions: string;
  draftJobld: string;
  privacyPolicyDateTime: string;
  termsConditionDateTime: string;
}

export interface DocumentUpload {
  addressCapture: File | null;
  titleDeed: File | null;
  saleAgreement: File | null;
  floorPlan: File | null;
  oqood: File | null;
  additionalDocs: File[];
}

export interface PaymentDetails {
  discountCode: string;
  standardFees: number;
  vat: number;
  totalPayable: number;
}

export type ApplicationStatus =
  | 'Pre-approval Rejected'
  | 'Valuation In Progress'
  | 'Valuation Initiated'
  | 'Valuation Report Generated'
  | 'Pre-approval In Progress'
  | 'Pre-approval Initiated'
  | 'Valuation Payment Pending';

export interface Application {
  customerName: string;
  mobileNo: string;
  referenceNo: string;
  lastUpdated: string;
  status: ApplicationStatus;
  nextAction?: string;
  emailId: string;
  applicationNo: string;
  leadReferenceNo: string;
  applicationReferenceNo: string;
  applicationSubmittedDate: string;
  applicationStatus: string;
  customerType: string;
  orderDetails: [{ orderld: string; orderStatus: string }];
}

export const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'Pre-approval Rejected':
      return '#FFEBEE';
    case 'Valuation In Progress':
    case 'Valuation Initiated':
      return '#E3F2FD';
    case 'Valuation Report Generated':
      return '#E8F5E9';
    case 'Pre-approval In Progress':
    case 'Pre-approval Initiated':
      return '#E3F2FD';
    case 'Valuation Payment Pending':
      return '#FFF3E0';
    default:
      return '#E0E0E0';
  }
};

export const getStatusTextColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'Pre-approval Rejected':
      return '#C62828';
    case 'Valuation In Progress':
    case 'Valuation Initiated':
      return '#1565C0';
    case 'Valuation Report Generated':
      return '#2E7D32';
    case 'Pre-approval In Progress':
    case 'Pre-approval Initiated':
      return '#1565C0';
    case 'Valuation Payment Pending':
      return '#EF6C00';
    default:
      return '#424242';
  }
};

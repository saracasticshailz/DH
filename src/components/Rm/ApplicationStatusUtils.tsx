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
  applicationNo: string;
  lastUpdated: string;
  nextAction?: string;
  emailId: string;
  leadReferenceNo: string;
  applicationReferenceNo: string;
  applicationSubmittedDate: string;
  applicationStatus: string;
  customerType: string;
  orderDetails: [{ orderld: string; orderStatus: string }] | null;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PR':
      return '#FFEBEE';
    case 'OI':
      return '#E3F2FD';
    case 'VC':
      return '#E8F5E9';
    case 'NO':
      return '#E3F2FD';
    case 'DU':
      return '#FFF3E0';
    case 'CP':
      return '#FFF3E0';
    default:
      return '#E0E0E0';
  }
};

export const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'PR':
      return '#C62828';
    case 'NO':
      return '#1565C0';
    case 'VC':
      return '#2E7D32';
    case 'OI':
      return '#1565C0';
    case 'CP':
      return '#EF6C00';
    case 'DU':
      return '#EF6C00';
    default:
      return '#424242';
  }
};

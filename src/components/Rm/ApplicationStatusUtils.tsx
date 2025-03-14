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

// Generate sample data for testing
export const generateApplications = (count: number): Application[] => {
  const baseApplications: Application[] = [
    {
      customerName: 'Sasha Kennedy',
      mobileNo: '971501234567',
      referenceNo: 'BYUT0005575',
      lastUpdated: '24 Oct 2024',
      status: 'Pre-approval Rejected',
    },
    {
      customerName: 'Lochlan Norton',
      mobileNo: '971501234567',
      referenceNo: 'BYUT0005575',
      lastUpdated: '24 Oct 2024',
      status: 'Valuation In Progress',
    },
    {
      customerName: 'Veronica Douglas',
      mobileNo: '971501234567',
      referenceNo: 'BYUT0005575',
      lastUpdated: '24 Oct 2024',
      status: 'Valuation Initiated',
      nextAction: 'CONTINUE VALUATION',
    },
    // Add more base applications as needed
  ];

  const result: Application[] = [...baseApplications];

  // If we need more than the base applications, generate additional ones
  if (count > baseApplications.length) {
    const firstNames = ['John', 'Sarah', 'Mohammed', 'Fatima', 'David', 'Aisha', 'Michael', 'Priya', 'Omar', 'Emma'];
    const lastNames = [
      'Smith',
      'Al-Mansoori',
      'Patel',
      'Johnson',
      'Khan',
      'Williams',
      'Al-Hashimi',
      'Garcia',
      'Chen',
      'Kumar',
    ];
    const statuses: ApplicationStatus[] = [
      'Pre-approval Rejected',
      'Valuation In Progress',
      'Valuation Initiated',
      'Valuation Report Generated',
      'Pre-approval In Progress',
      'Pre-approval Initiated',
      'Valuation Payment Pending',
    ];

    const nextActions = {
      'Valuation Initiated': 'CONTINUE VALUATION',
      'Pre-approval Initiated': 'CONTINUE PRE-APPROVAL',
      'Valuation Payment Pending': 'COMPLETE PAYMENT',
    };

    for (let i = baseApplications.length; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      result.push({
        customerName: `${firstName} ${lastName}`,
        mobileNo: `97150${Math.floor(1000000 + Math.random() * 9000000)}`,
        referenceNo: `BYUT${Math.floor(1000000 + Math.random() * 9000000)}`,
        lastUpdated: '24 Oct 2024',
        status,
        nextAction: nextActions[status as keyof typeof nextActions],
      });
    }
  }

  return result;
};

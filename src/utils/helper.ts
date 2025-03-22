export const getLoanStatusText = (status: string) => {
  if (!status) return 'Not Available';

  switch (status) {
    //@ts-ignore
    case 'PP':
      return 'Pending Pre-approval';
    case 'PR':
      return 'Pre-approval Rejected';
    case 'PC':
      return 'Pre-approval Completed';
    case 'NO':
      return 'Valuation Initiated';
    case 'UP':
      return 'Unapproved Property';
    case 'CP':
      return 'Pending Consent and Payment';
    case 'DU':
      return 'Pending Consent and Payment';
    case 'OI':
      return 'Valuation In-Progress';
    case 'VC':
      return 'Valuation Completed';
    default:
      return status;
  }
};

import { RootState } from '../index';

// Get all preApproval data
export const selectedPreApprovalData = (state: RootState) => state.mortgage.preApproval;

// Get specific parts of preApproval data
export const selectLoanDetails = (state: RootState) => state.mortgage.preApproval.loanDetails;
export const selectEmploymentDetails = (state: RootState) => state.mortgage.preApproval.employmentDetails;
export const selectIncomeDetails = (state: RootState) => state.mortgage.preApproval.incomeDetails;
export const selectedPreApprovalProgress = (state: RootState) => ({
  activeStep: state.mortgage.preApproval.activeStep,
  maxSteps: state.mortgage.preApproval.maxSteps,
  completedSteps: state.mortgage.preApproval.completedSteps,
  isSubmitted: state.mortgage.preApproval.isSubmitted,
});

'use client';

import { useEffect } from 'react';
import { completeJourney } from '@/store/slices/MortgageSlice';
import { useAppSelector, useAppDispatch } from './redux';

export const useMortgageJourney = () => {
  const dispatch = useAppDispatch();
  const { activeJourney, journeyProgress, preApproval, propertyValuation, finalOffer } = useAppSelector(
    (state: any) => state.mortgage
  );

  useEffect(() => {
    // Validate Pre-approval Journey
    if (
      preApproval.loanDetails.loanAmount &&
      preApproval.employmentDetails.employerName &&
      preApproval.incomeDetails.termsAccepted &&
      preApproval.completedSteps.length === preApproval.maxSteps
    ) {
      dispatch(completeJourney('preApproval'));
    }

    // Validate Property Valuation Journey
    if (
      propertyValuation.propertyDetails.propertyType &&
      propertyValuation.accessDetails.contactName &&
      propertyValuation.documents.titleDeed &&
      propertyValuation.payment.totalPayable > 0 &&
      propertyValuation.completedSteps.length === propertyValuation.maxSteps
    ) {
      dispatch(completeJourney('propertyValuation'));
    }
  }, [dispatch, preApproval, propertyValuation]);

  // Calculate overall progress
  const totalSteps = 3; // preApproval, propertyValuation, finalOffer
  const completedSteps = Object.values(journeyProgress).filter(Boolean).length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return {
    activeJourney,
    journeyProgress,
    overallProgress,
    canProceedToPropertyValuation: journeyProgress.preApproval,
    canProceedToFinalOffer: journeyProgress.propertyValuation,
    isComplete: journeyProgress.finalOffer,
  };
};

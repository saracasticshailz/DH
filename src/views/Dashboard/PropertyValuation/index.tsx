'use client';

import React from 'react';
import { Container, Grid2 } from '@mui/material';
import { useSelector } from 'react-redux';
import ImageProgressBar from '@/components/common/ImageProgressBar/ImageProgressBar';
import PropertyDetailsForm from './PropertyDetailsForm';
import DocumentUploadForm from './DocUpload/index';
import ReviewForm from './Review/index';
import PaymentForm from './PaymentForm/index';
import type { RootState } from '@/store';
import AccessDetailsForm from './AccessDetailsForm';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { useTranslation } from 'react-i18next';

const PropertyValuation: React.FC = () => {
  const activeStep = useSelector((state: RootState) => state.valuation.valuationActiveStep);
  const { t } = useTranslation();

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <PropertyDetailsForm />;
      case 1:
        return <AccessDetailsForm />;
      case 2:
        return <DocumentUploadForm />;
      case 3:
        return <ReviewForm />;
      case 4:
        return <PaymentForm />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <AuthHeader />

        <Grid2 container spacing={3} marginTop={2}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <ImageProgressBar
              currentStep={activeStep + 1}
              totalSteps={5}
              title={t('imageProgressBar.propertyValuation')}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>{renderStepContent()}</Grid2>
        </Grid2>
        <AuthFooter />
      </Container>
    </Container>
  );
};

export default React.memo(PropertyValuation);

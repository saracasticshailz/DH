'use client';

//import type React from 'react';
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useTranslation } from 'react-i18next';
import {
  updatePrivacyAcceptance,
  updateTermsAcceptance,
  setValuationActiveStep,
  selectPrivacyDateTime,
  selectTermsDateTime,
  updateTermsAcceptanceDateTime,
  updatePrivacyAcceptanceDateTime,
} from '@/store/slices/ValuationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectAuth } from '@/store/slices/CustomerAuthSlice';
import { generateJsonOrderUpdate } from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationOrder';
//@ts-ignore
import modNetwork from '../../../../../lib/konyLib/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import { getFormattedDateTimeWithIntl } from '@/utils';

const ReviewForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  // const [termsConditionDateTime, setTermsConditionDateTime] = useState('');
  // const [privacyPolicyDateTime, setPrivacyPolicyDateTime] = useState('');

  const termsConditionDateTime = useAppSelector(selectTermsDateTime);
  const privacyPolicyDateTime = useAppSelector(selectPrivacyDateTime);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userDetails = useAppSelector(selectAuth);
  const { propertyDetails, accessDetails, documents, termsAccepted, privacyAccepted } = useSelector(
    (state: RootState) => state.valuation
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (termsAccepted && privacyAccepted) {
      const reviewDetails = {
        leadRefNo: userDetails.lapsRefNumber,
        sourceRefNo: userDetails.applicationRefNumber,
        valuationOrderRefNo: 'VBN-ZKWC',
        paymentRefNo: '',
        orderRemarks: 'Customer Consent Recevied',
        orderStatus: 'DU',
        loanApplicationNo: 'BYUT00005649',
        rmCode: 'C106794',
        journeyType: 'CUSTOMER',
        creditVerificationConsentDateTime: '',
        privacyPolicyConsentDateTime: termsConditionDateTime,
        generalTermsConsentDateTime: privacyPolicyDateTime,
        cpsTermsConsentDateTime: '',
        kfsConsentDateTime: '',
        uaeFtsRequestConsentDateTime: '',
      };
      //apiCallOnContinue(reviewDetails,API.PROPERTY_VALUATION_CUST_ORDER_UPDATE,"update");
      dispatch(setValuationActiveStep(4)); // Move to Payment step
    }
  };

  const apiCallOnContinue = async (finalJson: any, apiName: string, type: string) => {
    /* type may be fetch , upload or remove */
    modNetwork(
      apiName,
      { ...finalJson },
      (res: any) => {
        console.log('PROPERTY_VALUATION_Document', res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('PROPERTY_VALUATION_REVIEW response ', res);
          /* empty */
          dispatch(setValuationActiveStep(4)); // Move to Payment step
        } else {
          // navigate('/Dashboard');

          // Create new state
          //setDialogText(res.errMsg_EN);
          console.log('Error Message ', res.errmsg);

          //setDialogTitle('ERROR')
          //setDialogPrimaryAction('OK');
          //setShowAlert(true);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const handleBack = () => {
    dispatch(setValuationActiveStep(2)); // Go back to Documents
  };

  const handleEdit = (step: number) => {
    dispatch(setValuationActiveStep(step));
  };

  const renderSection = (title: string, data: Record<string, any>, step?: number) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {step && (
          <Button
            startIcon={<Edit />}
            onClick={() => handleEdit(step)}
            size="small"
            sx={{
              color: '#273239',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#E31B23',
              },
            }}
          >
            {t('review.edit')}
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="subtitle2" color="textSecondary">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Typography>{value instanceof File ? value.name : value || '-'}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            mb: { xs: 2, md: 4 },
            color: '#111827',
            fontWeight: 600,
            px: { xs: 2, md: 0 },
            marginLeft: 1.25,
          }}
        >
          {t('review.title')}
        </Typography>

        {propertyDetails && renderSection('Property Details', propertyDetails)}
        {accessDetails && renderSection('Access Details', accessDetails, 1)}
        {documents && 0 && renderSection('Documents', documents, 2)}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => {
                  dispatch(updateTermsAcceptanceDateTime(getFormattedDateTimeWithIntl()));
                  dispatch(updateTermsAcceptance(e.target.checked));
                }}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                {t('review.iAgreeToThe')}
                <Link href="#" color="primary" sx={{ color: '#E31B23' }}>
                  {t('review.termsAndConditions')}
                </Link>
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAccepted}
                onChange={(e) => {
                  dispatch(updatePrivacyAcceptanceDateTime(getFormattedDateTimeWithIntl()));

                  dispatch(updatePrivacyAcceptance(e.target.checked));
                }}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                {t('review.iAgreeToThe')}{' '}
                <Link href="#" color="primary" sx={{ color: '#E31B23' }}>
                  {t('review.adcbPrivacyPolicy')}
                </Link>
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderColor: '#BEC1C4',
              color: '#273239',
              '&:hover': {
                borderColor: '#273239',
                bgcolor: 'transparent',
              },
            }}
          >
            {t('preApproval.incomeDetails.buttons.back')}
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#BEC1C4',
                color: '#273239',
                '&:hover': {
                  borderColor: '#273239',
                  bgcolor: 'transparent',
                },
              }}
            >
              {t('preApproval.incomeDetails.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!termsAccepted || !privacyAccepted}
              sx={{
                bgcolor: '#E31B23',
                '&:hover': {
                  bgcolor: '#CC181F',
                },
                '&:disabled': {
                  bgcolor: '#F5F5F5',
                  color: '#BEC1C4',
                },
              }}
            >
              {t('preApproval.incomeDetails.buttons.continue')}
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default ReviewForm;

'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { AppLoading, CommonDialog } from '@/components';
import { usePaymentCheckout } from '@/hooks/usePaymentCheckout';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { useAppSelector } from '@/hooks/redux';
import { selectApplicationDetails } from '@/store/slices/CustomerAuthSlice';
import { selectAccessDetails, selectPrivacyAccepted, selectTermsAccepted } from '@/store/slices/ValuationSlice';

interface PaymentCallbackParams {
  payment_id: string | null;
  trans_id: string | null;
  order_id: string | null;
  hash: string | null;
  [key: string]: string | null;
}

type PaymentStatus = 'processing' | 'success' | 'failed' | 'invalid';

const PaymentLanding: React.FC = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentCallbackParams | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('Payment Successful');
  const [dialogText, setDialogText] = useState<string>('Your payment has been processed successfully.');
  const [dialogPrimaryAction, setDialogPrimaryAction] = useState<string>('Continue to Dashboard');

  const { getQueryParams, validatePaymentOutputHash } = usePaymentCheckout();
  const accessDetails = useAppSelector(selectAccessDetails);
  const termsAccepted = useAppSelector(selectTermsAccepted);
  const privacyAccepted = useAppSelector(selectPrivacyAccepted);
  // const applicationDetails = useAppSelector(selectApplicationDetails);
  const updatePaymentStatus = async (params: PaymentCallbackParams, isValid: boolean) => {
    try {
      console.log('Updating payment status in backend:', {
        orderId: params.order_id,
        transactionId: params.trans_id,
        paymentId: params.payment_id,
        status: isValid ? 'success' : 'failed',
      });

      //   {
      //     "bankReferenceId":"",
      //     "autoAllocateJobs": true,
      //     "fees": "3052",
      //     "leadRefNo":"",
      //     "valuationOrderRefNo":"",
      //     "journeyType":"",
      //     "paymentRefNo":"",
      //     "creditVerificationConsentDateTime": "",
      //     "privacyPolicyConsentDateTime": "2024-12-20 11:08:32",
      //     "generalTermsConsentDateTime": "2024-12-20 11:08:31",
      //     "cpsTermsConsentDateTime": "",
      //     "kfsConsentDateTime": "",
      //     "uaeFtsRequestConsentDateTime": ""

      // }

      modNetwork(
        API.SUBMIT_VALUATION_ORDER_CONFIRMATION,
        {
          bankReferenceId: params.order_id, // loanApplicationNo
          autoAllocateJobs: true,
          fees: applicationDetails.feeAmount,
          leadRefNo: applicationDetails.applicationRefNumber, // app ref no
          valuationOrderRefNo: accessDetails.draftJobld, //draftOrderId
          journeyType: 'CUSTOMER', // CUSTOMER
          paymentRefNo: params.payment_id,
          creditVerificationConsentDateTime: '', //skip
          privacyPolicyConsentDateTime: privacyAccepted, // review
          generalTermsConsentDateTime: termsAccepted, // Review
          cpsTermsConsentDateTime: '', //skip
          kfsConsentDateTime: '', //skip
          uaeFtsRequestConsentDateTime: '', //skip
        },

        (res: any) => {
          if (res.oprstatus == 0 && res.returnCode == 0) {
            navigateToDashboard();
          } else {
            console.log('ERROR', res);
          }
        },
        '',
        '',
        '',
        MOD_CONSTANTS.REGISTER
      );

      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  };

  const navigateToDashboard = () => {
    navigate('/Dashboard');
  };

  const applicationDetails = useAppSelector(selectApplicationDetails);

  useEffect(() => {
    const processPaymentCallback = async () => {
      setIsLoading(true);

      try {
        const params: any = getQueryParams(window.location.href);
        setPaymentData(params);
        console.log(params);

        if (!params.payment_id || !params.trans_id || !params.order_id || !params.hash) {
          setStatus('invalid');
          setErrorMessage('Missing required payment parameters');
          return;
        }

        // payment_id: string | null;
        // trans_id: string | null;
        // order_id: string | null;
        // hash: string | null;
        // amount?: string | null;
        // currency?: string | null;
        // description?: string | null;

        const paymentParams = {
          payment_id: status !== 'success' ? '' : params.payment_id,
          trans_id: params.trans_id,
          order_id: applicationDetails.orderId,
          hash: params.hash,
          amount: applicationDetails.feeAmount,
          currency: 'AED',
          description: applicationDetails.paymentDescription,
        };

        const isValid = validatePaymentOutputHash(paymentParams);

        if (isValid) {
          const updated = await updatePaymentStatus(params, true);

          if (updated) {
            setStatus('success');

            setDialogTitle('Payment Successful');
            setDialogText(
              `Your payment for order ${params.order_id} has been processed successfully. Transaction ID: ${params.trans_id}`
            );
            setDialogPrimaryAction('Continue to Dashboard');

            // Show the success dialog after a short delay
            setTimeout(() => {
              setShowAlert(true);
            }, 500);
          } else {
            setStatus('failed');
            setErrorMessage('Failed to update payment status');
          }
        } else {
          setStatus('invalid');
          setErrorMessage('Invalid payment verification hash');
          await updatePaymentStatus(params, false);
        }
      } catch (error) {
        setStatus('failed');
        setErrorMessage('An unexpected error occurred');
        console.error('Error processing payment callback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentCallback();
  }, [window.location.href]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      {isLoading && <AppLoading />}
      {/* Success Dialog */}
      <CommonDialog
        open={showAlert}
        onClose={(): void => {
          setShowAlert(false);
        }}
        onPrimaryAction={(): void => {
          setShowAlert(false);
          navigateToDashboard(); // Navigate to dashboard when dialog is confirmed
        }}
        title={dialogTitle}
        description={dialogText}
        primaryButtonText={dialogPrimaryAction}
        secondaryButtonText={''}
      />
    </Box>
  );
};

export default PaymentLanding;

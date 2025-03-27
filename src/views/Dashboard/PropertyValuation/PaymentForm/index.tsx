'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Typography, Paper, Divider, Alert, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updatePayment, setValuationActiveStep, applyDiscount, calculateTotals } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import { AppButton } from '@/components';
import TextInput from '@/components/common/TextInput';
import { setPreApprovalStep } from '@/store/slices/MortgageSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectApplicationDetails,
  selectAuth,
  updateApplicationDetailsAfterPayment,
} from '@/store/slices/CustomerAuthSlice';
import {
  generateJsonMortgageDiscount,
  generateJsonMortgagePricing,
} from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationMortgage';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import { usePaymentCheckout } from '@/hooks/usePaymentCheckout';
import CryptoJS from 'crypto-js';

const validationSchema = Yup.object({
  discountCode: Yup.string().max(20, 'Discount code must be 20 characters or less'),
});

const PaymentForm: React.FC = () => {
  console.log('PaymentForm PaymentForm  render ');
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showDiscountMessage, setShowDiscountMessage] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const payment = useSelector((state: RootState) => state.valuation.payment);
  const [discountError, setDiscountError] = React.useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = React.useState<boolean>(false);
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);
  const userDetails = useAppSelector(selectAuth);
  const [standardFeeText, setStandardFeeText] = useState('');
  const [vatText, setVatText] = useState('');
  const [totalFeeText, setTotalFeeText] = useState('');

  const { initiateCheckout }: any = usePaymentCheckout();
  const applicationDetails = useAppSelector(selectApplicationDetails);

  // const initiateCheckout = async (): Promise<void> => {
  //   try {
  //     // Calculate the hash (SHA1 of the reference number + fee amount + password)
  //     const hash = generateHash('BYUT34343', '2000.00AEDVALUATIONTESTFEE', 'aa81310cb6a27b222d13658927d1a31e');

  //     // Construct the body of the request
  //     const checkoutData = {
  //       merchant_key: 'c61ff088-fd93-11ef-9640-3210e0c8f150',
  //       success_url: 'https://bling.com/', // Success URL-landing -> order confirmation -> payment success -> Dashboard -> update payment/journey status to 'OI'
  //       cancel_url: 'https://google.com/', // Cancel URL
  //       operation: 'purchase', // Operation type
  //       hash: hash, // Hash for security and verification
  //       order: {
  //         number: 'BYUT34343', // Order number
  //         amount: '2000.00', // Order amount
  //         currency: 'AED', // Currency type
  //         description: 'VALUATIONTESTFEE', // Order description
  //       },
  //     };

  //     // Send the POST request to the backend (your server)
  //     const response = await fetch('http://localhost:3003/initiate-checkout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(checkoutData),
  //     });

  //     // Check if the response is successful
  //     if (response.ok) {
  //       const data = await response.json();

  //       // If the payment URL is returned from the server, redirect the client to it
  //       if (data.payment_url) {
  //         window.location.href = data.payment_url; // Redirect to the payment URL returned from the backend
  //       } else {
  //         console.error('Failed to retrieve payment URL:', data.error_message);
  //       }
  //     } else {
  //       const data = await response.json();
  //       console.error('Error:', data.error_message);
  //     }
  //   } catch (error) {
  //     console.error('Request failed:', error);
  //   }
  // };

  const generateHash = (referenceNumber: string, feeAmount: string, password: string): string => {
    const stringToHash = referenceNumber + feeAmount + password;
    //return SHA1(stringToHash).toString().toUpperCase();

    const md5Encoded = CryptoJS.MD5(stringToHash.toUpperCase()).toString(CryptoJS.enc.Hex);

    // Step 2: SHA1 of the MD5 encoded string
    const sha1Hash = CryptoJS.SHA1(md5Encoded);

    const result = CryptoJS.enc.Hex.stringify(sha1Hash);

    // Step 3: Return the SHA1 result in uppercase
    return result;
  };

  const formik = useFormik({
    initialValues: payment,
    validationSchema,
    onSubmit: async (values) => {
      //dispatch(updatePayment(values));
      //dispatch(setValuationActiveStep(5)); // Move to completion/success step
      dispatch(
        updateApplicationDetailsAfterPayment({
          feeAmount: totalFeeText,
          paymentDescription: 'MORTAGE VALUATION FEE',
          loanApplicationStatus: 'OI',
        })
      );

      initiateCheckout(applicationDetails.lapsApplicationNo, totalFeeText, 'AED', 'MORTAGE VALUATION FEE');
    },
  });

  useEffect(() => {
    console.log('userDetails useeffect ', userDetails);

    const jsonObject = {
      proprtyType: 'VILLA',
      CustomerCategory: 'ASPIRE',
      applicationRefNumber: userDetails.applicationRefNumber,
      journeyType: 'VALUATION',
    };
    apiCallOnApply(jsonObject, API.PROPERTY_VALUATION_MORTGAGE_PRICING, 'price');
  }, [userDetails]);

  const apiCallOnApply = async (finalJson: any, apiName: string, type: string) => {
    /* type may be fetch , upload or remove */
    modNetwork(
      apiName,
      { ...finalJson },
      (res: any) => {
        console.log('PROPERTY_VALUATION_DISCOUNT', res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('PROPERTY_VALUATION_DISCOUNT response ', res);
          /* empty */
          if (type === 'price') {
            setShowDiscountMessage(true);
            const message = `🎉 ${res.discountPercentage}% OFF - LIMITED TIME OFFER! 🎉 Use Code: ${res.discountCode} at checkout to get ${res.discountPercentage}% off your valuation fee! Hurry, ${'\n'}offer ends soon!`;
            setDiscountMessage(message);
            console.log('PROPERTY_VALUATION_DISCOUNT res.standardFee ', res.standardFee);
            setStandardFeeText(res.standardFee);
            const vat: any = (parseInt(res.standardFee) * parseInt(res.vat)) / 100;
            setVatText(vat);
            console.log('PROPERTY_VALUATION_DISCOUNT VAT ', vat);
            const ab = (parseFloat(res.standardFee) + parseFloat(vat)).toFixed(2);
            setTotalFeeText(ab);
          } else if (type === 'discount') {
            setShowDiscountMessage(false);
            setDiscountSuccess(true);

            const dicountPrice = (parseFloat(res.discountCode) * (parseFloat(res.discountPercentage) / 100)).toFixed(2);
            setStandardFeeText(dicountPrice);
            const vat: any = (parseFloat(dicountPrice) * parseFloat('5')) / 100;
            setVatText(vat);
            console.log('PROPERTY_VALUATION_DISCOUNT VAT ', vat);
            const ab = (parseFloat(dicountPrice) + parseFloat(vat)).toFixed(2);
            setTotalFeeText(ab);
          }

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
    dispatch(setPreApprovalStep(preApproval.activeStep + 1)); // Go back to Employment Details
  };

  const handleApplyDiscount = async () => {
    setDiscountError(null);
    setDiscountSuccess(false);
    console.log('apply code ', formik.values.discountCode);
    if (!formik.values.discountCode) {
      setDiscountError(t('dashboardScreen.valuation.payment.errors.noDiscountCode'));
      return;
    }

    try {
      // Here you would typically validate the discount code with an API
      // For now, we'll simulate a 10% discount
      const discountAmount = payment.standardFees * 0.1;
      //dispatch(applyDiscount({ discountAmount }));
      //dispatch(calculateTotals());
      const jsonObject = {
        proprtyType: 'VILLA',
        CustomerCategory: 'ASPIRE',
        discountCode: formik.values.discountCode,
        journeyType: 'VALUATION',
      };
      apiCallOnApply(jsonObject, API.PROPERTY_VALUATION_MORTGAGE_DISCOUNT, 'discount');
    } catch (error) {
      setDiscountError(t('valuation.payment.errors.invalidDiscount'));
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('valuation.payment.title')}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {t('valuation.payment.description')}
        </Typography>

        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <TextInput
              label={t('valuation.payment.discountCode')}
              name="discountCode"
              autoCapitalize="characters"
              value={formik.values.discountCode.toUpperCase()}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.discountCode) || Boolean(discountError)}
              helperText={formik.errors.discountCode || discountError || ''}
              InputProps={{
                endAdornment: (
                  <AppButton
                    onClick={handleApplyDiscount}
                    size="small"
                    disabled={!formik.values.discountCode || discountSuccess}
                    sx={{ ml: 1 }}
                  >
                    {t('valuation.payment.applyDiscount')}
                  </AppButton>
                ),
              }}
            />
          </Grid>
        </Grid>
        {showDiscountMessage && discountMessage.length > 0 && (
          <Chip
            label={discountMessage}
            sx={{
              bgcolor: '#FFF3E9',
              color: '#E86B1C',
              height: 'auto',
              whiteSpace: 'normal',
              //height: '24px',
              fontSize: '12px',
              fontWeight: 500,
              ml: 2,
              '& .MuiChip-label': {
                px: 2,
                height: 'auto',
                whiteSpace: 'normal',
              },
            }}
          />
        )}
        {discountSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t('valuation.payment.discountApplied')}
          </Alert>
        )}

        <Paper sx={{ mt: 3, p: 6, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography>{t('valuation.payment.standardFees')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="right">AED {standardFeeText}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{t('valuation.payment.vat')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="right">AED {vatText}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ my: 1 }}>
                <Divider />
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6">{t('valuation.payment.totalPayable')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="right" sx={{ color: '#E31B23' }}>
                AED {`${totalFeeText}`}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppButton onClick={handleBack} withBorder fullWidth={false}>
              {t('preApproval.incomeDetails.buttons.back')}
            </AppButton>
            <AppButton withBorder fullWidth={false}>
              {t('preApproval.incomeDetails.buttons.cancel')}
            </AppButton>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <AppButton fullWidth={false} type="submit">
              {t('preApproval.incomeDetails.buttons.continue')}
            </AppButton>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default React.memo(PaymentForm);

'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Typography, Paper, Divider, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updatePayment, setValuationActiveStep, applyDiscount, calculateTotals } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import { AppButton } from '@/components';
import TextInput from '@/components/common/TextInput';
import { setPreApprovalStep } from '@/store/slices/MortgageSlice';
import { useAppSelector } from '@/hooks/redux';

const validationSchema = Yup.object({
  discountCode: Yup.string().max(20, 'Discount code must be 20 characters or less'),
});

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const payment = useSelector((state: RootState) => state.valuation.payment);
  const [discountError, setDiscountError] = React.useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = React.useState<boolean>(false);
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  const formik = useFormik({
    initialValues: payment,
    validationSchema,
    onSubmit: async (values) => {
      dispatch(updatePayment(values));
      dispatch(setValuationActiveStep(5)); // Move to completion/success step
    },
  });

  const handleBack = () => {
    dispatch(setPreApprovalStep(preApproval.activeStep + 1)); // Go back to Employment Details
  };

  const handleApplyDiscount = async () => {
    setDiscountError(null);
    setDiscountSuccess(false);

    if (!formik.values.discountCode) {
      setDiscountError(t('dashboardScreen.valuation.payment.errors.noDiscountCode'));
      return;
    }

    try {
      // Here you would typically validate the discount code with an API
      // For now, we'll simulate a 10% discount
      const discountAmount = payment.standardFees * 0.1;
      dispatch(applyDiscount({ discountAmount }));
      dispatch(calculateTotals());
      setDiscountSuccess(true);
    } catch (error) {
      setDiscountError(t('dashboardScreen.valuation.payment.errors.invalidDiscount'));
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboardScreen.valuation.payment.title')}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {t('dashboardScreen.valuation.payment.description')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextInput
              // label={t('dashboardScreen.valuation.payment.discountCode')}
              // name="discountCode"
              value={formik.values.discountCode}
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
                    {t('dashboardScreen.valuation.payment.applyDiscount')}
                  </AppButton>
                ),
              }}
            />
          </Grid>
        </Grid>

        {discountSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t('valuation.payment.discountApplied')}
          </Alert>
        )}

        <Paper sx={{ mt: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography>{t('valuation.payment.standardFees')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="right">AED {formik.values.standardFees.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{t('valuation.payment.vat')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="right">AED {formik.values.vat.toFixed(2)}</Typography>
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
                AED {formik.values.totalPayable.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <AppButton onClick={handleBack} withBorder>
            {t('common.back')}
          </AppButton>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppButton withBorder>{t('common.cancel')}</AppButton>
            <AppButton type="submit">{t('common.continue')}</AppButton>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default PaymentForm;

'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Box,
  InputAdornment,
  FormControl,
  FormLabel,
  FormHelperText,
  CardContent,
  Grid2 as Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { updateIncomeDetails, setPreApprovalStep } from '@/store/slices/MortgageSlice';

import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';
import { COLORS } from '@/theme/colors';
import { RootState } from '@/store';

const validationSchema = (t: any) =>
  Yup.object({
    fixedMonthlyIncome: Yup.number()
      .min(0, t('preApproval.incomeDetails.fixedMonthlyIncome.errors.min'))
      .max(99000000, t('preApproval.incomeDetails.fixedMonthlyIncome.errors.max'))
      .required(t('preApproval.incomeDetails.fixedMonthlyIncome.errors.required')),
    annualRentalIncome: Yup.number()
      .min(0, t('preApproval.incomeDetails.annualRentalIncome.errors.min'))
      .max(99000000, t('preApproval.incomeDetails.annualRentalIncome.errors.max'))
      .required(t('preApproval.incomeDetails.annualRentalIncome.errors.required')),
    otherMonthlyIncome: Yup.number()
      .min(0, t('preApproval.incomeDetails.otherMonthlyIncome.errors.min'))
      .max(9000000, t('preApproval.incomeDetails.otherMonthlyIncome.errors.max'))
      .required(t('preApproval.incomeDetails.otherMonthlyIncome.errors.required')),
    stayingInCompanyAccommodation: Yup.string().required(t('preApproval.incomeDetails.accommodation.errors.required')),
    termsAccepted: Yup.boolean()
      .oneOf([true], t('preApproval.incomeDetails.termsAndConditions.errors.accept'))
      .required(t('preApproval.incomeDetails.termsAndConditions.errors.required')),
  });

export default function IncomeDetailsForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const incomeDetails = useAppSelector((state: any) => state.mortgage.preApproval.incomeDetails);
  const [submitted, setSubmitted] = useState(false);
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  const handleSubmit = (values: any) => {
    dispatch(updateIncomeDetails(values));
    // // dispatch(completeJourney('preApproval'));
    // // setSubmitted(true);
    dispatch(setPreApprovalStep(preApproval.activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setPreApprovalStep(preApproval.activeStep + 1)); // Go back to Employment Details
  };

  return (
    <Container sx={{ backgroundColor: COLORS.WHITE_SECONDARY, borderRadius: 2.5 }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
          {t('preApproval.incomeDetails.title')}
        </Typography>

        <Formik
          initialValues={incomeDetails}
          validationSchema={() => validationSchema(t)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }: any) => (
            <Form>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="fixedMonthlyIncome">
                    {({ field }: any) => (
                      <TextInput
                        {...field}
                        fullWidth
                        type="number"
                        label={t('preApproval.incomeDetails.fixedMonthlyIncome.fixedMonthlyIncome')}
                        placeholder={t('preApproval.incomeDetails.fixedMonthlyIncome.placeholder')}
                        error={touched.fixedMonthlyIncome && Boolean(errors.fixedMonthlyIncome)}
                        helperText={
                          (touched.fixedMonthlyIncome && errors.fixedMonthlyIncome) ||
                          t('preApproval.incomeDetails.fixedMonthlyIncome.helperText')
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {t('preApproval.incomeDetails.fixedMonthlyIncome.currency')}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl
                    component="fieldset"
                    error={touched.stayingInCompanyAccommodation && Boolean(errors.stayingInCompanyAccommodation)}
                  >
                    <FormLabel component="legend" sx={{ mb: 1 }}>
                      {t('preApproval.incomeDetails.accommodation.label')}
                    </FormLabel>
                    <Field name="stayingInCompanyAccommodation">
                      {({ field }: any) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel
                            value="Y"
                            control={<Radio />}
                            label={t('preApproval.incomeDetails.accommodation.options.yes')}
                          />
                          <FormControlLabel
                            value="N"
                            control={<Radio />}
                            label={t('preApproval.incomeDetails.accommodation.options.no')}
                          />
                        </RadioGroup>
                      )}
                    </Field>
                    {touched.stayingInCompanyAccommodation && errors.stayingInCompanyAccommodation && (
                      <FormHelperText>{errors.stayingInCompanyAccommodation}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Second Row */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="annualRentalIncome">
                    {({ field }: any) => (
                      <TextInput
                        {...field}
                        fullWidth
                        label={t('preApproval.incomeDetails.annualRentalIncome.annualRentalIncome')}
                        type="number"
                        placeholder={t('preApproval.incomeDetails.annualRentalIncome.placeholder')}
                        error={touched.annualRentalIncome && Boolean(errors.annualRentalIncome)}
                        helperText={touched.annualRentalIncome && errors.annualRentalIncome}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {t('preApproval.incomeDetails.annualRentalIncome.currency')}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Other Monthly Income */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="otherMonthlyIncome">
                    {({ field }: any) => (
                      <TextInput
                        {...field}
                        fullWidth
                        label={t('preApproval.incomeDetails.otherMonthlyIncome.otherMonthlyIncome')}
                        type="number"
                        placeholder={t('preApproval.incomeDetails.otherMonthlyIncome.placeholder')}
                        error={touched.otherMonthlyIncome && Boolean(errors.otherMonthlyIncome)}
                        helperText={
                          (touched.otherMonthlyIncome && errors.otherMonthlyIncome) ||
                          t('preApproval.incomeDetails.otherMonthlyIncome.helperText')
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {t('preApproval.incomeDetails.otherMonthlyIncome.currency')}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Terms & Conditions */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Field name="termsAccepted">
                    {({ field }: any) => (
                      <FormControl error={touched.termsAccepted && Boolean(errors.termsAccepted)}>
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label={
                            <Typography>
                              {t('preApproval.incomeDetails.termsAndConditions.text')}{' '}
                              <Typography component="a" href="#" sx={{ color: 'error.main', textDecoration: 'none' }}>
                                {t('preApproval.incomeDetails.termsAndConditions.link')}
                              </Typography>
                            </Typography>
                          }
                        />
                        {touched.termsAccepted && errors.termsAccepted && (
                          <FormHelperText>{errors.termsAccepted}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex' }}>
                    <AppButton fullWidth={false} withBorder onClick={handleBack}>
                      {t('preApproval.incomeDetails.buttons.back')}
                    </AppButton>
                    <AppButton borderless onClick={() => window.location.reload()}>
                      {t('preApproval.incomeDetails.buttons.cancel')}
                    </AppButton>
                  </Box>

                  <AppButton fullWidth={false} type="submit" disabled={submitted}>
                    {t('preApproval.incomeDetails.buttons.submit')}
                  </AppButton>
                </Box>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Container>
  );
}

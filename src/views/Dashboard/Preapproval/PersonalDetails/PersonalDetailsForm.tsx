'use client';

import type React from 'react';
import { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Grid, MenuItem } from '@mui/material';
import { Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { setPreApprovalStep, updatePersonalDetails } from '@/store/slices/MortgageSlice';

const PersonalDetailsForm: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);

  // Get relevant state from Redux
  const { preApproval } = useSelector((state: RootState) => state.mortgage);

  // Default empty values to prevent the "Cannot convert undefined or null to object" error
  const defaultPersonalDetails = {
    customerName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    poBox: '',
    state: '',
    countryOfResidence: '',
  };

  // Use the personalDetails from Redux if it exists, otherwise use the default empty values
  const personalDetails = preApproval?.personalDetails || defaultPersonalDetails;

  // Validation schema
  const validationSchema = Yup.object({
    customerName: Yup.string().required('Customer name is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    nationality: Yup.string().required('Nationality is required'),
    passportNumber: Yup.string().required('Passport number is required'),
    passportExpiry: Yup.string().required('Passport expiry date is required'),
    poBox: Yup.string(),
    state: Yup.string().required('State is required'),
    countryOfResidence: Yup.string().required('Country of residence is required'),
  });

  const handleSubmit = (values: any) => {
    console.log('handleSubmit values ', values);

    setSubmitted(true);
    dispatch(updatePersonalDetails(values));
    dispatch(setPreApprovalStep(preApproval.activeStep + 1));
    // Uncomment these lines when you're ready to move to the next step
    // dispatch(completePropertyValuationStep(preApproval.activeStep));
    // dispatch(setPropertyValuationStep(preApproval.activeStep + 1));
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        backgroundColor: 'white',
        borderRadius: {
          xs: '12px',
          md: '16px',
        },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: '22px',
            sm: '24px',
            md: '28px',
          },
          fontWeight: 600,
          color: '#273239',
          mb: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {t('preApproval.incomeDetails.personalDetails.title')}
      </Typography>

      <Formik
        initialValues={personalDetails}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
          <Form>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                margin: 0,
              }}
            >
              {/* Customer Name */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="customerName">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.customerName')}
                      placeholder={t('preApproval.incomeDetails.personalDetails.enterNameAsPerPassport')}
                      fullWidth
                      error={touched.customerName && Boolean(errors.customerName)}
                      helperText={touched.customerName && errors.customerName}
                    />
                  )}
                </Field>
              </Grid>

              {/* Gender */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="gender">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.gender')}
                      placeholder={t('preApproval.incomeDetails.personalDetails.pleaseSelect')}
                      select
                      fullWidth
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="M">Male</MenuItem>
                      <MenuItem value="F">Female</MenuItem>
                    </TextInput>
                  )}
                </Field>
              </Grid>

              {/* Date of Birth */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="dateOfBirth">
                  {({ field }: any) => (
                    <CustomDatePicker
                      value={values.dateOfBirth}
                      placeholder="DD/MM/YYYY"
                      onChange={(newValue) => {
                        const formattedDate = newValue ? dayjs(newValue, 'DD/MM/YYYY').format('DD/MM/YYYY') : '';
                        //const formattedDate = newValue ? dayjs(newValue).format('MM/DD/YYYY') : '';
                        setFieldValue('dateOfBirth', formattedDate);
                      }}
                      label={t('preApproval.incomeDetails.personalDetails.dateOfBirth')}
                      type={'date'}
                      maxDate={new Date()}
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      onBlur={() => setFieldTouched('dateOfBirth', true)}
                    />
                  )}
                </Field>

                <Box></Box>
              </Grid>

              {/* Nationality */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="nationality">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.nationality')}
                      placeholder={t('preApproval.incomeDetails.personalDetails.pleaseSelect')}
                      select
                      fullWidth
                      error={touched.nationality && Boolean(errors.nationality)}
                      helperText={touched.nationality && errors.nationality}
                    >
                      <MenuItem value="AE">UAE</MenuItem>
                      <MenuItem value="IN">INDIA</MenuItem>
                    </TextInput>
                  )}
                </Field>
              </Grid>

              {/* Passport Number */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="passportNumber">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.passportNumber')}
                      placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                      fullWidth
                      error={touched.passportNumber && Boolean(errors.passportNumber)}
                      helperText={touched.passportNumber && errors.passportNumber}
                    />
                  )}
                </Field>
              </Grid>

              {/* Passport Expiry */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="passportExpiry">
                  {({ field }: any) => (
                    <CustomDatePicker
                      value={values.passportExpiry}
                      placeholder="DD/MM/YYYY"
                      onChange={(newValue) => {
                        console.log('passportExpiry newValue ', newValue);
                        const formattedDate = newValue ? dayjs(newValue, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''; //newValue ? dayjs(newValue).format('MM/DD/YYYY') : '';
                        console.log('passportExpiry formattedDate ', formattedDate);
                        setFieldValue('passportExpiry', formattedDate);
                      }}
                      label={t('preApproval.incomeDetails.personalDetails.passportExpiry')}
                      type={'date'}
                      error={touched.passportExpiry && Boolean(errors.passportExpiry)}
                      onBlur={() => setFieldTouched('passportExpiry', true)}
                    />
                  )}
                </Field>
              </Grid>

              {/* PO Box Number */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="poBox">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.poBoxNumber')}
                      placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                      fullWidth
                      error={touched.poBox && Boolean(errors.poBox)}
                      helperText={touched.poBox && errors.poBox}
                    />
                  )}
                </Field>
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="state">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.state.title')}
                      placeholder={t('preApproval.incomeDetails.purchaseType.placeholder')}
                      select
                      fullWidth
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                    >
                      <MenuItem value="AUH">Abu Dhabi</MenuItem>
                      <MenuItem value="AJM">Ajman</MenuItem>
                      <MenuItem value="DXB">Dubai</MenuItem>
                      <MenuItem value="FUJ">Fujairah</MenuItem>
                      <MenuItem value="RAK">Ras Al khaimah</MenuItem>
                      <MenuItem value="SHJ">Sharjah</MenuItem>
                      <MenuItem value="UAQ">Umm Al Quwain</MenuItem>
                    </TextInput>
                  )}
                </Field>
              </Grid>

              {/* Country of Residence */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="countryOfResidence">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={t('preApproval.incomeDetails.personalDetails.countryofResidence')}
                      placeholder={t('preApproval.purchaseType.placeholder')}
                      select
                      fullWidth
                      error={touched.countryOfResidence && Boolean(errors.countryOfResidence)}
                      helperText={touched.countryOfResidence && errors.countryOfResidence}
                    >
                      <MenuItem value="AE">UAE</MenuItem>
                      <MenuItem value="IN">INDIA</MenuItem>
                    </TextInput>
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Grid
              marginTop={3}
              container
              spacing={2}
              sx={{
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#5d656b',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                borderTop: '1px solid #d9d9d9',
                paddingY: 1.5,
                justifyContent: 'space-between',
              }}
            >
              <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <AppButton
                  onClick={() => window.location.reload()}
                  borderless
                  type="button"
                  sx={{
                    color: '#5d656b',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#273239',
                    },
                  }}
                >
                  {t('preApproval.incomeDetails.buttons.cancel')}
                </AppButton>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                <AppButton
                  type="submit"
                  disabled={submitted}
                  sx={{
                    backgroundColor: '#E31B23',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#C41419',
                    },
                  }}
                >
                  {t('preApproval.incomeDetails.buttons.continue')}
                </AppButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PersonalDetailsForm;

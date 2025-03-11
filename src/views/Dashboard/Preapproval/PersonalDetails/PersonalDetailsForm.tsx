'use client';

import type React from 'react';
import { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Grid2 as Grid, MenuItem } from '@mui/material';
import { Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';
import { setPreApprovalStep, updatePersonalDetails } from '@/store/slices/MortgageSlice';

const PersonalDetailsForm: React.FC = () => {
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
    console.log(values);

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
        Personal Details
      </Typography>

      <Formik
        initialValues={personalDetails}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
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
                      label="Customer name (as per passport)"
                      placeholder="Enter name as per passport"
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
                      label="Gender"
                      placeholder="Please select"
                      select
                      fullWidth
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextInput>
                  )}
                </Field>
              </Grid>

              {/* Date of Birth */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="dateOfBirth">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label="Date of birth"
                      placeholder="DD/MM / YYYY"
                      fullWidth
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                      InputProps={{
                        endAdornment: <Calendar size={isMobile ? 16 : 20} color="#5d656b" />,
                      }}
                    />
                  )}
                </Field>
              </Grid>

              {/* Nationality */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Field name="nationality">
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label="Nationality"
                      placeholder="Please select"
                      select
                      fullWidth
                      error={touched.nationality && Boolean(errors.nationality)}
                      helperText={touched.nationality && errors.nationality}
                    >
                      <MenuItem value="uae">UAE</MenuItem>
                      <MenuItem value="usa">USA</MenuItem>
                      <MenuItem value="uk">UK</MenuItem>
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
                      label="Passport number"
                      placeholder="Please enter"
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
                    <TextInput
                      {...field}
                      label="Passport expiry"
                      placeholder="DD/MM / YYYY"
                      fullWidth
                      error={touched.passportExpiry && Boolean(errors.passportExpiry)}
                      helperText={touched.passportExpiry && errors.passportExpiry}
                      InputProps={{
                        endAdornment: <Calendar size={isMobile ? 16 : 20} color="#5d656b" />,
                      }}
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
                      label="PO box number"
                      placeholder="Please enter"
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
                      label="State"
                      placeholder="Please select"
                      select
                      fullWidth
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                    >
                      <MenuItem value="dubai">Dubai</MenuItem>
                      <MenuItem value="abudhabi">Abu Dhabi</MenuItem>
                      <MenuItem value="sharjah">Sharjah</MenuItem>
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
                      label="Country of residence"
                      placeholder="Please select"
                      select
                      fullWidth
                      error={touched.countryOfResidence && Boolean(errors.countryOfResidence)}
                      helperText={touched.countryOfResidence && errors.countryOfResidence}
                    >
                      <MenuItem value="uae">UAE</MenuItem>
                      <MenuItem value="usa">USA</MenuItem>
                      <MenuItem value="uk">UK</MenuItem>
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
                  CANCEL
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
                  CONTINUE
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

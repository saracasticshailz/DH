'use client';

import type React from 'react';
import { Box, Container, Typography, InputAdornment, Paper } from '@mui/material';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPreApprovalStep, updateCreateCustomerProfile } from '@/store/slices/MortgageSlice';
import type { RootState } from '@/store';

interface CustomerProfileFormValues {
  name: string;
  phoneNumber: string;
  email: string;
  emiratesId: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .test('is-valid-phone', 'Phone number must be valid', (value) => {
      // Remove any non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 9 && digitsOnly.length <= 10;
    }),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  emiratesId: Yup.string()
    .required('Emirates ID is required')
    .test('is-valid-id', 'Emirates ID must be valid', (value) => {
      // Allow more flexible Emirates ID format
      return /^[0-9-\s]+$/.test(value);
    }),
});

// Debug component to show form values and errors during development
const FormDebug = () => {
  const formik = useFormikContext();
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, display: 'none' }}>
      <Typography variant="caption">Form Values:</Typography>
      <pre>{JSON.stringify(formik.values, null, 2)}</pre>
      <Typography variant="caption">Form Errors:</Typography>
      <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
      <Typography variant="caption">Touched Fields:</Typography>
      <pre>{JSON.stringify(formik.touched, null, 2)}</pre>
    </Box>
  );
};

const CreateCustomerProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  // Get initial values from Redux store if available
  const initialValues: CustomerProfileFormValues = {
    name: '',
    phoneNumber: '',
    email: '',
    emiratesId: '',
  };

  const handleSubmit = (values: CustomerProfileFormValues, { setSubmitting }: any) => {
    // Format phone number before submitting (remove any non-digit characters)
    const formattedValues = {
      ...values,
      phoneNumber: values.phoneNumber.replace(/\D/g, ''),
    };

    dispatch(updateCreateCustomerProfile(formattedValues));
    dispatch(setPreApprovalStep(preApproval.activeStep + 1));
    console.log('Form values:', formattedValues);
    setSubmitting(false);
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: '16px',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, #f5f5f5 0%, transparent 100%)',
            opacity: 0.5,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '24px', sm: '32px' },
              fontWeight: 600,
              color: '#1F2937',
              mb: 4,
            }}
          >
            Create Customer Profile
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, isValid, dirty, errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    {/* Name Field */}
                    <Box>
                      <Field
                        as={TextInput}
                        name="name"
                        label="Name"
                        placeholder="Enter your name"
                        fullWidth
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Box>

                    {/* Phone Number Field */}
                    <Box>
                      <Field
                        as={TextInput}
                        name="phoneNumber"
                        label="Phone number"
                        placeholder="00 000 0000"
                        fullWidth
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 1 }}>
                              +971
                            </InputAdornment>
                          ),
                        }}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    {/* Email Field */}
                    <Box>
                      <Field
                        as={TextInput}
                        name="email"
                        label="Email"
                        placeholder="Enter your email address"
                        fullWidth
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Box>

                    {/* Emirates ID Field */}
                    <Box>
                      <Field
                        as={TextInput}
                        name="emiratesId"
                        label="Emirates ID"
                        placeholder="Enter your Emirates ID number"
                        fullWidth
                        value={values.emiratesId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.emiratesId && Boolean(errors.emiratesId)}
                        helperText={touched.emiratesId && errors.emiratesId}
                      />
                    </Box>
                  </Box>

                  {/* Buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 4,
                      gap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <AppButton
                      type="button"
                      variant="outlined"
                      sx={{
                        order: { xs: 2, sm: 1 },
                        color: '#6B7280',
                        borderColor: '#E5E7EB',
                        '&:hover': {
                          borderColor: '#9CA3AF',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      CANCEL
                    </AppButton>
                    <AppButton
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        order: { xs: 1, sm: 2 },
                        minWidth: { xs: '100%', sm: '160px' },
                        backgroundColor: '#E31B23',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#C41419',
                        },
                      }}
                    >
                      CONTINUE
                    </AppButton>
                  </Box>
                </Box>

                {/* Debug component - remove in production */}
                <FormDebug />
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCustomerProfile;

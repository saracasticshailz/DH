'use client';

import type React from 'react';
import { Box, Container, Typography, InputAdornment, Paper } from '@mui/material';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import TextInput from '@/components/common/TextInput';
import { AppButton, CommonDialog } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import type { RootState } from '@/store';
import { useTranslation } from 'react-i18next';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
//@ts-ignore
import modNetwork from '../../../../lib/konyLib/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { useState } from 'react';
import { updateCustomerMobileNumberAndNameAndEmiratedId, updateRmCreatedUserProfileDetails } from '@/store/slices/CustomerAuthSlice';
import { setPreApprovalStep } from '@/store/slices/MortgageSlice';

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
      return /^[0-9-\s]+$/.test(value);
    }),
});

const FormDebug = () => {
  const formik = useFormikContext();
  const { t } = useTranslation();
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, display: 'none' }}>
      <Typography variant="caption">{t('createCustomerProfile.formValues')}</Typography>
      <pre>{JSON.stringify(formik.values, null, 2)}</pre>
      <Typography variant="caption">{t('createCustomerProfile.formErrors')}</Typography>
      <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
      <Typography variant="caption">{t('createCustomerProfile.touchedFields')}</Typography>
      <pre>{JSON.stringify(formik.touched, null, 2)}</pre>
    </Box>
  );
};

const CreateCustomerProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);
  const  [dialogText,setDialogText]=useState('');
  const [showAlert, setShowAlert] = useState(false);

  const initialValues: CustomerProfileFormValues = {
    name: '',
    phoneNumber: '',
    email: '',
    emiratesId: '',
  };

  const handleSubmit = (values: CustomerProfileFormValues, { setSubmitting }: any) => {
     setSubmitting(false);
      modNetwork(
        API.SIGNUP_API, // CREATE USER API
        {
          name: values.name,
          emiratesId: values.emiratesId,
          mobileNumber: `971${values.phoneNumber}`,
          emailId: values.email,
          journeyType: 'RM', 
        },
        (res: any) => {
          console.log('CREATE USER BY RM', res);
  
          if (res.oprstatus == 0 && res.returnCode == 0) {

            updateCustomerMobileNumberAndNameAndEmiratedId({
              mobileNumber: `971${values.phoneNumber}`,
              customerName: values.name,
              emiratesId: values.emiratesId,
            });

            dispatch(updateRmCreatedUserProfileDetails({
              lapsRefNumber: res.lapsRefNumber,
              applicationRefNumber: res.mobileMasked, //AS COMING FROM BE
           
            }));
            dispatch(setPreApprovalStep(preApproval.activeStep + 1));
          } else {
            console.log('ERROR', res);
            try {
              if (typeof res.errmsg === 'string') {
                const errorObj = JSON.parse(res.errmsg);
                setDialogText(errorObj.errMsg_EN || 'An error occurred');
              } else if (Array.isArray(res.errmsg) && res.errmsg.length > 0) {
                setDialogText(res.errmsg[0] || 'An error occurred');
              } else {
                setDialogText('Unknow error occurred. Please try again.');
              }
            } catch (error) {
              setDialogText(res.errmsg);
            }
          }
        },
        '',
        '',
        '',
        MOD_CONSTANTS.REGISTER
      );
    
  };

  return (
    <Container maxWidth="md">
       {showAlert && (
        <CommonDialog
          open={showAlert}
          onClose={(): void => {
            setShowAlert(false);
          }}
          onPrimaryAction={(): void => {
            setShowAlert(false);
          }}
          title={dialogText}
          description={dialogText}
          primaryButtonText={dialogText}
        />
      )}
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
           {t('createCustomerProfile.title')}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    {/* Name Field */}
                    <Box>
                      <Field
                        as={TextInput}
                        name="name"
                        label= {t("signUpScreen.name")}
                        placeholder={t("signUpScreen.enterYourName")}
                        fullWidth
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Box>

                    <Box>
                      <Field
                        as={TextInput}
                        name="phoneNumber"
                        label={t("signUpScreen.phoneNumber")}
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
                    <Box>
                      <Field
                        as={TextInput}
                        name="email"
                        label={t("signUpScreen.email")}
                        placeholder={t("signUpScreen.enterYourEmail")}
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
                        label={t("signUpScreen.eId")}
                        placeholder={t("signUpScreen.enterYourEid")}
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
                    {t('preApproval.incomeDetails.buttons.cancel')}
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
                      {t('preApproval.incomeDetails.buttons.continue')}
                    </AppButton>
                  </Box>
                </Box>
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

'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextInput from '@/components/common/TextInput';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { IMG } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OtpModal from '@/components/modal/otpModal';
import { AppButton } from '@/components';
import { COLORS } from '@/theme/colors';
import { useAppDispatch } from '@/hooks/redux.js';
import { loginSuccess, updateProfile } from '@/store/slices/CustomerAuthSlice.js';

//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

const LoginScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState('');
  const [lapsRefNumber, setlapsRefNumber] = useState('');

  const [otpSentStatus, setOtpSentStatus] = useState('M'); // Default to mobile OTP
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/public/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const initialValues = { phoneNumber: '' };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .length(9, t('loginScreen.phoneNumberMustBe9Digits'))
      .required(t('loginScreen.phoneNumberRequired')),
  });

  const handleSubmit = async (values: any, { setErrors }: any) => {
    if (values.phoneNumber.length !== 9) {
      setErrors({ phoneNumber: t('loginScreen.phoneNumberMustBe9Digits') });
      return; // Don't proceed if validation fails
    }

    //RESPONSE
    // "emailMasked".""
    // "lapsRefNumber"."'
    // "otpSentStatus":"'
    // "mobileMasked":'
    setAuthModalOpen(false);
    modNetwork(
      API.SIGNUP_API, // as discussed with noman will use same API
      {
        // mobileNumber: '971' + values.phoneNumber,
        mobileNumber: '971545953954',
        journeyType: 'RET',
      },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
          setAuthModalOpen(true);
          setMaskedPhoneNumber(res.mobileMasked);
          setMaskedEmail(res.emailMasked || '');
          setOtpSentStatus(res.otpSentStatus || 'M');
          setlapsRefNumber(res.lapsRefNumber || '');
        } else {
          console.log('ERROR', res);
          alert(JSON.stringify(res));
        }
      },
      '',
      '',
      '',
      'register'
    );
  };

  const handleOTPSubmit = async (enteredOtp: string) => {
    modNetwork(
      API.OTP_VERIFY_API,
      {
        lapsRefNumber: lapsRefNumber,
        otpType: isEmailVerification ? 'E' : 'M',
        // custOtp: enteredOtp,
        custOtp: '111111',
      },
      (res: any) => {
        console.log('OTP_VERIFY_API', res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          if (otpSentStatus === 'B' && !isEmailVerification) {
            setIsEmailVerification(true);
            return;
          }

          dispatch(updateProfile(res));
          // dispatch(
          //   updateCustomerMobileNumberAndNameAndEmiratedId({
          //     mobileNumber: `971${currentPhoneNumber}`,
          //     customerName: currentName,
          //     emiratesId: emiratesId,
          //   })
          // );

          dispatch(loginSuccess(res));

          navigate('/Dashboard', {
            state: { preventBack: true },
          });
        } else {
          navigate('/Dashboard');
          alert(res.errmsg);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: '1600px',
        width: '100%',
        margin: 'auto',
        paddingX: { xs: '1rem', md: '1.125rem', lg: '2rem' },
      }}
    >
      <AuthHeader />
      <Grid
        container
        spacing={4}
        sx={{
          paddingY: 4,
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <img
            src={IMG.LoginImage || '/placeholder.svg'}
            alt="ADCB"
            loading="lazy"
            className="rounded-3xl max-w-full"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            className="!rounded-2xl shadow-sm h-full"
            style={{ backgroundColor: COLORS.WHITE_SECONDARY }}
          >
            <CardContent
              sx={{
                paddingY: { md: 6 },
                paddingX: { md: 4 },
              }}
            >
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange }) => (
                  <Form className="mb-10">
                    <TextInput
                      name="phoneNumber"
                      countryCode="+971"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      placeholder={t('000000000')}
                      label={t('loginScreen.phoneNumber')}
                      onBlur={handleChange}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber ? errors.phoneNumber : ''}
                    />

                    <AppButton
                      type="submit"
                      onClick={() => {
                        // This will trigger form validation before submission
                        // You can keep this empty or add additional logic
                      }}
                    >
                      {t('loginScreen.proceed')}
                    </AppButton>
                  </Form>
                )}
              </Formik>
              <Typography
                sx={{
                  textAlign: 'center',
                  paddingY: 1.5,
                  color: '#000',
                }}
              >
                {t('loginScreen.dontHaveProfile')}
              </Typography>

              <AppButton
                onClick={() => {
                  console.log('Sign In');
                  navigate('/');
                }}
                withBorder
                fullWidth
              >
                {t('loginScreen.letsGetYouStarted')}
              </AppButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AuthFooter />
      {authModalOpen && (
        <OtpModal
          open={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setIsEmailVerification(false); // Reset email verification state when closing
          }}
          phoneNumber={isEmailVerification ? maskedEmail : maskedPhoneNumber}
          onSubmit={(OTP: string) => handleOTPSubmit(OTP)}
          title={isEmailVerification ? t('common.emailVerification') : t('common.phoneVerification')}
          description={isEmailVerification ? t('common.enterEmailOtp') : t('common.enterPhoneOtp')}
        />
      )}
    </Box>
  );
};

export default LoginScreen;

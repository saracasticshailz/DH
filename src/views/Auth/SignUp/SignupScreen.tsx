'use client';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import TextInput from '@/components/common/TextInput';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { IMG } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OtpModal from '@/components/modal/otpModal';
import AppButton from '@/components/common/AppButton/AppButton';
import { COLORS } from '@/theme/colors';
import { AppAlert, AppLoading, CommonDialog } from '@/components';
// @ts-ignore
import { Invoker } from '../../../v2/common/modules/modServiceInvoker';
import AppDialogTitle from '@/components/dialogs/components/AppDialogTitle.js';
import { Alert } from '@mui/material';
import { updateProfile } from '@/store/slices/CustomerAuthSlice.js';
import { useAppDispatch } from '@/hooks/redux.js';

const SignupScreen = () => {
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { invokeOperation } = Invoker();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState('');
  const [lapsRefNumber, setlapsRefNumber] = useState('');
  const dispatch = useAppDispatch();

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

  const initialValues = { name: '', phoneNumber: '', email: '', emiratesId: '' };

  const handleSubmit = async (values: any) => {
    // "name": "',
    // "emiratesld": 784199483035855,
    // "mobileNumber": 971542141089,
    // "emailld": "GR1@ADCB.COM",
    // "journeyType": "''
    // }

    //RESPONSE
    // "emailMasked".""
    // "lapsRefNumber"."'
    // "otpSentStatus":"'
    // "mobileMasked":'
    setAuthModalOpen(false);

    await invokeOperation(
      'sub_signup_signin',
      {},
      {
        name: values.name,
        emiratesld: values.emiratesId,
        mobileNumber: values.phoneNumber,
        emailld: values.email,
        journeyType: 'CUSTOMER',
      }, //body
      (res: any) => {
        //{"oprstatus":0,"returnCode":"0", "otpSentStatus": "B" "opstatus" :0, "lapsRefNumber":"017843", "emailMasked":"©***1@**
        // *COM", "mobileMasked": "***995", "httpStatusCode":0}

        //{"oprstatus":0,"returnCode""1" "errmsg":"[l"errMsg_AR|":|".لم نتمكن من تنتيذ طلبك. يرجى المحاولة مرة
        // Suf!"\"errMsg_EN|":|"We are unable to carry out your instructions currently. Please try later.\"}", "opstatus" :0,"httpStatusCode" :0}

        // console.log('sub_signup_signin RES', res);
        if (res.oprstatus == 0 && res.returnCode == 0) {
          //OTP TRIGGERED
          setAuthModalOpen(true);
          setMaskedPhoneNumber(res.mobileMasked);
        } else {
          // setShowAlert(true);
          alert(res.errmsg[1]);
        }
      },
      (err: any) => {
        console.log('ERROR', err);
        alert(JSON.stringify(err));
        setAuthModalOpen(true);
      }
    );
  };

  const handleOTPSubmit = async (enteredOtp: string) => {
    // {

    //   }
    //   "lapsRefNumber" "",
    //   "applicationRefNumber".'
    //   "addinfoReqFlag" '
    //   "customerType".
    //   "lastLoginDatetime":"''
    //   }

    await invokeOperation(
      'sub_otp_verify',
      {},
      {
        lapsRefNumber: lapsRefNumber,
        otpType: 'M',
        custOtp: enteredOtp,
      },
      (res: any) => {
        console.log('sub_otp_verify RES', res);
        dispatch(
          updateProfile({
            applicationRefNumber: 'LP-ML-00014325',
            displayMessage: '',
            addinfoReqFlag: 'y',
            lapsRefNumber: 17843,
            customerName: '',
            loanApplicationNo: '',
            loanApplicationStatus: 'Blank', //Blank , PR ,PP,PC,UP,NO,CP,DU,OI,VC,PC
            rmCode: '',
            rmEmailId: 'null',
            rmMobile: 'null',
            orderId: '',
            orderStatus: '',
            rmName: 'null',
            approvalDate: '',
            customerType: 'NTB',
            lastLoginDatetime: '2025-03-03 11:38:50',
          })
        );

        if (res.oprstatus == 0 && res.returnCode == 0) {
          navigate('/Dashboard');
        } else {
          alert(res.errmsg[1]);
        }
      },
      (err: any) => {
        console.log('ERROR', err);
        dispatch(
          updateProfile({
            applicationRefNumber: 'LP-ML-00014325',
            displayMessage: '',
            addinfoReqFlag: 'y',
            lapsRefNumber: 17843,
            customerName: '',
            loanApplicationNo: '',
            loanApplicationStatus: 'Blank', //Blank , PR ,PP,PC,UP,NO,CP,DU,OI,VC,PC
            rmCode: '',
            rmEmailId: 'null',
            rmMobile: 'null',
            orderId: '',
            orderStatus: '',
            rmName: 'null',
            approvalDate: '',
            customerType: 'NTB',
            lastLoginDatetime: '2025-03-03 11:38:50',
          })
        );
        navigate('/Dashboard');

        alert(JSON.stringify(err));
      }
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
      {isLoading && <AppLoading />}

      <CommonDialog
        open={showAlert}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        onPrimaryAction={function (): void {
          throw new Error('Function not implemented.');
        }}
        onSecondaryAction={function (): void {
          throw new Error('Function not implemented.');
        }}
        title={''}
        description={''}
        primaryButtonText={''}
        secondaryButtonText={''}
      />
      <Grid
        container
        spacing={4}
        sx={{
          paddingY: 4,
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <img
            src={IMG.signupImage || '/placeholder.svg'}
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
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, handleChange }) => (
                  <Form className="mb-10">
                    <TextInput
                      name="name" // This should match the field name in initialValues
                      value={values.name}
                      onChange={handleChange}
                      placeholder={t('signUpScreen.enterYourName')}
                      label={t('signUpScreen.name')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="phoneNumber" // This should match the field name in initialValues
                      countryCode="+971"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      placeholder={t('000 000 000')}
                      label={t('signUpScreen.phoneNumber')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="email" // This should match the field name in initialValues
                      placeholder={t('signUpScreen.enterYourEmail')}
                      value={values.email}
                      onChange={handleChange}
                      label={t('signUpScreen.email')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="emiratesId" // This should match the field name in initialValues
                      placeholder={t('signUpScreen.enterYourEid')}
                      value={values.emiratesId}
                      onChange={handleChange}
                      label={t('signUpScreen.eId')}
                      onBlur={() => {}}
                    />
                    {errorMessage && (
                      <Typography
                        sx={{
                          color: 'error.main',
                          marginY: 2,
                          textAlign: 'center',
                        }}
                      >
                        {errorMessage}
                      </Typography>
                    )}

                    <AppButton
                      type="submit"
                      onClick={() => {
                        // This will trigger form validation before submission
                        // You can keep this empty or add additional logic
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? t('common.loading') : t('signUpScreen.createYourProfile')}
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
                {t('signUpScreen.alreadyAMember')}
              </Typography>

              <AppButton
                onClick={() => {
                  console.log('Sign In');
                  navigate('/Login');
                }}
                withBorder
                fullWidth
              >
                {t('signUpScreen.signIn')}
              </AppButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AuthFooter />
      {authModalOpen && (
        <OtpModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          phoneNumber={maskedPhoneNumber}
          onSubmit={(OTP: string) => handleOTPSubmit(OTP)}
        />
      )}
      {showDialog && (
        <CommonDialog
          open={showDialog}
          onClose={(): void => {
            setShowDialog(false);
          }}
          onPrimaryAction={(): void => {
            throw new Error('Function not implemented.');
          }}
          onSecondaryAction={(): void => {
            setShowDialog(false);
          }}
          title={'Cancel Pre-Approval Application'}
          description={
            'Are you sure you want to cancel? Your progress will not be saved and you will be returned to your mortgage dashboard.'
          }
          primaryButtonText={'yes, cancel'}
          secondaryButtonText={'continue pre-approval'}
        />
      )}
    </Box>
  );
};

export default SignupScreen;

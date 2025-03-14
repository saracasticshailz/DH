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
import { AppButton } from '@/components';
import { COLORS } from '@/theme/colors';

//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';

const LoginScreen = () => {
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState('');

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

  const handleSubmit = async (values: any) => {
    //RESPONSE
    // "emailMasked".""
    // "lapsRefNumber"."'
    // "otpSentStatus":"'
    // "mobileMasked":'
    setAuthModalOpen(false);
    modNetwork(
      API.SIGNUP_API, // as discussed with noman will use same API
      {
        mobileNumber: values.phoneNumber,
        journeyType: 'CUSTOMER',
      },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
          setAuthModalOpen(true);
          setMaskedPhoneNumber(res.mobileMasked);
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
          <img src={IMG.LoginImage} alt="ADCB" loading="lazy" className="rounded-3xl max-w-full" />
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
                      name={'phoneNumber'}
                      countryCode="+971"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      placeholder={t('000 000 000')}
                      label={t('loginScreen.phoneNumber')}
                      onBlur={() => undefined}
                    />

                    <AppButton onClick={() => setAuthModalOpen(true)}>{t('loginScreen.proceed')}</AppButton>
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
          onClose={() => setAuthModalOpen(false)}
          phoneNumber="+971 ***678"
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
  // return (
  //   <Container
  //     maxWidth="md"
  //     className="min-h-screen flex items-center justify-center bg-gray-100 p-4 mt-8 overflow-hidden"
  //   >
  //     <Grid container spacing={4} className="shadow-lg rounded-2xl overflow-hidden bg-white p-4" wrap="wrap">
  //       {/* Left Side - Image and Text */}
  //       <Grid size={{ xs: 12, md: 8 }} className="relative">
  //         <Box
  //           component="img"
  //           src={images.signupImage}
  //           alt="Dream Home"
  //           className="h-full object-cover"
  //           sx={{ maxWidth: '100%', height: '900' }}
  //         />
  //         {/* <Box className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center p-8">
  //           <Typography variant="h4" className="text-white font-bold mb-4">
  //             Create Your Profile
  //           </Typography>
  //           <Typography variant="body1" className="text-white">
  //             This one-time registration will create your profile on the ADCB Dream Home platform, enhancing your home
  //             purchase experience.
  //           </Typography>
  //         </Box> */}
  //       </Grid>

  //       {/* Right Side - Form */}
  //       <Grid size={{ xs: 12, md: 4 }} className="p-8">
  //         <Card elevation={0} className="p-4">
  //           <CardContent>
  //             <Formik initialValues={initialValues} onSubmit={handleSubmit}>
  //               {({ values, handleChange }) => (
  //                 <Form>
  //                   <TextInput name="Name" value={values.name} onChange={handleChange} placeholder="Enter your name" />

  //                   <TextInput
  //                     name="Phone number"
  //                     value="+971"
  //                     onChange={function (event: React.ChangeEvent<HTMLInputElement>): void {
  //                       throw new Error('Function not implemented.');
  //                     }}
  //                     placeholder={'000 000 000'}
  //                   />
  //                   <TextInput
  //                     name="Phone number"
  //                     placeholder="000000000"
  //                     value={values.phoneNumber}
  //                     onChange={handleChange}
  //                   />

  //                   <TextInput
  //                     name="email"
  //                     placeholder="Enter your email address"
  //                     value={values.email}
  //                     onChange={handleChange}
  //                   />

  //                   <TextInput
  //                     name="emiratesId"
  //                     placeholder="Enter your Emirates ID number"
  //                     value={values.emiratesId}
  //                     onChange={handleChange}
  //                   />

  //                   <Button
  //                     type="submit"
  //                     variant="contained"
  //                     color="error"
  //                     fullWidth
  //                     sx={{ py: 1, color: 'white', borderRadius: 3, boxShadow: 3, mb: 4, mt: 2 }}
  //                   >
  //                     CREATE YOUR PROFILE
  //                   </Button>
  //                 </Form>
  //               )}
  //             </Formik>

  //             <Button variant="outlined" fullWidth className="rounded-xl">
  //               SIGN IN
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>

  //     {/* Footer */}
  //     <Box className="w-full text-center mt-4 p-4">
  //       <Typography variant="body2">
  //         Copyright © 2025 ADCB. All rights reserved. &nbsp;
  //         <a href="#" className="text-blue-500">
  //           Terms & Conditions
  //         </a>{' '}
  //         |
  //         <a href="#" className="text-blue-500">
  //           {' '}
  //           Privacy Policy
  //         </a>
  //       </Typography>
  //     </Box>
  //   </Container>
  // );
};

export default LoginScreen;

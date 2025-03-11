import TextInput from '@/components/common/TextInput';
import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';

const WelcomeView = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <Container maxWidth="lg" className="min-h-screen flex items-center justify-center bg-gray-100">
      <Grid container spacing={4} className="shadow-lg rounded-2xl overflow-hidden bg-white">
        {/* Left Side - Image and Text */}
        <Grid item xs={12} md={6} className="relative">
          <Box
            component="img"
            src="/path-to-your-image.jpg" // Replace with actual image path
            alt="Dream Home"
            className="w-full h-full object-cover"
          />
          <Box className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center p-8">
            <Typography variant="h4" className="text-white font-bold mb-4">
              Create Your Profile
            </Typography>
            <Typography variant="body1" className="text-white">
              This one-time registration will create your profile on the ADCB Dream Home platform, enhancing your home
              purchase experience.
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Form */}
        <Grid item xs={12} md={6} className="p-8">
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Name
              </Typography>
              <TextInput variant="outlined" fullWidth placeholder="Enter your name" className="mb-4" />

              <Typography variant="h6" className="mb-4 font-semibold">
                Phone Number
              </Typography>
              <Grid container spacing={2} className="mb-4">
                <Grid item xs={4}>
                  <TextInput variant="outlined" value="+971" disabled fullWidth />
                </Grid>
                <Grid item xs={8}>
                  <TextInput variant="outlined" placeholder="00 000 0000" fullWidth />
                </Grid>
              </Grid>

              <Typography variant="h6" className="mb-4 font-semibold">
                Email
              </Typography>
              <TextInput variant="outlined" fullWidth placeholder="Enter your email address" className="mb-4" />

              <Typography variant="h6" className="mb-4 font-semibold">
                Emirates ID
              </Typography>
              <TextInput variant="outlined" fullWidth placeholder="Enter your Emirates ID number" className="mb-6" />

              <Button variant="contained" color="error" fullWidth className="py-3 text-white rounded-xl shadow-md">
                CREATE YOUR PROFILE
              </Button>

              <Typography variant="body2" className="text-center mt-4">
                Already a member?
              </Typography>
              <Button variant="outlined" fullWidth className="mt-2 rounded-xl">
                SIGN IN
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="w-full text-center mt-4">
        <Typography variant="body2">
          Copyright © 2025 ADCB. All rights reserved. &nbsp;
          <a href="#" className="text-blue-500">
            Terms & Conditions
          </a>{' '}
          |{' '}
          <a href="#" className="text-blue-500">
            Privacy Policy
          </a>
        </Typography>
      </Box>
    </Container>
  );
};

export default WelcomeView;

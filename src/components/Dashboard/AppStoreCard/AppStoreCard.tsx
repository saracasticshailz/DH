'use client';
import { Person } from '@/assets/icon';
import { Box, Typography, Stack } from '@mui/material';
// import person from '../../../assets/icon/person.svg'

const AppStoreCard = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: { xs: '24px', md: '32px' },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '24px', md: '28px' },
          fontWeight: 600,
          color: '#273239',
          mb: 2,
        }}
      >
        Open an ADCB Account
      </Typography>

      <Typography
        sx={{
          fontSize: '16px',
          color: '#5D656B',
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        You can download the ADCB Hayyak app and open an account now. An account will be needed to receive your Final
        Offer Letter.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        <Box
          component="a"
          href="https://apps.apple.com/app/adcb-hayyak"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            width: { xs: '100%', sm: '160px' },
            height: '48px',
            position: 'relative',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {/* <Image
            src={Person}
            alt="Download on the App Store"
            fill
            style={{
              objectFit: 'contain',
            }}
          /> */}
          <Person />
        </Box>

        <Box
          component="a"
          href="https://play.google.com/store/apps/details?id=com.adcb.hayyak"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            width: { xs: '100%', sm: '160px' },
            height: '48px',
            position: 'relative',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <Person />
        </Box>
      </Stack>
    </Box>
  );
};

export default AppStoreCard;

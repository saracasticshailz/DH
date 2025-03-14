import { PALETTE_COLORS } from '@/theme/colors';
import { Button, styled } from '@mui/material';

export const print = function (message: string): void {
  console.log('from common : ' + message);
};

export const message = function (message: string): string {
  return `${message} : Hello from common `;
};

export const getPlatform = function () {
  if (navigator && typeof navigator !== undefined && navigator.product == 'ReactNative') {
    const { Platform } = require('react-native');
    return Platform.OS;
  }
  return 'web';
};

const logoutStyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  height: '40px',
  color: '#273239',
  borderRadius: '24px',
  padding: '8px 24px',
  textTransform: 'uppercase',
  fontWeight: 600,
  fontSize: '14px',
  letterSpacing: '0.5px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease-in-out',

  border: `1px solid ${PALETTE_COLORS.grey}`,
  '&:hover': {
    backgroundColor: 'rgba(39, 50, 57, 0.04)',
    borderColor: '#1a2329',
  },
  '& img': {
    width: '20px',
    height: '20px',
    objectFit: 'contain',
  },
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&.Mui-disabled': {
    borderColor: '#BEC1C4',
    color: PALETTE_COLORS.grey,
  },
}));

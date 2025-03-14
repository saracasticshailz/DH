import type React from 'react';
import { Button, styled } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { IMG } from '@/assets/images';
import { PALETTE_COLORS } from '@/theme/colors';
import MiniButton from '../MiniButton/MiniButton';

interface DownloadButtonProps extends ButtonProps {
  text?: string;
  iconPosition?: 'start' | 'end';
  onPress?: () => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
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
    backgroundColor: 'hsla(203, 18.80%, 18.80%, 0.04)',
    borderColor: '#000000',
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
    borderColor: '#000000',
    color: PALETTE_COLORS.grey,
  },
}));

const DownloadButton: React.FC<DownloadButtonProps> = ({ text = '', onPress, onClick, ...props }) => {
  const icon = <img src={IMG.DownloadIcon || '/placeholder.svg'} alt="Download" />;

  const handleClick = () => {};

  return <MiniButton text={text} onPress={handleClick} icon={icon} />;
};

export default DownloadButton;

'use client';

import type React from 'react';
import { Button, styled } from '@mui/material';

interface MiniButtonProps {
  text: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const StyledButton = styled(Button)(() => ({
  backgroundColor: 'transparent',
  height: '38px',
  width: '140px',
  color: '#273239',
  borderRadius: '24px',
  padding: '4px 16px',
  textTransform: 'uppercase',
  fontWeight: 600,
  fontSize: '12px',
  letterSpacing: '0.5px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  transition: 'all 0.2s ease-in-out',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  border: '1px solid #D1D5DB',
  '&:hover': {
    backgroundColor: 'hsla(203, 18.80%, 18.80%, 0.04)',
    borderColor: '#000000',
  },
  '& img, & svg': {
    width: '16px',
    height: '16px',
    flexShrink: 0,
    objectFit: 'contain',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&.Mui-disabled': {
    borderColor: '#D1D5DB',
    color: '#9CA3AF',
  },

  '@media (max-width: 320px)': {
    width: '100%',
    minWidth: 'auto',
  },
}));

const MiniButton: React.FC<MiniButtonProps> = ({ text, icon, onPress }) => {
  return (
    <StyledButton variant="outlined" onClick={onPress} endIcon={icon}>
      {text}
    </StyledButton>
  );
};

export default MiniButton;

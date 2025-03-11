import type React from 'react';
import { Button, styled } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { IMG } from '@/assets/images';
import { PALETTE_COLORS } from '@/theme/colors';

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

  border: `1px solid ${PALETTE_COLORS.borderGray}`,
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
    color: PALETTE_COLORS.borderGray,
  },
}));

const DownloadButton: React.FC<DownloadButtonProps> = ({
  text = 'Download',
  iconPosition = 'end',
  onPress,
  onClick,
  ...props
}) => {
  const icon = <img src={IMG.DownloadIcon || '/placeholder.svg'} alt="Download" />;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);
    if (onPress) onPress();
  };

  return (
    <StyledButton
      {...props}
      onClick={handleClick}
      startIcon={iconPosition === 'start' ? icon : undefined}
      endIcon={iconPosition === 'end' ? icon : undefined}
      variant="outlined"
    >
      {text}
    </StyledButton>
  );
};

export default DownloadButton;

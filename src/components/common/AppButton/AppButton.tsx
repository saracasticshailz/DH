import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PrimaryButtonProps extends ButtonProps {
  to?: string;
  onClick?: () => void;
  withBorder?: boolean;
  borderless?: boolean;
  fullWidth?: boolean;
}

const AppButton: React.FC<PrimaryButtonProps> = ({
  children,
  to,
  onClick,
  withBorder = false,
  borderless = false,
  fullWidth = true,
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (to) {
      navigate(to);
    }
  };

  const getButtonStyles = () => {
    if (borderless) {
      return {
        border: 'none',
        color: '#C41822',
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#E31B23',
        },
      };
    }
    if (withBorder) {
      return {
        color: '#273239', // Changed to black color
        borderColor: '#bec1c4',
        height: '48px',
        width: fullWidth ? '100%' : '180px',
        '&:hover': {
          borderColor: '#273239', // Changed hover border color to match text
          backgroundColor: 'transparent',
        },
      };
    }
    // Default filled style
    return {
      backgroundColor: '#E31B23',
      color: '#FFFFFF',
      border: 'none',
      '&:hover': {
        backgroundColor: '#C41822',
      },
    };
  };

  return (
    <Button
      variant={borderless ? 'text' : withBorder ? 'outlined' : 'contained'}
      fullWidth
      disableRipple
      sx={{
        fontWeight: 500,
        paddingY: 1.25,
        borderRadius: 2,
        fontSize: '0.8rem',
        fontFamily: 'proximanova-regular-webfont',
        maxWidth: !fullWidth ? '180px' : undefined,
        ...getButtonStyles(),
        ...props.sx,
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AppButton;

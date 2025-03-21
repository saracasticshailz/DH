'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Drawer, Typography, Box, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common';
import { COLORS } from '@/theme/colors';
import MiniButton from '@/components/common/MiniButton/MiniButton';

const OtpInput = styled('input')(({ theme }) => ({
  width: '40px',
  height: '40px',
  margin: '0 4px',
  textAlign: 'center',
  border: `1px solid ${COLORS.GRAY_BORDER}`,
  borderRadius: '4px',
  fontSize: '1.25rem',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

interface OtpDrawerProps {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSubmit: (otp: string) => void;
  onResendOtp?: () => void;
}

export default function OtpDrawer({
  open,
  onClose,
  phoneNumber,
  onSubmit,
  title,
  onResendOtp = () => {},
}: OtpDrawerProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const inputRefs: any = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useTranslation();


  // useEffect to focus the first input field after the modal is rendered
  useEffect(() => {
    if (open) {
      // Use setTimeout to delay the focus until after the modal renders
      setTimeout(() => {
        inputRefs.current[0]?.focus(); // Focus the first input field
      }, 300);
    }
  }, [open]);



  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit.length === 1)) {
      onSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, '0')}`;
  };

  const resetOtpAfterTypeChange = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleResendOtp = () => {
    setTimeLeft(180); // Reset timer to 3 minutes
    onResendOtp(); // Call the parent component's resend function
  };

  useEffect(() => {
    resetOtpAfterTypeChange();
  }, [phoneNumber]);

  return (
    <Drawer
      anchor="left"
      open={open}
      disableEnforceFocus={true}
      disableAutoFocus={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '50%' },
          p: 3,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          backgroundColor: COLORS.OFF_WHITE_BG,
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ pt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 500, mb: 2 }}>
            {title || t('otpModal.oneTimePassword')}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('otpModal.aSecureOne')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('otpModal.pleaseEnter')}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('otpModal.otpFor', { phone: phoneNumber })}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {otp.map((digit, index) => (
              <OtpInput
                key={index || title}
                autoFocus
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography color="text.secondary">
              {timeLeft > 0
                ? t('otpModal.validFor', {
                    min: formatTime(timeLeft),
                    sec: timeLeft % 60,
                  })
                : t('otpModal.otpExpired')}
            </Typography>
            {timeLeft === 0 && <MiniButton text={t('otpModal.resendOtp')} onPress={handleResendOtp} />}
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 14, left: 24, right: 24 }}>
          <AppButton withBorder fullWidth={false} onClick={onClose}>
            {t('otpModal.back')}
          </AppButton>
        </Box>
      </Box>
    </Drawer>
  );
}

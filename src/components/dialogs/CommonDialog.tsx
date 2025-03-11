import React from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material';
import { DoorClosedIcon as CloseIcon, Cross } from 'lucide-react';
import AppButton from '@/components/common/AppButton';
import { Close } from '@mui/icons-material';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonColor?: string;
  hideCloseButton?: boolean;
  maxWidth?: string | number;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  icon,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonColor = '#E31B23',
  hideCloseButton = false,
  maxWidth = '400px',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '24px',
          maxWidth: maxWidth,
          width: '100%',
        },
      }}
    >
      {!hideCloseButton && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#5D656B',
          }}
        >
          <Close />
        </IconButton>
      )}

      <DialogContent sx={{ padding: 0, paddingTop: '24px !important' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}
        >
          {/* Custom Icon */}
          {icon || (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${primaryButtonColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: primaryButtonColor,
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: 1,
              }}
            >
              !
            </Box>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#273239',
              fontSize: '20px',
              marginBottom: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: '#5D656B',
              fontSize: '16px',
              lineHeight: 1.5,
              marginBottom: 2,
            }}
          >
            {description}
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AppButton
              onClick={onPrimaryAction}
              sx={{
                backgroundColor: primaryButtonColor,
                color: 'white',
                '&:hover': {
                  backgroundColor: primaryButtonColor === '#E31B23' ? '#C41820' : undefined,
                  opacity: 0.9,
                },
              }}
            >
              {primaryButtonText}
            </AppButton>

            <AppButton
              onClick={onSecondaryAction}
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderColor: '#BEC1C4',
                color: '#273239',
                '&:hover': {
                  borderColor: '#273239',
                  backgroundColor: 'white',
                },
              }}
            >
              {secondaryButtonText}
            </AppButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;

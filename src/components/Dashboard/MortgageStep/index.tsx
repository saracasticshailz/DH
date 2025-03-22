import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { AppButton } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { StepBar, StepContainer, StepContent, StepWithButtonContainer } from './styles';

interface MortgageStepProps {
  title: string;
  description: string;
  subDescription?: string;
  buttonText?: string;
  active?: boolean;
  onButtonClick?: () => void;
  withButton?: boolean;
  applnstatus?: 'InProgress' | 'Rejected' | 'Complete' | 'Pending' | undefined;
}

export default function MortgageStep({
  title,
  description,
  subDescription,
  buttonText,
  active = false,
  onButtonClick,
  withButton = false,
  applnstatus,
}: MortgageStepProps) {
  console.log('buttonText ', buttonText);
  console.log('applnstatus ', applnstatus);
  const { t } = useTranslation();
  const renderStatusChip = () => {
    if (!applnstatus) return null;

    const chipStyles = {
      InProgress: {
        bgcolor: '#FFF3E9',
        color: '#E86B1C',
        label: 'In Progress',
      },
      Pending: {
        bgcolor: '#FFF3E9',
        color: '#E86B1C',
        label: 'Pending',
      },
      Complete: {
        bgcolor: '#E8F5E9',
        color: '#2E7D32',
        label: 'Completed',
      },
      Rejected: {
        bgcolor: '#E8F5E9',
        color: '#2E7D32',
        label: 'Rejected',
      },
    };

    const style = chipStyles[applnstatus];

    if (applnstatus !== 'Rejected') {
      return (
        <Chip
          label={style.label}
          sx={{
            bgcolor: style.bgcolor,
            color: style.color,
            height: '24px',
            fontSize: '12px',
            fontWeight: 500,
            ml: 2,
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
      );
    } else {
      return <></>;
    }
  };

  const renderButton = () => {
    if (applnstatus === 'InProgress') {
      return null;
    }

    // if (status === 'completed') {
    //   return (
    //     <AppButton onClick={onButtonClick} fullWidth={false} withBorder={true}>
    //        {t("dashboardScreen.steps.preApproval.resend")}
    //     </AppButton>
    //   );
    // }

    if (buttonText) {
      return (
        <AppButton onClick={onButtonClick} fullWidth={false}>
          {buttonText}
        </AppButton>
      );
    }

    return null;
  };

  if (withButton) {
    return (
      <StepContainer>
        <StepWithButtonContainer>
          <StepBar active={active} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography fontWeight={active ? 600 : undefined} variant="h6">
                {title}
              </Typography>
              {renderStatusChip()}
            </Box>
            <Typography fontSize={16} color="text.secondary">
              {description}
            </Typography>
            {subDescription && (
              <Typography fontSize={16} color="text.secondary">
                {subDescription}
              </Typography>
            )}
          </Box>
          {withButton && renderButton()}
        </StepWithButtonContainer>
      </StepContainer>
    );
  }

  return (
    <StepContainer>
      <StepContent>
        <StepBar active={active} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{title}</Typography>
            {renderStatusChip()}
          </Box>
          <Typography color="text.secondary">{description}</Typography>
          {subDescription && <Typography color="text.secondary">{subDescription}</Typography>}
        </Box>
        {renderButton()}
      </StepContent>
    </StepContainer>
  );
}

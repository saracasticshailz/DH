import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { AppButton } from '@/components/common';
import { StepBar, StepContainer, StepContent, StepWithButtonContainer } from './styles';

interface MortgageStepProps {
  title: string;
  description: string;
  subDescription?: string;
  buttonText?: string;
  active?: boolean;
  onButtonClick?: () => void;
  withButton?: boolean;
  status?: 'in_progress' | 'completed' | 'new';
}

export default function MortgageStep({
  title,
  description,
  subDescription,
  buttonText,
  active = false,
  onButtonClick,
  withButton = false,
  status,
}: MortgageStepProps) {
  const renderStatusChip = () => {
    if (!status) return null;

    const chipStyles = {
      in_progress: {
        bgcolor: '#FFF3E9',
        color: '#E86B1C',
        label: 'In Progress',
      },
      completed: {
        bgcolor: '#E8F5E9',
        color: '#2E7D32',
        label: 'Completed',
      },
      new: {
        bgcolor: '#F5F5F5',
        color: '#757575',
        label: 'new',
      },
    };

    const style = chipStyles[status];

    if (status !== 'new') {
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
    if (status === 'in_progress') {
      return null;
    }

    if (status === 'completed') {
      return (
        <AppButton onClick={onButtonClick} fullWidth={false} withBorder={true}>
          Resend
        </AppButton>
      );
    }

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

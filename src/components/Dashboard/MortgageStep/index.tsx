import React from 'react';
import { Box, Typography, Chip, Card } from '@mui/material';
import { AppButton } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { StepBar, StepContainer, StepContent, StepWithButtonContainer } from './styles';
import { IMG } from '@/assets/images';

interface MortgageStepProps {
  title: string;
  description: string;
  subDescription?: string;
  buttonText?: string;
  active?: boolean;
  onButtonClick?: () => void;
  fetchOrderData?: any;
  journeyStatus?: string;
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
  fetchOrderData,
  journeyStatus,
  withButton = false,
  applnstatus,
}: MortgageStepProps) {
  console.log('applnstatus', applnstatus);

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
      undefined: {
        bgcolor: '#FFFFFF',
        color: '',
        label: '',
      },
    };

    const style = chipStyles[applnstatus];

    if (applnstatus !== undefined) {
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

    if (buttonText && buttonText !== 'NA') {
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
              {applnstatus !== undefined ? renderStatusChip() : null}
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
  console.log('applnstatus ', applnstatus);
  console.log('in step file pass as param fetchOrderData ', fetchOrderData);
  return (
    <StepContainer>
      <StepContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 ,}}>
          <Card
            sx={{
              display: 'flex',
              mb: 3,
              borderLeft: `4px solid ${active ? '#E31B23' : '#9E9E9E'}`,
              boxShadow: 'none',
              backgroundColor:'transparent',
            }}
          >
            <Box sx={{ mb: 2, ml: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{title}</Typography>
                {applnstatus !== undefined && title != t('valuation.propertyDetails.title')
                  ? renderStatusChip()
                  : null}
              </Box>
              <Typography color="text.secondary">{description}</Typography>
              {subDescription && <Typography color="text.secondary">{subDescription}</Typography>}
              {fetchOrderData &&
              ((applnstatus !== undefined && applnstatus === 'Pending') || applnstatus === 'InProgress') &&
              title === t('valuation.propertyDetails.title') ? (
                <>
                  <Box
                    sx={{
                      alignItems: 'flex-start',
                      mt: 1,
                      border: '0.5px solid lightgrey',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mt: 1 }}>
                        {t('valuation.propertyDetails.valuationApplication')}
                      </Typography>
                      {applnstatus !== undefined ? renderStatusChip() : null}
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', mt: 1 }}>
                      {t('valuation.propertyDetails.paymentPending')}
                    </Typography>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', mt: 1 }}>
                      {t('valuation.propertyDetails.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 1 }}>
                      <img src={IMG.LocationIcon || '/placeholder.svg'} alt="edit" width={16} height={16} />
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: '12px', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {t('valuation.propertyDetails.propertyAddress')}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem' }}>
                          {[
                            fetchOrderData.address.houseNoFlatNo,
                            fetchOrderData.address.floor,
                            fetchOrderData.address.buildingName,
                            fetchOrderData.address.streetAddress,
                            fetchOrderData.address.landmarks,
                            fetchOrderData.address.localityArea,
                            fetchOrderData.address.state,
                            fetchOrderData.address.country,
                          ]
                            .filter(Boolean) // Filters out any empty strings or falsy values
                            .join(', ')}{' '}
                          {/* Join the non-empty values with a comma */}
                        </Typography>
                      </Box>
                    </Box>
                    {journeyStatus === 'CP' || journeyStatus === 'DU' ? renderButton() : null}
                  </Box>
                </>
              ) : null}
            </Box>
            {journeyStatus != 'CP' && journeyStatus != 'DU' ? renderButton() : null}
          </Card>
        </Box>
      </StepContent>
    </StepContainer>
  );
}

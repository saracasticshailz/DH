import { Box, Card, styled } from '@mui/material';
import { IMG } from '@/assets/images';

export const StyledCard = styled(Card)(() => ({
  borderRadius: 24,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  fontFamily: 'proxima_nova',
}));

export const HeroSection = styled(Box)({
  background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),url(${IMG.DashboardBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '40px',
  color: 'white',
  height: '240px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  borderRadius: '24px 24px 0 0',
});

export const StepBar = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: 4,
  height: '100px',
  backgroundColor: active ? '#E31B23' : '#9E9E9E',
  borderRadius: 2,
  marginRight: 16,
}));

export const DealItem = styled(Box)({
  display: 'flex',
  gap: 16,
  marginBottom: 16,
  '& img': {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: 'cover',
  },
});

export const FooterContainer = styled(Box)({
  marginTop: 32,
  paddingTop: 16,
  borderTop: '1px solid #EAEAEA',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const StepContainer = styled(Box)({
  padding: 24,
  borderBottom: '1px solid #EAEAEA',
});

export const StepContent = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
});

export const StepWithButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export const DealsHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
});

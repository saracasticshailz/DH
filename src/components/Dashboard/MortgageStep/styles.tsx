import { Box, styled } from '@mui/material';

export const StepBar = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: 4,
  height: '100%', // Adjust height dynamically based on parent container's height//'100px',
  backgroundColor: active ? '#E31B23' : '#9E9E9E',
  borderRadius: 2,
  marginRight: 16,
}));

export const StepContainer = styled(Box)({
  padding: 24,
  borderBottom: '1px solid #EAEAEA',
  backgroundColor:'transparent'
});

export const StepContent = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  backgroundColor:'transparent'
});

export const StepWithButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  backgroundColor:'transparent'
});

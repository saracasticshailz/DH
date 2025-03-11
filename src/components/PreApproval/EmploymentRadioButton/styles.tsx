import { Box, FormControlLabel, Radio, styled, Typography } from '@mui/material';

const StyledRadio = styled(Radio)({
  '&.MuiRadio-root': {
    padding: '12px',
  },
  '&.Mui-checked': {
    color: '#E31B23',
  },
});

const StyledFormControlLabel = styled(FormControlLabel)<{ selected: boolean }>(({ selected }) => ({
  margin: 0,
  width: '100%',
  height: '56px', // Explicit units for better browser support
  border: '1px solid',
  borderColor: selected ? '#E31B23' : '#EAEAEA',
  borderRadius: '12px',
  padding: '0 16px',
  transition: 'border-color 0.2s ease-in-out', // Smooth transition for better UX
  '&:hover': {
    borderColor: selected ? '#E31B23' : '#273239',
  },
  '.MuiFormControlLabel-label': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginLeft: 0,
  },
}));

const ContentWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
  order: 1, // Icon first
});

const LabelText = styled(Typography)<{ selected: boolean }>(({ selected }) => ({
  flex: 1,
  fontSize: 14,
  lineHeight: '22px',
  color: selected ? '#E31B23' : '#273239',
  //fontWeight: 'bold',
  order: 2, // Label in the middle
}));

const RadioWrapper = styled(Box)({
  order: 3, // Radio at the end
});

export { RadioWrapper, LabelText, IconWrapper, ContentWrapper, StyledFormControlLabel, StyledRadio };

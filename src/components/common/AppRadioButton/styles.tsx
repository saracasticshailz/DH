import styled from '@emotion/styled';
import { Radio, FormControlLabel, Box, Typography } from '@mui/material';

const StyledRadio = styled(Radio)({
  '&.MuiRadio-root': {
    padding: '12px',
  },
  '&.Mui-checked': {
    color: '#E31B23',
  },
});

const StyledFormControlLabel = styled(FormControlLabel)<{ selected: boolean; height?: number }>(
  ({ selected, theme, height }) => ({
    margin: 0,
    width: '100%',
    height: height ?? 77,
    border: '1px solid',
    borderColor: selected ? '#E31B23' : '#EAEAEA',
    borderRadius: 12,
    padding: '0 16px',
    '&:hover': {
      borderColor: selected ? '#E31B23' : '#273239',
    },
    '@media (max-width: 900px)': {
      height: 'auto',
      minHeight: 77,
      padding: '12px 16px',
    },
    '@media (max-width: 600px)': {
      minHeight: 64,
      padding: '10px 16px',
    },
    flexDirection: 'row-reverse',
    '.MuiRadio-root': {
      marginRight: 0,
      marginLeft: 'auto',
    },
    '.MuiFormControlLabel-label': {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      marginLeft: 0,
      marginRight: 'auto',
      '@media (max-width: 900px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
      },
    },
  })
);

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
});

interface LabelTextProps {
  isTitle?: boolean;
}

const LabelText = styled(Typography)<LabelTextProps>(({ isTitle = false }) => ({
  fontSize: 14,
  lineHeight: '22px',
  color: '#273239',
  fontWeight: isTitle ? 600 : 300, // Bold (600) for titles, light (300) for regular text
}));

export { LabelText, IconWrapper, StyledFormControlLabel, StyledRadio };

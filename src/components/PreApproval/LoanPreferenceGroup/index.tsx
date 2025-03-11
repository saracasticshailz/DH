import { Box, Typography, FormHelperText, styled } from '@mui/material';
import RadioCard from '../../common/AppRadioButton';
import { IMG } from '@/assets/images';
import { useTranslation } from 'react-i18next';

interface LoanPreferenceGroupProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
}

const RadioGroupContainer = styled(Box)({
  display: 'flex',
  gap: 16,
  width: '100%',
  '@media (max-width: 480px)': {
    flexDirection: 'column',
  },
});

const StyledIcon = styled('img')({
  width: 24,
  height: 24,
  objectFit: 'contain',
  display: 'block',
});

const RadioOption = styled(Box)({
  flex: 1,
  minWidth: 0, // Prevents flex items from overflowing
});

export default function LoanPreferenceGroup({ value, onChange, onBlur, error, touched }: LoanPreferenceGroupProps) {
  const options = [
    {
      value: 'ADCB',
      label: 'ADCB',
      icon: IMG.PlectrumRed,
    },
    {
      value: 'ADCB Islamic',
      label: 'ADCB Islamic',
      icon: IMG.PlectrumGreen,
    },
  ];

  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle1"
        component="label"
        sx={{
          color: '#5d656b',
          display: 'block',
          marginBlockEnd: 1,
          fontSize: '13.36px',
          fontWeight: '500',
          mb: 2,
        }}
      >
        {t('preApproval.loanDetails.loanPreference.label')}
      </Typography>
      <RadioGroupContainer>
        {options.map((option) => (
          <RadioOption key={option.value}>
            <RadioCard
              value={option.value}
              label={option.label}
              icon={() => <StyledIcon src={option.icon} alt={`${option.label} icon`} />}
              selected={value === option.value}
              onChange={onChange}
              height={56}
            />
          </RadioOption>
        ))}
      </RadioGroupContainer>
      {touched && error && (
        <FormHelperText error sx={{ mt: 1 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

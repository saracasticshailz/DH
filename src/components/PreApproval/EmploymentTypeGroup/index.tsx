import React from 'react';
import { Box, Typography, FormHelperText, styled } from '@mui/material';
import { IMG } from '@/assets/images';
import EmploymentRadioButton from '../EmploymentRadioButton';
import { useTranslation } from 'react-i18next';

interface EmploymentTypeGroupProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
}

const RadioGroupContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
});

export default function EmploymentTypeGroup({ value, onChange, onBlur, error, touched }: EmploymentTypeGroupProps) {

  const { t } = useTranslation();
  const employmentTypes = [
    {
      value: 'SA',
      label: 'Salaried',
      icon: () => <img src={IMG.BusinessIcon || '/placeholder.svg'} alt="" style={{ width: 24, height: 24 }} />,
    },
    {
      value: 'SE',
      label: 'Self employed',
      icon: () => <img src={IMG.PersonIcon || '/placeholder.svg'} alt="" style={{ width: 24, height: 24 }} />,
    },
    {
      value: 'PE',
      label: 'Pensioner (UAE nationals only)',
      icon: () => <img src={IMG.ElderlyIcon || '/placeholder.svg'} alt="" style={{ width: 24, height: 24 }} />,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
      {t("preApproval.employmentDetails.employmentType.label")}
      </Typography>
      <RadioGroupContainer>
        {employmentTypes.map((type) => (
          <EmploymentRadioButton
            key={type.value}
            value={type.value}
            label={type.label}
            icon={type.icon}
            selected={value === type.value}
            onChange={onChange}
            onBlur={onBlur}
          />
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

import React from 'react';
import { Box, Typography, RadioGroup, FormHelperText, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RadioCard from '@/components/common/AppRadioButton';

interface FinancingOptionsGroupProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
}

export default function FinancingOptionsGroup({ value, onChange, onBlur, error, touched }: FinancingOptionsGroupProps) {
  const { t } = useTranslation();
  const options = [
    {
      value: 'Fixed',
      label: t('preApproval.loanDetails.financePricing.options.threeYear.title'),
      description: t('preApproval.loanDetails.financePricing.options.threeYear.description'),
    },
    {
      value: 'A',
      label: t('preApproval.loanDetails.financePricing.options.fiveYear.title'),
      description: t('preApproval.loanDetails.financePricing.options.fiveYear.description'),
    },
    {
      value: 'B',
      label: t('preApproval.loanDetails.financePricing.options.variable.title'),
      description: t('preApproval.loanDetails.financePricing.options.variable.description'),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="subtitle1"
          component="label"
          sx={{
            color: '#5d656b',
            display: 'block',
            marginBlockEnd: 1,
            fontSize: '13.36px',
            fontWeight: '500',
          }}
        >
         {t("preApproval.loanDetails.financePricing.label")}
        </Typography>
        <Button sx={{ color: '#E31B23' }}>{t("preApproval.loanDetails.financePricing.learnMore")}</Button>
      </Box>
      <RadioGroup
        name="financingOption"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        sx={{ gap: 2 }}
      >
        {options.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            // icon={option.icon}
            selected={value === option.value}
            onChange={onChange}
          />
        ))}
      </RadioGroup>
      {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}

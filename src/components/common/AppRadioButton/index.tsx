import React, { Children } from 'react';
import { LabelText, StyledFormControlLabel, StyledRadio } from './styles';
import { Box } from '@mui/material';
import { IMG } from '@/assets/images';

interface RadioCardProps {
  value: string;
  label: string;
  icon?: () => React.ReactNode;
  selected: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  description?: string;
  height?: number;
}

export default function RadioCard({
  value,
  label,
  icon,
  selected,
  onChange,
  onBlur,
  description,
  height,
}: RadioCardProps) {
  return (
    <StyledFormControlLabel
      value={value}
      selected={selected}
      labelPlacement="start"
      height={height}
      control={<StyledRadio checked={selected} onChange={() => onChange(value)} onBlur={onBlur} />}
      label={
        <Box sx={{ alignItems: 'center', gap: 1.5 , display:'flex'}}>
           {icon ? icon() : null}
          <LabelText isTitle={true}>{label}</LabelText>
          <LabelText>{description}</LabelText>
        </Box>
      }
    />
  );
}

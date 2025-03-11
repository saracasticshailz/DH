import React from 'react';
import { StyledFormControlLabel, RadioWrapper, LabelText, StyledRadio, ContentWrapper, IconWrapper } from './styles';

interface EmploymentRadioProps {
  value: string;
  label: string;
  icon?: () => React.ReactNode;
  selected: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function EmploymentRadioButton({
  value,
  label,
  icon: IconComponent,
  selected,
  onChange,
  onBlur,
}: EmploymentRadioProps) {
  return (
    <StyledFormControlLabel
      value={value}
      selected={selected}
      control={
        <RadioWrapper>
          <StyledRadio checked={selected} onChange={() => onChange(value)} onBlur={onBlur} />
        </RadioWrapper>
      }
      label={
        <ContentWrapper>
          {IconComponent && (
            <IconWrapper>
              <IconComponent />
            </IconWrapper>
          )}
          <LabelText selected={selected}>{label}</LabelText>
        </ContentWrapper>
      }
      labelPlacement="start"
    />
  );
}

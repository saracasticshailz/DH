import { Radio, RadioGroup, FormControlLabel, FormControl, Typography, Box, SvgIcon } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface Option {
  value: string;
  label: string;
  icon: SvgIconComponent;
}

interface BorderedRadioGroupProps {
  options: Option[];
  defaultValue?: string;
}

export function BorderedRadioGroup({ options, defaultValue }: BorderedRadioGroupProps) {
  return (
    <FormControl component="fieldset">
      <RadioGroup defaultValue={defaultValue || options[0].value}>
        {options.map((option) => (
          <Box
            key={option.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              p: 2,
            }}
          >
            <SvgIcon component={option.icon} sx={{ mr: 2, color: 'action.active' }} />
            <Typography sx={{ flexGrow: 1 }}>{option.label}</Typography>
            <FormControlLabel value={option.value} control={<Radio />} label="" sx={{ m: 0 }} />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

import React from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  Typography,
  FormHelperText,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
} from '@mui/material';

interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps extends Omit<MuiSelectProps, 'onChange'> {
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const AppSelect: React.FC<AppSelectProps> = ({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onChange(name, event.target.value as string);
  };

  const selectStyles = {
    '& .MuiSelect-select': {
      lineHeight: 1,
      padding: '14px 20px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
      borderColor: error ? '#E31B23' : '#bec1c4',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? '#E31B23' : '#5d656b',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? '#E31B23' : '#5d656b',
    },
    '& .MuiSelect-icon': {
      color: '#273239',
      right: 12,
    },
  };

  return (
    <FormControl fullWidth error={error}>
      {label && (
        <Typography
          component="label"
          sx={{
            color: '#5d656b',
            display: 'block',
            marginBlockEnd: 1,
            fontSize: '0.875rem',
            // fontSize: '13.36px',
            fontWeight: '500',
          }}
        >
          {label}
        </Typography>
      )}
      <MuiSelect
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        displayEmpty={!!placeholder}
        sx={selectStyles}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '8px',
              mt: '4px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default AppSelect;

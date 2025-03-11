import type React from 'react';
import { TextField, Typography, InputAdornment } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { COLORS } from '@/theme/colors';

interface TextInputProps extends Omit<TextFieldProps, 'label'> {
  label?: string;
  countryCode?: string;
  customLabel?: boolean; // To toggle between custom and MUI label
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  countryCode,
  error,
  helperText,
  multiline,
  rows,
  select,
  children,
  customLabel = true, // Default to custom label
  InputProps,
  sx,
  ...props
}) => {
  // Define the grey color as a constant for consistency
  const greyColor = COLORS.GRAY_BORDER;

  const inputStyles = {
    '& .MuiInputBase-input': {
      lineHeight: 1,
      padding: countryCode ? '0' : '14px 20px',
      // Add placeholder styling here
      '&::placeholder': {
        color: greyColor, // Grey color for placeholders
        opacity: 1, // Firefox requires this to show the custom color
      },
      // For older browsers
      '&::-webkit-input-placeholder': {
        color: greyColor,
        opacity: 1,
      },
      '&::-moz-placeholder': {
        color: greyColor,
        opacity: 1,
      },
      '&:-ms-input-placeholder': {
        color: greyColor,
        opacity: 1,
      },
      // Handle autofill styling - Fixed kebab-case to camelCase
      '&:-webkit-autofill': {
        WebkitTextFillColor: COLORS.BLACK,
        WebkitBoxShadow: '0 0 0px 1000px white inset',
        transition: 'background-color 5000s ease-in-out 0s',
      },
      '&:-webkit-autofill:focus': {
        WebkitTextFillColor: COLORS.BLACK,
      },
      '&:-webkit-autofill:hover': {
        WebkitTextFillColor: COLORS.BLACK,
      },
      '&:-webkit-autofill:active': {
        WebkitTextFillColor: COLORS.BLACK,
      },
      '&:autofill': {
        color: COLORS.BLACK,
        background: 'white !important',
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '2px',
        borderColor: '#bec1c4',
      },
      '&:hover fieldset': {
        borderColor: '#5d656b',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#5d656b',
      },
      '&:hover .MuiInputAdornment-outlined': {
        borderColor: '#5d656b',
      },
      '&.Mui-focused .MuiInputAdornment-outlined': {
        borderColor: '#5d656b',
      },
    },
    ...(multiline && {
      '& .MuiInputBase-multiline': {
        padding: '14px 20px',
      },
    }),
    ...sx,
  };

  const combinedInputProps = {
    ...InputProps,
    ...(countryCode && {
      startAdornment: (
        <InputAdornment
          position="start"
          sx={{
            fontWeight: '600',
            color: COLORS.BLACK,
            paddingLeft: '20px',
            paddingTop: '14px',
            paddingBottom: '14px',
            maxHeight: 'fit-content',
            paddingRight: '20px',
            borderRightWidth: '2px',
            borderColor: '#bec1c4',
            '& .MuiTypography-body1': {
              fontWeight: 600,
              color: COLORS.BLACK,
            },
          }}
        >
          {countryCode}
        </InputAdornment>
      ),
    }),
  };

  return (
    <div className="mb-5">
      {customLabel && label && (
        <Typography
          component="label"
          sx={{
            color: '#5d656b',
            display: 'block',
            marginBlockEnd: 1,
            fontSize: '13.36px',
            fontWeight: '500',
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        multiline={multiline}
        rows={rows}
        select={select}
        variant="outlined"
        fullWidth
        InputProps={combinedInputProps}
        sx={inputStyles}
        label={!customLabel ? label : undefined}
        {...props}
      >
        {children}
      </TextField>
    </div>
  );
};

export default TextInput;

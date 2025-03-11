import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  label?: string;
  value: string | null;
  onChange: (value: any) => void;
  type: 'date' | 'datetime';
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  sx?: React.CSSProperties;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  type,
  error,
  helperText,
  onBlur,
  placeholder,
  disabled = false,
  fullWidth = true,
  minDate,
  maxDate,
  sx,
}) => {
  const dayjsValue = value ? (typeof value === 'string' ? dayjs(value, 'DD/MM/YYYY') : value) : null;

  const handleDateChange = (newValue: any) => {
    const formattedDate = newValue ? dayjs(newValue).format('DD/MM/YYYY') : '';
    onChange(formattedDate);
  };

  return (
    <div style={{ marginBottom: '1rem', ...(sx as any) }}>
      {label && (
        <Typography
          component="label"
          sx={{
            display: 'block',
            marginBottom: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={dayjsValue}
          onChange={handleDateChange}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          slotProps={{
            textField: {
              fullWidth: fullWidth,
              variant: 'outlined',
              error: error,
              helperText: helperText,
              onBlur: onBlur,
              placeholder: placeholder || 'DD/MM/YYYY',
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;

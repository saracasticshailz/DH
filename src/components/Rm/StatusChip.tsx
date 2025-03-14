import type React from 'react';
import { Chip, type ChipProps } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'label'> {
  status: string;
  getStatusColor: (status: string) => string;
  getStatusTextColor: (status: string) => string;
  label?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, getStatusColor, getStatusTextColor, label, ...props }) => {
  return (
    <Chip
      label={label || status}
      sx={{
        bgcolor: getStatusColor(status),
        color: getStatusTextColor(status),
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
        borderRadius: '12px',
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;

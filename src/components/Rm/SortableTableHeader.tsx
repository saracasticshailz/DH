'use client';
import { TableCell, TableHead, TableRow, Box } from '@mui/material';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

interface SortableColumn<T extends string> {
  field: T;
  label: string;
  sortable?: boolean;
  width?: string | number;
}

interface SortableTableHeaderProps<T extends string> {
  columns: SortableColumn<T>[];
  sortField: T;
  sortDirection: SortDirection;
  onSort: (field: T) => void;
  actionColumnLabel?: string;
}

const SortableTableHeader = <T extends string>({
  columns,
  sortField,
  sortDirection,
  onSort,
  actionColumnLabel,
}: SortableTableHeaderProps<T>) => {
  const renderSortIcon = (field: T) => {
    if (sortField !== field) {
      return (
        <Box component="span" sx={{ ml: 0.5, opacity: 0.3 }}>
          <ChevronUp size={16} />
        </Box>
      );
    }
    return sortDirection === 'asc' ? (
      <Box component="span" sx={{ ml: 0.5 }}>
        <ChevronUp size={16} />
      </Box>
    ) : (
      <Box component="span" sx={{ ml: 0.5 }}>
        <ChevronDown size={16} />
      </Box>
    );
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
        {columns.map((column) => (
          <TableCell
            key={column.field}
            onClick={() => column.sortable !== false && onSort(column.field)}
            sx={{
              cursor: column.sortable !== false ? 'pointer' : 'default',
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.875rem',
              borderBottom: '1px solid #E5E7EB',
              padding: '12px 16px',
              width: column.width,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {column.label}
              {column.sortable !== false && renderSortIcon(column.field)}
            </Box>
          </TableCell>
        ))}
        {actionColumnLabel && (
          <TableCell
            sx={{
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.875rem',
              borderBottom: '1px solid #E5E7EB',
              padding: '12px 16px',
            }}
          >
            {actionColumnLabel}
          </TableCell>
        )}
        <TableCell
          sx={{
            borderBottom: '1px solid #E5E7EB',
            padding: '12px 16px',
            width: '48px',
          }}
        />
      </TableRow>
    </TableHead>
  );
};

export default SortableTableHeader;

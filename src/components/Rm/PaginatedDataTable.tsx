'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronRight } from 'lucide-react';
import SortableTableHeader, { type SortDirection } from './SortableTableHeader';

// Define the application details interface
export interface OrderDetail {
  orderId: string;
  orderStatus: string;
}

export interface ApplicationDetail {
  customerName: string;
  mobileNo: string;
  emailId: string;
  applicationNo: string;
  leadReferenceNo: string;
  applicationReferenceNo: string;
  applicationSubmittedDate: string;
  applicationStatus: string;
  customerType: string;
  orderDetails: OrderDetail[];
  [key: string]: any; // Allow for additional properties
}

interface PaginatedDataTableProps<T, K extends string> {
  data: T[];
  columns: Array<{
    field: K;
    label: string;
    sortable?: boolean;
    width?: string | number;
    render?: (item: T) => React.ReactNode;
  }>;
  initialSortField: K;
  initialSortDirection?: SortDirection;
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  actionColumn?: {
    label?: string;
    render: (item: T) => React.ReactNode;
  };
  moreDetailsColumn?: {
    label?: string;
    render: (item: T) => React.ReactNode;
  };
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

function PaginatedDataTable<T, K extends string>({
  data,
  columns,
  initialSortField,
  initialSortDirection = 'asc',
  keyExtractor,
  onRowClick,
  actionColumn,
  moreDetailsColumn,
  emptyMessage = 'No data found',
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
}: PaginatedDataTableProps<T, K>) {
  const [sortField, setSortField] = useState<K>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleSort = (field: K) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a: any, b: any) => {
      // Handle nested fields with dot notation (e.g., "orderDetails.0.orderId")
      const getNestedValue = (obj: any, path: string) => {
        const keys = path.split('.');
        return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
      };

      const fieldPath = String(sortField);
      const aValue = fieldPath.includes('.') ? getNestedValue(a, fieldPath) : a[sortField];
      const bValue = fieldPath.includes('.') ? getNestedValue(b, fieldPath) : b[sortField];

      // Handle different data types for sorting
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      // Handle date strings
      if (fieldPath.toLowerCase().includes('date') && typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper function to render cell content
  const renderCellContent = (item: T, column: { field: K; render?: (item: T) => React.ReactNode }) => {
    if (column.render) {
      return column.render(item);
    }

    const fieldPath = String(column.field);

    // Handle nested fields with dot notation
    if (fieldPath.includes('.')) {
      const keys = fieldPath.split('.');
      let value: any = item;

      for (const key of keys) {
        if (value === null || value === undefined) {
          return (
            <Typography variant="body2" sx={{ color: '#111827' }}>
              -
            </Typography>
          );
        }
        value = value[key as keyof typeof value];
      }

      return (
        <Typography variant="body2" sx={{ color: '#111827' }}>
          {value !== undefined && value !== null ? String(value) : '-'}
        </Typography>
      );
    }

    // Handle orderDetails array specially
    if (fieldPath === 'orderDetails' && Array.isArray((item as any)[fieldPath])) {
      const orderDetails = (item as any)[fieldPath] as OrderDetail[];

      if (orderDetails.length === 0) {
        return (
          <Typography variant="body2" sx={{ color: '#111827' }}>
            No orders
          </Typography>
        );
      }

      return (
        <Tooltip
          title={
            <Box>
              {orderDetails.map((order, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography variant="caption">ID: {order.orderId || '-'}</Typography>
                  <br />
                  <Typography variant="caption">Status: {order.orderStatus || '-'}</Typography>
                </Box>
              ))}
            </Box>
          }
        >
          <Typography variant="body2" sx={{ color: '#111827' }}>
            {orderDetails.length} order{orderDetails.length !== 1 ? 's' : ''}
          </Typography>
        </Tooltip>
      );
    }

    // Regular field
    return (
      <Typography variant="body2" sx={{ color: '#111827' }}>
        {(item as any)[column.field] !== undefined ? (item as any)[column.field] : '-'}
      </Typography>
    );
  };

  return (
    <>
      <Paper sx={{ boxShadow: 'none', border: '1px solid #E0E0E0', borderRadius: '8px', mb: 2 }}>
        <TableContainer>
          <Table>
            <SortableTableHeader
              columns={columns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              actionColumnLabel={actionColumn?.label}
            />
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  hover
                  onClick={() => onRowClick && onRowClick(item)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${keyExtractor(item)}-${String(column.field)}`}
                      sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}
                    >
                      {renderCellContent(item, column)}
                    </TableCell>
                  ))}
                  {actionColumn && (
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                      {actionColumn.render(item)}
                    </TableCell>
                  )}
                  {moreDetailsColumn && (
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                      {/* {moreDetailsColumn.render(item)} */}
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + (actionColumn ? 2 : 1)} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #E5E7EB',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: '#6B7280',
              fontSize: '0.875rem',
            },
            '.MuiTablePagination-select': {
              color: '#374151',
            },
            '.MuiTablePagination-actions': {
              color: '#374151',
            },
          }}
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedData.length} of {sortedData.length} items
        </Typography>
      </Box>
    </>
  );
}

export default PaginatedDataTable;

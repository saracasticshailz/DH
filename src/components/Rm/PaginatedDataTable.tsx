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
} from '@mui/material';
import { ChevronRight } from 'lucide-react';
import SortableTableHeader, { type SortDirection } from './SortableTableHeader';

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
      const aValue = a[sortField];
      const bValue = b[sortField];

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
                      key={`${keyExtractor(item)}-${column.field}`}
                      sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}
                    >
                      {column.render ? (
                        column.render(item)
                      ) : (
                        <Typography variant="body2" sx={{ color: '#111827' }}>
                          {(item as any)[column.field]}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                  {actionColumn && (
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                      {actionColumn.render(item)}
                    </TableCell>
                  )}
                  <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <ChevronRight size={20} />
                    </IconButton>
                  </TableCell>
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

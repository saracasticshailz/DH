'use client';

import type React from 'react';
import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthHeader } from '@/components/common/AppLayout';
import { COLORS } from '@/theme/colors';
import { AppButton } from '@/components';
import PaginatedDataTable from '@/components/Rm/PaginatedDataTable';
import {
  type Application,
  generateApplications,
  getStatusColor,
  getStatusTextColor,
} from '@/components/Rm/ApplicationStatusUtils';
import { filterData } from '@/utils/DataTableUtils';
import StatusChip from '@/components/Rm/StatusChip';
import TableFilters, { type FilterConfig, type FilterValues } from '@/components/Rm/TableFilters';

generateApplications;
// Generate sample data
const applications = generateApplications(30);

// Filter configurations
const filterConfigs: FilterConfig[] = [
  {
    name: 'searchTerm',
    label: 'Search',
    placeholder: 'Search by Mobile or Ref. Number',
    type: 'text',
    width: 2,
  },
  {
    name: 'duration',
    label: 'Duration',
    type: 'select',
    options: [
      { value: '3 months', label: '3 months' },
      { value: '6 months', label: '6 months' },
      { value: '1 year', label: '1 year' },
    ],
    validation: Yup.string().required('Duration is required'),
  },
  {
    name: 'applicationStatus',
    label: 'Application status',
    placeholder: 'Please select',
    type: 'select',
    options: [
      { value: '', label: 'Please select' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Pending' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
];

// Initial filter values
const initialFilterValues: FilterValues = {
  searchTerm: '',
  duration: '3 months',
  applicationStatus: '',
};

// Filter validation schema
const filterSchema = Yup.object({
  searchTerm: Yup.string(),
  duration: Yup.string().required('Duration is required'),
  applicationStatus: Yup.string(),
});

const RmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues);

  // Filter data based on search term
  const filteredData = filterData<Application>(applications, filterValues.searchTerm, [
    'customerName',
    'mobileNo',
    'referenceNo',
  ]);

  // Handle filter changes
  const handleFilter = (values: FilterValues) => {
    setFilterValues(values);
  };

  // Handle row click
  const handleRowClick = (application: Application) => {
    console.log('Application clicked:', application);
    // Navigate to application details
    // navigate(`/applications/${application.referenceNo}`);
  };

  // Table column definitions
  const columns = [
    {
      field: 'customerName' as const,
      label: 'Customer Name',
      sortable: true,
    },
    {
      field: 'mobileNo' as const,
      label: 'Mobile No.',
      sortable: true,
    },
    {
      field: 'referenceNo' as const,
      label: 'Reference No.',
      sortable: true,
    },
    {
      field: 'lastUpdated' as const,
      label: 'Last Updated',
      sortable: true,
    },
    {
      field: 'status' as const,
      label: 'Status',
      sortable: true,
      render: (item: Application) => (
        <StatusChip
          status={item.status}
          getStatusColor={() => getStatusColor(item.status)}
          getStatusTextColor={() => getStatusTextColor(item.status)}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: COLORS.OFF_WHITE_BG, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <AuthHeader />

        {/* Filters */}
        <TableFilters
          filters={filterConfigs}
          initialValues={filterValues}
          onFilter={handleFilter}
          validationSchema={filterSchema}
          actionButton={{
            label: 'New Application',
            onClick: () => navigate('/PreApprovalPage', { replace: true }),
          }}
        />

        {/* Data Table */}
        <PaginatedDataTable
          data={filteredData}
          columns={columns}
          initialSortField="customerName"
          keyExtractor={(item) => item.referenceNo}
          onRowClick={handleRowClick}
          actionColumn={{
            label: 'Next Action',
            render: (item: Application) =>
              item.nextAction ? (
                <AppButton
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#E0E0E0',
                    color: '#424242',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    '&:hover': {
                      borderColor: '#9E9E9E',
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  {item.nextAction}
                </AppButton>
              ) : null,
          }}
          emptyMessage="No applications found"
        />
      </Container>
    </Box>
  );
};

export default RmDashboard;

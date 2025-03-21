'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthHeader } from '@/components/common/AppLayout';
import { COLORS } from '@/theme/colors';
import { AppButton, AppLoading } from '@/components';
import PaginatedDataTable from '@/components/Rm/PaginatedDataTable';
import { type Application, getStatusColor, getStatusTextColor } from '@/components/Rm/ApplicationStatusUtils';
import { filterData } from '@/utils/DataTableUtils';
import StatusChip from '@/components/Rm/StatusChip';
import { useTranslation } from 'react-i18next';
import TableFilters, { type FilterConfig, type FilterValues } from '@/components/Rm/TableFilters';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import { isLoading } from '@/store/slices/CustomerAuthSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import NextActionDetailsModal from '@/components/modal/rm/NextActionDetailsModal';
import { setApplications, setError, setLoading } from '@/store/slices/RmDashboardSlice';
//git test
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
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues);
  // const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleFilter = (values: FilterValues) => {
    setFilterValues(values);
  };

  // Get applications from Redux store
  const applications = useAppSelector((state) => state.rmDashboard.applications);
  const dashboardLoading = useAppSelector((state) => state.rmDashboard.loading);
  const dashboardError = useAppSelector((state) => state.rmDashboard.error);
  const dispatch = useAppDispatch();

  const handleRowClick = (application: Application) => {
    console.log('Application clicked:', application);
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

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

  const fetchTableData = () => {
    modNetwork(
      API.FETCH_RM_DASHBOARD,
      { searchParameterType: '', searchParameterValue: '' },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('FETCH_RM_DASHBOARD', res);
          // Update Redux store instead of local state
          dispatch(setApplications(res.applicationDetails));
          dispatch(setLoading(false));
          dispatch(setError(null));
        } else {
          console.log('Error:', res);
          dispatch(setLoading(false));
          dispatch(setError('An error occurred. Please try again.'));
          alert('An error occurred. Please try again.');
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing data...');
      fetchTableData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const _isLoading = useAppSelector(isLoading);

  function onNextActionClick(item: Application) {
    console.log('Next action clicked:', item);

    setSelectedApplication(item);
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: COLORS.OFF_WHITE_BG, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <AuthHeader />
        {_isLoading && <AppLoading />}
        <NextActionDetailsModal
          open={isModalOpen}
          onClose={handleModalClose}
          customerDetails={
            selectedApplication
              ? {
                  customerName: selectedApplication.customerName,
                  mobileNo: selectedApplication.mobileNo,
                  referenceNo: selectedApplication.referenceNo,
                  lastUpdated: selectedApplication.lastUpdated,
                  submittedOn: selectedApplication.applicationSubmittedDate,
                  status: selectedApplication.status,
                }
              : {
                  customerName: '',
                  mobileNo: '',
                  referenceNo: '',
                  lastUpdated: '',
                  submittedOn: '',
                  status: '',
                }
          }
          applicationSteps={[
            {
              id: 1,
              name: 'Pre-approval',
              status: selectedApplication?.status?.toLowerCase().includes('pre-approval') ? 'in_progress' : 'completed',
            },
            {
              id: 2,
              name: 'Property Valuation',
              status: selectedApplication?.status?.toLowerCase().includes('valuation')
                ? 'in_progress'
                : selectedApplication?.status?.toLowerCase().includes('pre-approval')
                  ? 'pending'
                  : 'completed',
            },
            {
              id: 3,
              name: 'Final Offer Letter',
              status: selectedApplication?.status?.toLowerCase().includes('offer')
                ? 'in_progress'
                : selectedApplication?.status?.toLowerCase().includes('pre-approval') ||
                    selectedApplication?.status?.toLowerCase().includes('valuation')
                  ? 'pending'
                  : 'completed',
            },
          ]}
        />

        {/* Filters */}
        <Box sx={{ mt: 5 }}>
          <TableFilters
            filters={filterConfigs}
            initialValues={filterValues}
            onFilter={handleFilter}
            validationSchema={filterSchema}
            actionButton={{
              label: 'New Application',
              onClick: () => {
                // fetchTableData();
                navigate('/PreApprovalPage', { replace: true });
              },
            }}
          />
        </Box>

        {/* Data Table */}
        <PaginatedDataTable
          data={
            applications
            //   [
            //   {
            //     customerName: 'SHIVAM KUMAR',
            //     mobileNo: '9876543210',
            //     emailId: 's@s.com',
            //     applicationNo: '12434532',
            //     leadReferenceNo: 'dsadqe13',
            //     applicationReferenceNo: '12wdsdas323',
            //     applicationSubmittedDate: '12/12/1290',
            //     applicationStatus: 'OPEN',
            //     customerType: 'dnsakda',
            //     orderDetails: [{ orderld: 'dasa', orderStatus: 'dsad' }],
            //     referenceNo: 'dasd',
            //     lastUpdated: 'dasda',
            //     status: 'Pre-approval Rejected',
            //   },
            // ]
          }
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
                  onClick={() => {
                    onNextActionClick(item);
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

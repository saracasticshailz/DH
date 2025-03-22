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
import { getLoanStatusText } from '@/utils/helper';
import { IconButton } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { setValuationActiveStep } from '@/store/slices/ValuationSlice';

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

  function moreInfoAction(application: Application) {
    console.log('Application clicked:', application);
    setSelectedApplication(application);
    setIsModalOpen(true);
  }

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
      field: 'applicationNo' as const,
      label: 'Application No.',
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
          status={getLoanStatusText(item.applicationStatus)}
          getStatusColor={() => getStatusColor(item.applicationStatus)}
          getStatusTextColor={() => getStatusTextColor(item.applicationStatus)}
        />
      ),
    },
  ];

  const fetchTableData = () => {
    const restemp = {
      rmCode: 'C106794',
      oprstatus: 0,
      rmMobile: '971562910316',
      returnCode: '0',
      rmEmailId: 'HeenaRajwani.ext@adcb.com',
      opstatus: 0,
      applicationDetails: [
        {
          applicationReferenceNo: 'LP-ML-00014335',
          customerType: 'ETB',
          applicationStatus: 'PP',
          applicationNo: 'BYUT0005678',
          applicationSubmittedDate: '2025-03-05 10:09:24.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-00014335',
          customerName: 'ONE N THREE  FIFTY ONE  NINETY SEVEN',
          lastUpdated: '2025-03-05 10:09:24.0',
          status: null,
          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143209',
          customerType: 'ETB',
          applicationStatus: 'UP',
          applicationNo: 'BYUT0005674',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143209',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',
          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143358',
          customerType: 'ETB',
          applicationStatus: 'PR',
          applicationNo: 'BYUT00056788',
          applicationSubmittedDate: '2025-03-05 10:09:24.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143358',
          customerName: 'ONE N THREE  FIFTY ONE  NINETY SEVEN',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143207',
          customerType: 'ETB',
          applicationStatus: 'PC',
          applicationNo: 'BYUT00056747',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143207',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143206',
          customerType: 'ETB',
          applicationStatus: 'NO',
          applicationNo: 'BYUT00056746',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143206',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143205',
          customerType: 'ETB',
          applicationStatus: 'DU',
          applicationNo: 'BYUT00056745',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143205',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143204',
          customerType: 'ETB',
          applicationStatus: 'CP',
          applicationNo: 'BYUT00056744',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143204',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143203',
          customerType: 'ETB',
          applicationStatus: 'OI',
          applicationNo: 'BYUT00056743',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143203',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
        {
          applicationReferenceNo: 'LP-ML-000143202',
          customerType: 'ETB',
          applicationStatus: 'VC',
          applicationNo: 'BYUT00056742',
          applicationSubmittedDate: '2025-02-20 16:48:15.0',
          emailId: 'e***l@***.com',
          mobileNo: '***954',
          leadReferenceNo: 'LP-ML-000143202',
          customerName: 'ONE N SIX  FORTY TWO  THREE  FOUR',
          lastUpdated: '2025-03-05 10:09:24.0',

          orderDetails: null,
        },
      ],
      rmName: 'MAHJOOB MUSTAFA',
      httpStatusCode: 0,
    };
    dispatch(setApplications(restemp.applicationDetails));

    modNetwork(
      API.FETCH_RM_DASHBOARD,
      { searchParameterType: 'RMCODE', searchParameterValue: 'C121010' },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('FETCH_RM_DASHBOARD LOADING', res);
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

  function handleValuationAction(item: Application) {
    console.log('Next action clicked:', item);

    setSelectedApplication(item);

    if (item.applicationStatus === 'VC' || item.applicationStatus === 'OI') {
      return;
    } else if (item.applicationStatus === 'PC' || item.applicationStatus === 'UP') {
    } else if (item.applicationStatus === 'NO') {
      dispatch(setValuationActiveStep(2));
    } else if (item.applicationStatus === 'CP' || item.applicationStatus === 'DU') {
      dispatch(setValuationActiveStep(3));
    }
    navigate('/PropertyValuation');
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
                  applicationNo: selectedApplication.applicationNo,
                  lastUpdated: selectedApplication.lastUpdated,
                  submittedOn: selectedApplication.applicationSubmittedDate,
                  applicationStatus: selectedApplication.applicationStatus,
                }
              : {
                  customerName: '',
                  mobileNo: '',
                  applicationNo: '',
                  lastUpdated: '',
                  submittedOn: '',
                  applicationStatus: '',
                }
          }
          applicationSteps={[
            {
              id: 1,
              name: 'Pre-approval',
              status: 'in_progress',
              //  status: selectedApplication?.status?.toLowerCase().includes('pre-approval') ? 'in_progress' : 'completed',
            },
            {
              id: 2,
              name: 'Property Valuation',
              status: 'in_progress',
              // status: selectedApplication?.status?.toLowerCase().includes('valuation')
              //   ? 'in_progress'
              //   : selectedApplication?.status?.toLowerCase().includes('pre-approval')
              //     ? 'pending'
              //     : 'completed',
            },
            {
              id: 3,
              name: 'Final Offer Letter',
              status: 'in_progress',
              // status: selectedApplication?.status?.toLowerCase().includes('offer')
              //   ? 'in_progress'
              //   : selectedApplication?.status?.toLowerCase().includes('pre-approval') ||
              //       selectedApplication?.status?.toLowerCase().includes('valuation')
              //     ? 'pending'
              //     : 'completed',
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
          data={applications}
          columns={columns}
          initialSortField="customerName"
          keyExtractor={(item) => item.applicationNo}
          //onRowClick={handleRowClick}
          actionColumn={{
            label: 'Next Action',
            render: (item: Application) =>
              t('valuationButton.' + item.applicationStatus, { defaultValue: 'NA' }) !== 'NA' ? (
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
                    handleValuationAction(item);
                  }}
                >
                  {t('valuationButton.' + item.applicationStatus, { defaultValue: 'NA' })}
                </AppButton>
              ) : null,
          }}
          moreDetailsColumn={{
            label: 'More Info',
            render: (item: Application) =>
              t('valuationButton.' + item.applicationStatus, { defaultValue: 'NA' }) !== 'NA' ? (
                <IconButton size="small" sx={{ color: '#6B7280' }}>
                  <ChevronRight size={20} />
                </IconButton>
              ) : null,
          }}
          emptyMessage="No applications found"
        />
      </Container>
    </Box>
  );
};

export default RmDashboard;

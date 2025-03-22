'use client';
import { Drawer, IconButton, Typography, Box, Grid, Chip, useTheme, useMediaQuery, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getLoanStatusText } from '@/utils/helper';

interface ApplicationStep {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface CustomerDetails {
  customerName: string;
  mobileNo: string;
  applicationNo: string;
  lastUpdated: string;
  submittedOn: string;
  applicationStatus: string;
}

interface NextActionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  customerDetails: CustomerDetails;
  applicationSteps: ApplicationStep[];
}

// Styled components
const StepContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
}));

const StepIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active, theme }) => ({
  width: 4,
  height: '100%',
  position: 'absolute',
  left: 0,
  top: 0,
  backgroundColor: active ? '#FF0000' : '#CCCCCC',
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
  fontSize: '0.75rem',
  height: 24,
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  marginBottom: theme.spacing(3),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: '#666666',
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: '#333333',
  fontSize: '1rem',
  fontWeight: 500,
}));

export default function NextActionDetailsModal({
  open,
  onClose,
  customerDetails,
  applicationSteps,
}: NextActionDetailsModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to get status chip color
  const getStatusChipProps = (status: string) => {
    if (status.toLowerCase().includes('pre-approval')) {
      return {
        label: status,
        sx: { backgroundColor: '#E6F0FF', color: '#0052CC' },
      };
    } else if (status.toLowerCase().includes('completed')) {
      return {
        label: status,
        sx: { backgroundColor: '#E6F9EF', color: '#00875A' },
      };
    } else if (status.toLowerCase().includes('rejected')) {
      return {
        label: status,
        sx: { backgroundColor: '#FFEBE6', color: '#DE350B' },
      };
    } else {
      return {
        label: status,
        sx: { backgroundColor: '#F4F5F7', color: '#505F79' },
      };
    }
  };

  // Helper function to get step status label
  const getStepStatusLabel = (status: ApplicationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  // Helper function to get step status chip props
  const getStepStatusChipProps = (status: ApplicationStep['status']) => {
    switch (status) {
      case 'completed':
        return { sx: { backgroundColor: '#E6F9EF', color: '#00875A' } };
      case 'in_progress':
        return { sx: { backgroundColor: '#FFF0E6', color: '#FF8B00' } };
      case 'pending':
        return { sx: { backgroundColor: '#F4F5F7', color: '#505F79' } };
      default:
        return { sx: { backgroundColor: '#F4F5F7', color: '#505F79' } };
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '500px', md: '600px' },
          p: 3,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          backgroundColor: '#F9FAFB',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%', overflow: 'auto' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ pt: 5, pb: 3 }}>
          {/* Customer Information Section */}
          <InfoGrid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Customer Name</InfoLabel>
              <InfoValue>{customerDetails.customerName}</InfoValue>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Mobile No.</InfoLabel>
              <InfoValue>{customerDetails.mobileNo}</InfoValue>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Reference No.</InfoLabel>
              <InfoValue>{customerDetails.applicationNo}</InfoValue>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Last Updated</InfoLabel>
              <InfoValue>{customerDetails.lastUpdated}</InfoValue>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Submitted On</InfoLabel>
              <InfoValue>{customerDetails.submittedOn}</InfoValue>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoLabel>Status</InfoLabel>
              <StatusChip {...getStatusChipProps(customerDetails.applicationStatus)} />
            </Grid>
          </InfoGrid>

          {/* Application Steps Section */}
          <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
            {applicationSteps.map((step) => (
              <StepContainer key={step.id}>
                <StepIndicator active={step.status === 'in_progress'} />
                <Box
                  sx={{ pl: 3, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {step.id}. {step.name}
                  </Typography>
                  {step.status !== 'pending' && (
                    <Chip
                      label={getStepStatusLabel(step.status)}
                      size="small"
                      {...getStepStatusChipProps(step.status)}
                    />
                  )}
                </Box>
              </StepContainer>
            ))}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

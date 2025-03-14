import { Box, Container, Grid2 as Grid } from '@mui/material';
import ImageProgressBar from '@/components/common/ImageProgressBar/ImageProgressBar';
import LoanDetails from './LoanDetails';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import EmploymentDetails from './EmploymentDetails';
import IncomeDetailsForm from './IncomeDetails/Index';
import { useSelector } from 'react-redux';
import PreApprovalReview from './PreApprovalReview';
import PaymentForm from '../PropertyValuation/PaymentForm';
import PersonalDetailsForm from './PersonalDetails/PersonalDetailsForm';
import { useAppSelector } from '@/hooks/redux';
import { selectAuth } from '@/store/slices/CustomerAuthSlice';
import { IMG } from '@/assets/images';
import CreateCustomerProfile from '@/views/RM/CreateCutsomerProfile/CreateCustomerProfile';

export default function PreApprovalPage() {
  const { activeStep } = useSelector((state: any) => state.mortgage.preApproval);
  const userDetails = useAppSelector(selectAuth);
  const isRmUser = userDetails?.customerType === 'RM';

  console.log('userDetails', userDetails);

  const renderActiveForm = () => {
    switch (activeStep) {
      case 0:
        return <LoanDetails />;
      case 1:
        return <EmploymentDetails />;
      case 2:
        return <IncomeDetailsForm />;
      case 3:
        return <PreApprovalReview />;
      // case 4:
      //   return <PaymentForm />;
      default:
        return <LoanDetails />;
    }
  };

  const renderNTBActiveForm = () => {
    switch (activeStep) {
      case 0:
        return <PersonalDetailsForm />;
      case 1:
        return <LoanDetails />;
      case 2:
        return <EmploymentDetails />;
      case 3:
        return <IncomeDetailsForm />;
      case 4:
        return <PreApprovalReview />;
      // case 5:
      //   return <PaymentForm />;
      default:
        return <LoanDetails />;
    }
  };

  const renderRMNewAppForm = () => {
    switch (activeStep) {
      case 0:
        return <CreateCustomerProfile />;
      case 1:
        return <LoanDetails />;
      case 2:
        return <EmploymentDetails />;
      case 3:
        return <IncomeDetailsForm />;
      case 4:
        return <PreApprovalReview />;
      // case 5:
      //   return <PaymentForm />;
      default:
        return <LoanDetails />;
    }
  };

  // console.log(userDetails?.customerType);

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid
          container
          //spacing={2}
          sx={{
            alignItems: 'center',
            color: '#5d656b',
            paddingTop: 3,
            // marginTop: -2,
          }}
        >
          <Grid size={6}>
            <img src={IMG.AppLogo} alt="ADCB" loading="lazy" height={10} />
          </Grid>
        </Grid>
        <Grid container spacing={3} marginTop={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ImageProgressBar
              currentStep={activeStep + 1}
              totalSteps={isRmUser ? 4 : userDetails?.customerType === 'NTB' ? 5 : 4}
              title={'PreApproval'}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {/* {renderRMNewAppForm()} */}
            {userDetails?.customerType === 'NTB'
              ? renderNTBActiveForm()
              : isRmUser //or replace if user is RM logic
                ? renderRMNewAppForm()
                : renderActiveForm()}
          </Grid>
        </Grid>
        <AuthFooter />
      </Container>
    </Box>
  );
}

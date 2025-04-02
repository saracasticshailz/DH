'use client';

import type React from 'react';
import { Box, Typography, Button, Skeleton, useMediaQuery, useTheme, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IMG } from '@/assets/images';
import { useState, useEffect } from 'react';
import { saveFormData, getFormData } from '@/utils/offlineStorage';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPreApprovalStep } from '@/store/slices/MortgageSlice';
import { selectedPreApprovalData } from '@/store/selectors/mortgageSelectors';
import { useNavigate } from 'react-router-dom';
import { selectAuth, updateApplicationStatus, updateLapsApplicationNo } from '@/store/slices/CustomerAuthSlice';
// @ts-ignore
import { Invoker } from '../../../../v2/common/modules/modServiceInvoker';
import { RootState } from '@/store';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components';
import API from '@/utils/apiEnpoints';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

interface ReviewSection {
  label: string;
  value: string;
}

const Section: React.FC<{
  title: string;
  items: ReviewSection[];
  onEdit: () => void;
  isLoading?: boolean;
}> = ({ title, items, onEdit, isLoading = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 1.5, md: 2 },
          borderBottom: '1px solid #E5E7EB',
          pb: 1,
        }}
      >
        {isLoading ? (
          <Skeleton width={150} height={32} />
        ) : (
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            sx={{
              color: '#111827',
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        )}
        <Button
          startIcon={<img src={IMG.EditIcon || '/placeholder.svg'} alt="edit" width={16} height={16} />}
          sx={{
            color: '#E31B23',
            '&:hover': { backgroundColor: 'transparent' },
            textTransform: 'none',
            fontWeight: 500,
            minWidth: isMobile ? 'auto' : undefined,
            px: isMobile ? 1 : 2,
          }}
          onClick={onEdit}
        >
          {!isMobile && 'EDIT'}
        </Button>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          '& > *:nth-of-type(odd)': {
            backgroundColor: { xs: '#F9FAFB', md: 'transparent' },
          },
        }}
      >
        {items.map((item, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Box sx={{ p: { xs: 1.5, md: 0 } }}>
              {isLoading ? (
                <>
                  <Skeleton width={100} height={20} sx={{ mb: 0.5 }} />
                  <Skeleton width="100%" height={24} />
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#111827',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.value}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  );
};

const PreApprovalReview = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const { loanDetails, employmentDetails, incomeDetails, personalDetails } = useAppSelector(selectedPreApprovalData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails = useAppSelector(selectAuth);
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  const reviewData = {
    PersonalDetails: [
      { label: 'Costumer name', value: personalDetails.customerName },
      { label: 'Gender', value: personalDetails.gender },
      { label: 'Date of birth', value: personalDetails.dateOfBirth },
      { label: 'Nationality', value: personalDetails.nationality },
      { label: 'Passport Number', value: personalDetails.passportNumber },
      { label: 'Passport Expiry', value: personalDetails.passportExpiry },
      { label: 'PO Box', value: personalDetails.poBox },
      { label: 'State', value: personalDetails.state },
      { label: 'Country of residence', value: personalDetails.countryOfResidence },
    ],
    LoanDetails: [
      { label: 'Loan type', value: loanDetails.loanPreference },
      { label: 'Type of purchase', value: loanDetails.purchaseType },
      { label: 'Loan tenure', value: loanDetails.loanTenure },
      { label: 'Your mortgage specialist code (optional)', value: loanDetails.specialistCode },
      {
        label: 'Finance pricing options',
        value:
          loanDetails.financingOption === 'Fixed'
            ? '5 Year applicable fixed interest / Ijarah rate p.a. for first 5 years followed by 3 month Eibor plus applicable margins thereafter. Hybrid pricing structure.'
            : '3 Year applicable fixed interest / Ijarah rate p.a. for first 3 years followed by 3 month Eibor plus applicable margins thereafter. Hybrid pricing structure.',
      },
      { label: 'Requested loan in AED', value: loanDetails.loanAmount },
    ],
    EmploymentDetails: [
      { label: 'Employment type', value: employmentDetails.employmentType },
      { label: 'Employer name', value: employmentDetails.employerName },
      { label: 'Date of joining current employer', value: employmentDetails.joiningDate },
    ],
    IncomeDetails: [
      { label: 'Fixed monthly income', value: incomeDetails.fixedMonthlyIncome },
      { label: 'Annual rental income', value: incomeDetails.annualRentalIncome },
      { label: 'Staying in company provided accommodation', value: incomeDetails.stayingInCompanyAccommodation },
      { label: 'Other monthly income', value: incomeDetails.otherMonthlyIncome },
    ],
  };

  const [reviewDataState, setReviewDataState] = useState(reviewData);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const loadCachedData = async () => {
      try {
        const cached = await getFormData('reviewData');
        if (cached) {
          setReviewDataState(cached);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cached data:', error);
        setIsLoading(false);
      }
    };

    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    saveFormData('reviewData', reviewDataState);
  }, [reviewDataState]);

  const handleBack = () => {
    dispatch(setPreApprovalStep(preApproval.activeStep + 1));
  };

  const handleCancel = () => {
    //dispatch(setPreApprovalStep(0));
    navigate(-1);
  };

  const handleSubmit = async () => {
    modNetwork(
      API.SUBMIT_LOAN_API,
      {
        applicationRefNumber: userDetails.applicationRefNumber,
        lapsRefNumber: userDetails.lapsRefNumber,
        loanPreference: loanDetails.loanPreference,
        financePricingOption: loanDetails.financingOption,
        typeOfPurchase: loanDetails.purchaseType,
        mortgageSpecialistCode: loanDetails.specialistCode,
        requestedLoanAmount: loanDetails.loanAmount,
        loanTenure: loanDetails.loanTenure,
        employmentType: employmentDetails.employmentType,
        employerName: employmentDetails.employerName,
        employerCode: employmentDetails.employerCode,
        DOJ: employmentDetails.joiningDate,

        monthlyFixedSalary: incomeDetails.fixedMonthlyIncome,
        isCompanyAccommodation: incomeDetails.stayingInCompanyAccommodation,
        monthlyOtherIncome: incomeDetails.otherMonthlyIncome,
        annualRentallncome: incomeDetails.annualRentalIncome,

        mobileNo: userDetails.customerMobileNumber,
        gender: personalDetails.gender,
        customerName: userDetails.customerName,
        residencePOBox: personalDetails.poBox,
        residenceState: personalDetails.state,
        nationalityCode: personalDetails.countryOfResidence,
        emiratesId: userDetails.emiratesId,

        passportExpiryDate: personalDetails.passportExpiry,
        passportNumber: personalDetails.passportNumber,
        residenceCountry: personalDetails.countryOfResidence,
      },
      // {
      //   applicationRefNumber: 'LP-ML-00014397',
      //   lapsRefNumber: '017904',
      //   loanPreference: 'A',
      //   financePricingOption: 'Fixed',
      //   typeOfPurchase: '2',
      //   mortgageSpecialistCode: 'C106',
      //   requestedLoanAmount: '2000000',
      //   loanTenure: '25',
      //   employmentType: 'SA',
      //   employerName: 'ADNOC ONSHORE',
      //   employerCode: '002100',
      //   DOJ: '03/01/2010',
      //   housingRentAllowance: 100000,
      //   isCompanyAccommodation: 'yes',
      //   monthlyOtherIncome: 1000000,
      //   annualRentallncome: 100000,
      //   mobileNo: '971582109809',
      //   gender: 'Female',
      //   customerName: 'SHAILESH',
      //   residencePOBox: 'PO Box 7',
      //   residenceState: 'dubai',
      //   nationalityCode: 'uae',
      //   clientTime: '1742289582895',
      // },
      (res: any) => {
        console.log('sub_loan_application RES', res);
        dispatch(
          updateApplicationStatus({
            loanApplicationStatus: 'IN_PROGRESS',
          }),
          updateLapsApplicationNo({
            lapsApplicationNo: res.lapsApplicationNo,
          })
        );
        if (res.oprstatus == 0 && res.returnCode == 0) {
          navigate('/Dashboard');
        } else {
          navigate('/Dashboard');
          navigate(-1);
          alert(res.errmsg);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  return (
    <CardContent
      sx={{
        maxWidth: { xs: '100%', md: 1200 },
        mx: 'auto',
        backgroundColor: 'white',
        borderRadius: { xs: 0, md: 2 },
        boxShadow: { xs: 'none', md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        overflow: 'visible',
      }}
    >
      <Box sx={{ minHeight: '100vh' }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            mb: { xs: 2, md: 4 },
            color: '#111827',
            fontWeight: 600,
            px: { xs: 2, md: 0 },
            marginLeft: 1.25,
          }}
        >
          {t('review.title')}
        </Typography>

        {!isOnline && (
          <Box
            sx={{
              mx: { xs: 2, md: 0 },
              mb: 2,
              p: 2,
              backgroundColor: '#FEF2F2',
              borderRadius: 1,
              color: '#991B1B',
            }}
          >
            {t('review.offlineMessage')}
          </Box>
        )}

        <Box sx={{ px: { xs: 2, md: 0 } }}>
          {userDetails?.customerType === 'NTB' && (
            <Section
              title={t('preApproval.incomeDetails.personalDetails.title')}
              items={reviewDataState.PersonalDetails}
              onEdit={() => dispatch(setPreApprovalStep(preApproval.activeStep + 1))}
              isLoading={isLoading}
            />
          )}
          <Section
            title={t('preApproval.loanDetails.title')}
            items={reviewDataState.LoanDetails}
            onEdit={() => dispatch(setPreApprovalStep(1))}
            isLoading={isLoading}
          />

          <Section
            title={t('preApproval.employmentDetails.title')}
            items={reviewDataState.EmploymentDetails}
            onEdit={() => dispatch(setPreApprovalStep(2))}
            isLoading={isLoading}
          />

          <Section
            title={t('preApproval.incomeDetails.title')}
            items={reviewDataState.IncomeDetails}
            onEdit={() => dispatch(setPreApprovalStep(3))}
            isLoading={isLoading}
          />

          {/* <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{
                  mb: 2,
                  color: '#111827',
                  fontWeight: 600,
                }}
              >
                Discount Code
              </Typography>
              <Grid container spacing={2} sx={{ maxWidth: 400 }}>
                <Grid size={{ xs: 8 }}>
                  <TextInput placeholder="Enter Discount Code" size={isMobile ? 'small' : 'medium'} fullWidth />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <AppButton fullWidth={false} withBorder>
                    APPLY
                  </AppButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
        </Box>

        <Box
          sx={{
            // position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 2, md: 0 },
            mt: 4,
            pt: 2,
            pb: { xs: 2, md: 0 },
            mx: { xs: -2, md: 0 },
            px: { xs: 2, md: 0 },
          }}
        >
          <Grid container height={48} spacing={2} sx={{justifyContent: 'flex-start' }}> 
          {/* maxWidth: { xs: '100%', md: '30%' },  */}
            <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <AppButton
                variant="outlined"
                fullWidth
                onClick={handleBack}
                sx={{
                  borderColor: '#D1D5DB',
                  //width: '180px', // Set the width to 180px
                  minWidth: { md:180 },
                  color: '#374151',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {t('preApproval.incomeDetails.buttons.back')}
              </AppButton>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <AppButton
                variant="text"
                fullWidth
                onClick={handleCancel}
                sx={{
                  borderColor: '#D1D5DB',
                 // width: '180px', // Set the width to 180px
                 minWidth: { md:120 },
                  color: '#374151',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {t('preApproval.incomeDetails.buttons.cancel')}
              </AppButton>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth={isMobile}
            sx={{
              bgcolor: '#E31B23',
              color: 'white',
              '&:hover': {
                bgcolor: '#C81E24',
              },
              minWidth: { md:180 },
            }}
            onClick={handleSubmit}
          >
            {t('preApproval.incomeDetails.buttons.submit')}
          </Button>
        </Box>
      </Box>
      {/* </CardContent> */}
    </CardContent>
  );
};

export default PreApprovalReview;

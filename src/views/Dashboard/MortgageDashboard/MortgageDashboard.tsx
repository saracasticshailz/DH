

import { Box, Container, Typography, Grid2 as Grid } from '@mui/material';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StyledCard, HeroSection } from './styles';
import MortgageStep from '@/components/Dashboard/MortgageStep';
import GuideCard from '@/components/Dashboard/GuideCard';
import DealsCard from '@/components/Dashboard/DealsCard';
import ContactCard from '@/components/common/SpecialistCard';
import { COLORS } from '@/theme/colors';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import { setValuationActiveStep } from '@/store/slices/ValuationSlice';

import {
  // getCustomerJourneyStatus,
  selectApplicationDetails,
  selectAuth,
  selectCustomerDetails,
  selectRMDetails,
} from '@/store/slices/CustomerAuthSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import API from '@/utils/apiEnpoints';
import {generateJsonOrderFetch} from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationOrder';

export default function MortgageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isFocused, setIsFocused] = useState(true);
  const applicationDetails = useAppSelector(selectApplicationDetails);
  const customerDetails = useAppSelector(selectCustomerDetails);
  const [lapsRefNumber, setlapsRefNumber] = useState('');
  const selectRMDetails_ = useAppSelector(selectRMDetails);
  const journeyStatus: any = applicationDetails.loanApplicationStatus;
  const customerName: any = customerDetails.customerName;
  const userDetails = useAppSelector(selectAuth);
  

   useEffect(()=>{
       valuationOrderFetch();
       window.scrollTo({
        top: 0,
        behavior: 'smooth',
 });
   },[]);


  const valuationOrderFetch = async () => {
    console.log('valuationOrderFetch api before call', userDetails.lapsRefNumber);
    modNetwork(
      API.PROPERTY_VALUATION_ORDER_FETCH,
      {
        bankReferenceId : "1234",
      },
      (res: any) => {
        console.log(API.PROPERTY_VALUATION_ORDER_FETCH, res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('valuationOrderFetch api response ', res);
        } else {
          alert(res.errmsg);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const deals = [
    {
      id: '1',
      image: '/truck.jpg',
      title: '800Truck',
      description: '30% discount on moving services at 800Truck',
    },
    {
      id: '2',
      image: '/legal.jpg',
      title: 'Just Wills',
      description: '50% discount on will drafting services at JW Legal Consultants',
    },
  ];

  const resendApprovals = async (approvalType: string) => {
    modNetwork(
      API.RESEND_APPROVALS,
      {
        lapsRefNumber: lapsRefNumber + '_P', // If approvalType is V, we need to send lapsRefNumber+Valuation_OrderRefno"
      },
      (res: any) => {
        console.log(API.RESEND_APPROVALS, res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('Approval Resend suucessfully');
        } else {
          alert(res.errmsg);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const handlePreapprovalAction = async () => {
    if (journeyStatus !== 'PR' && journeyStatus !== 'PP' && journeyStatus !== 'IN_PROGRESS' && journeyStatus !== '') {
      resendApprovals('P');
    } else {
      navigate('/PreApprovalPage');
    }
  };
  const handleValuationAction = async () => {
    console.log('handleValuationAction journeyStatus ',journeyStatus );
    if (journeyStatus === 'VC' || journeyStatus === 'OI') {
      return;
    } else if (journeyStatus === 'PC' || journeyStatus === 'UP') {
    } else if (journeyStatus === 'NO') {
      dispatch(setValuationActiveStep(2));
    } else if (journeyStatus === 'CP' || journeyStatus === 'DU') {
      dispatch(setValuationActiveStep(3));
    }
    navigate('/PropertyValuation');
  };

  return (
    <Box sx={{ bgcolor: COLORS.OFF_WHITE_BG, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <AuthHeader />

        <Grid container spacing={3} marginTop={2} marginBottom={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <StyledCard>
              <HeroSection>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {t('dashboardScreen.hero.welcome')} {customerName}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {t('dashboardScreen.hero.title')}
                </Typography>
              </HeroSection>

              <Box sx={{ bgcolor: 'white', borderRadius: '24px 24px 0 0', mt: -3 }}>
                <MortgageStep
                  title={t('dashboardScreen.steps.preApproval.title')}
                  description={
                    journeyStatus !== 'PR' &&
                    journeyStatus !== 'PP' &&
                    journeyStatus !== 'IN_PROGRESS' &&
                    journeyStatus !== '' //Blank scenario handled
                      ? t('dashboardScreen.steps.preApproval.congratulations')
                      : journeyStatus == 'IN_PROGRESS'
                        ? t('dashboardScreen.steps.preApproval.inProgressDescription')
                        : t('dashboardScreen.steps.preApproval.description')
                  }
                  subDescription={t('dashboardScreen.steps.preApproval.subDescription')}
                  buttonText={t('preapprovalButton.' + journeyStatus, { defaultValue: 'APPLY' })}
                  active={true}
                  onButtonClick={handlePreapprovalAction}
                  applnstatus={
                    t('preapprovalSubStatus.' + journeyStatus, { defaultValue: undefined }) as
                      | 'InProgress'
                      | 'Rejected'
                      | 'Complete'
                      | 'Pending'
                      | undefined
                  } // Type assertion here
                />

                <MortgageStep
                  title={t('dashboardScreen.steps.propertyValuation.title')}
                  description={t('dashboardScreen.steps.propertyValuation.description')}
                  buttonText={t('valuationButton.' + journeyStatus, { defaultValue: 'NA' })}
                  onButtonClick={handleValuationAction}
                  applnstatus={
                    t('valuationSubStatus.' + journeyStatus, { defaultValue: undefined }) as
                      | 'InProgress'
                      | 'Rejected'
                      | 'Complete'
                      | 'Pending'
                      | undefined
                  } // Type assertion here
                />

                <MortgageStep
                  title={t('dashboardScreen.steps.finalOffer.title')}
                  description={t('dashboardScreen.steps.finalOffer.description')}
                />
              </Box>
            </StyledCard>
          </Grid>

          {/* Right Side Cards */}
          <Grid size={{ xs: 12, md: 4 }}>
            {selectRMDetails_.rmName !== '' &&
              selectRMDetails_.rmName !== 'null' &&
              selectRMDetails_.rmName !== null && (
                <ContactCard
                  name={selectRMDetails_?.rmName ? selectRMDetails_.rmName : 'ADCB RM'}
                  email={selectRMDetails_?.rmEmailId ? selectRMDetails_.rmEmailId : 'adcbmortgagerm@adcb.com'}
                  phone={selectRMDetails_?.rmMobile ? selectRMDetails_.rmMobile : '+971 000000000'}
                />
              )}

            <GuideCard
              title={t('dashboardScreen.guide.title')}
              description={t('dashboardScreen.guide.description')}
              buttonText={t('dashboardScreen.guide.button')}
              onDownload={() => console.log('Download guide')}
            />

            <DealsCard
              title={t('dashboardScreen.deals.title')}
              description={t('dashboardScreen.deals.description')}
              viewAllText={t('dashboardScreen.deals.viewAll')}
              deals={deals}
              onViewAll={() => console.log('View all deals')}
            />
          </Grid>
          <Typography variant="body2" color="text.secondary">
            {t('dashboardScreen.deals.lastUpdatedMessage')}
          </Typography>
        </Grid>
        <AuthFooter />
      </Container>
    </Box>
  );
}

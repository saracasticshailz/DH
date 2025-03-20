import { Box, Container, Typography, Grid2 as Grid } from '@mui/material';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { StyledCard, HeroSection } from './styles';
import MortgageStep from '@/components/Dashboard/MortgageStep';
import GuideCard from '@/components/Dashboard/GuideCard';
import DealsCard from '@/components/Dashboard/DealsCard';
import ContactCard from '@/components/common/SpecialistCard';
import { COLORS } from '@/theme/colors';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import {
  // getCustomerJourneyStatus,
  selectApplicationDetails,
  selectAuth,
  selectCustomerDetails,
  selectRMDetails,
  getLoanStatusText,
} from '@/store/slices/CustomerAuthSlice';
import { useAppSelector } from '@/hooks/redux';
import API from '@/utils/apiEnpoints';

export default function MortgageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const applicationDetails = useAppSelector(selectApplicationDetails);
  const customerDetails = useAppSelector(selectCustomerDetails);
  const [lapsRefNumber, setlapsRefNumber] = useState('');
  const selectRMDetails_ = useAppSelector(selectRMDetails);
  const journeyStatus: any = applicationDetails.loanApplicationStatus;
  // console.log('journeyStatus', journeyStatus);
  // console.log('selectRMDetails_', selectRMDetails_);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

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
      lapsRefNumber: lapsRefNumber+"_P", // If approvalType is V, we need to send lapsRefNumber+Valuation_OrderRefno"
      
    },
    (res: any) => {
      console.log(API.RESEND_APPROVALS, res);

      if (res.oprstatus == 0 && res.returnCode == 0) {
       
        console.log("Approval Resend suucessfully");
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
                  {t('dashboardScreen.hero.welcome')}
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
                  buttonText={t('dashboardScreen.steps.preApproval.apply')}
                  active={true}
                  onButtonClick={() => {
                    // console.log(jou);

                    journeyStatus !== 'PR' &&
                    journeyStatus !== 'PP' &&
                    journeyStatus !== 'IN_PROGRESS' &&
                    journeyStatus !== '' //Blank scenario handled
                      ? resendApprovals('P')
                      : navigate('/PreApprovalPage');
                  }}
                  status={
                    journeyStatus === ''
                      ? 'new'
                      : journeyStatus !== 'PR' && journeyStatus !== 'PP' && journeyStatus !== 'IN_PROGRESS'
                        ? 'completed'
                        : journeyStatus === 'IN_PROGRESS'
                          ? 'in_progress'
                          : 'in_progress'
                  }
                />

                {/* <MortgageStep
                  title={t('dashboardScreen.steps.preApproval.title')}
                  description={t('dashboardScreen.steps.preApproval.description')}
                  subDescription={t('dashboardScreen.steps.preApproval.subDescription')}
                  status={journeyStatus === 'Apply' ? 'new' : 'in_progress'}
                  buttonText="Apply"
                  onButtonClick={() => console.log('clicked')}
                  withButton={true}
                  active
                /> */}

                <MortgageStep
                  title={t('dashboardScreen.steps.propertyValuation.title')}
                  description={t('dashboardScreen.steps.propertyValuation.description')}
                  buttonText={t('dashboardScreen.steps.propertyValuation.requestCalculation')}
                  onButtonClick={() => navigate('/PropertyValuation')}
                  //withButton={true}
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
            { selectRMDetails_.rmName !== '' && selectRMDetails_.rmName !== null && (
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

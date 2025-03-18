import { Box, Container, Typography, Grid2 as Grid } from '@mui/material';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StyledCard, HeroSection } from './styles';
import MortgageStep from '@/components/Dashboard/MortgageStep';
import GuideCard from '@/components/Dashboard/GuideCard';
import DealsCard from '@/components/Dashboard/DealsCard';
import ContactCard from '@/components/common/SpecialistCard';
import { COLORS } from '@/theme/colors';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';

import {
  // getCustomerJourneyStatus,
  selectApplicationDetails,
  selectAuth,
  selectCustomerDetails,
  selectRMDetails,
  getLoanStatusText,
} from '@/store/slices/CustomerAuthSlice';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import API from '@/utils/apiEnpoints';

export default function MortgageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const applicationDetails = useAppSelector(selectApplicationDetails);
  const customerDetails = useAppSelector(selectCustomerDetails);
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
                      ? alert('will do resend api')
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
                  title="3. Final Offer Letter"
                  description="Watch this space for another exciting digital journey that will soon be revealed to you."
                />
              </Box>
            </StyledCard>
          </Grid>

          {/* Right Side Cards */}
          <Grid size={{ xs: 12, md: 4 }}>
            {selectRMDetails_.rmName !== null && (
              <ContactCard
                name={selectRMDetails_?.rmName ? selectRMDetails_.rmName : 'Heena Rajwani'}
                email={selectRMDetails_?.rmEmailId ? selectRMDetails_.rmEmailId : 'heena@adcb.com'}
                phone={selectRMDetails_?.rmMobile ? selectRMDetails_.rmMobile : '+971 897876678'}
              />
            )}

            <GuideCard
              title="Dream Home Buying Guide"
              description="Our guidebook is designed to help you navigate every step of your home-buying journey."
              buttonText="DOWNLOAD"
              onDownload={() => console.log('Download guide')}
            />

            <DealsCard
              title="Deals and Discount"
              description="Discover home deals and discounts, curated to support you on your dream home journey."
              viewAllText="View All"
              deals={deals}
              onViewAll={() => console.log('View all deals')}
            />
          </Grid>
          <Typography variant="body2" color="text.secondary">
            Last updated 10:45 19/10/2024
          </Typography>
        </Grid>
        <AuthFooter />
      </Container>
    </Box>
  );
}

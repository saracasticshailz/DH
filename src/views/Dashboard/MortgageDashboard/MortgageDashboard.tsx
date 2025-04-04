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
import modNetwork from '../../../../lib/konyLib/common/modules/modNetwork';
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
import { generateJsonOrderFetch } from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationOrder';

export default function MortgageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [fetchOrderData, setFetchOrderData] = useState(null);
  const applicationDetails = useAppSelector(selectApplicationDetails);
  const customerDetails = useAppSelector(selectCustomerDetails);
  const [lapsRefNumber, setlapsRefNumber] = useState('');
  const selectRMDetails_ = useAppSelector(selectRMDetails);
  const journeyStatus: any = applicationDetails.loanApplicationStatus;
  const customerName: any = customerDetails.customerName;
  const userDetails = useAppSelector(selectAuth);

  useEffect(() => {
    valuationOrderFetch();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const valuationOrderFetch = async () => {
    console.log('valuationOrderFetch api before call', userDetails.lapsRefNumber);
    modNetwork(
      API.PROPERTY_VALUATION_ORDER_FETCH,
      {
        bankReferenceId: '1234',
      },
      (res: any) => {
        // {
        //   "oprstatus": 0,
        //   "address": {
        //     "buildingName": "Azizi Riviera 13",
        //     "pincode": "",
        //     "country": "United Arab Emirates",
        //     "streetAddress": "",
        //     "city": "Dubai",
        //     "localityArea": "Meydan City",
        //     "state": "Dubai",
        //     "landmarks": "LANDMARK",
        //     "projectName": "AZIZIZ",
        //     "floor": "11",
        //     "houseNoFlatNo": "1107"
        //   },
        //   "contactPerson": {
        //     "name": "sdhsdhs",
        //     "contactNumber": "456456456"
        //   },
        //   "results": [
        //     {
        //       "data": "7PmsPbIxe/BDdhsoLpmvmqXZQKkwk2oq3jI4kzZoe1Fzdcdl+FKxFCGy3HGOWkWnWXFSzBRrAsM5UpB6Al6ID4y/dCzNUB18d7qPDCsOaShiaSewQsFuTZ6iJLUpXiN5LnhNppYYkZVdgMyeH8/d008YjjOr8wel5VN1J+GKl+ae0PqgJj/VLhYsBMLM8sQ+RU0Xf1/GU2hRrsG4an8RJRw5cAKMdzAstKOSa2xSD60DVo2qmJz25VXjZFADkrDafYUIU4b/yyzwQVcQw/QFvLIgazikaVQbVEsZ82DBx04A6TTu/QilckbS5DaUup9Pnw3++kfy3H1xfb1nCGcdJ+VIXVGwvxFmFFqyWXLR4vYq15q/FMOYDGPEauCG9O+0pLBaPy669se6pOhX1DuJ3AmUf6DN975TBiUSt+KOlneNG1ZeinKc95Id18n7mm4wzlXCbaJ25rcopuGq9LmDG6MKvqeyOEGAGgcPTjjuu6qxKyGAABNyuvJsKchUtMNbXGG/1fv7rI9kgY8+KIcreM9OOVKkq/m4yJnX2nKafZ+OQDseqvTuU5tsx27yKC5Dlzezcro30eYpbc73OlAGG1n5EkPTwvS7uSts+KWxdb5hydF3CNolZN8k6vRLDFVCiT5VSxifclLeWaTjWsm2kaNb8FlbtRvpUxin2/p6MKyFe9s1uAvlzXAzbFOCI/QeYR1UlkB2uxR2ke7WIG51CeCqedOuWnG+OZaC1EphsAejuYFTj9C0vdppN7/IL7cXHuTNQ6gsFH9BotJdzs4+Kj9PyPxY6uy5nJLYjFdbFHpJGNAz1X+hRq8Ru6tdcTPJ01IoSR5pRiNBtTH1Q7zheIAFDUHELwKQvRbcL9A+Fm/2NWjaV5QcfJil2yp7Op6CO1bX1rdIEAyBylZPwmk1ea+1wfUIZ97dOL1L9f7LsxnDu4yLH2odvT60pYffGSFSGBkrW/EJfr49s1zBCXzBNWV6tAQFd0c8BcMWZSHx53Q5AjpajaU3Q1xxOteOgXIb0WrtsXeDohbE675JHS7K+Z6KBsMUIsi1bu657RInNijtWrQ57hv1jsuGfqKqlQ/TAfB6FNDV13Eh5oU9ufOXdQVwyV9GGrL6yrad5MHiRNycEKlOseDcYk1v4rwAExkoBZ4qhYegro6eGsnx25jms9Pfz70JB0edi82p+tVd/izGic4z5Wcy2tqxK3JJcnAX9tZpYAWeaEdhgNzIili0kq+HXXLq6nI5bHPP3H/433txzBcarkNeGbibiY+Pev7G+RYgsiaECncOO8OrZzwir+qOo74+fGvPQ0F72ckeHKQJx/6VVUzhDZdECJPgoDyu9VM/TLD5z8c7BvSGxZBkG1oaGgbJzn+6niw8HeiFmiUpePFb4ijgeUZOhnyZarGkACDQP9h2cCcL3/uNQogWOLaz394jHRW/w7R+XL3BKnVOkrKccUhsUJ3XWIDS3/y0bG2JKC6G2BepVOy5c4JWu6gqclzvSw/wRJVmWyFCsTX/RAZmL068Irqn4z0Isk/+yyrKr+phW41JrdwnKHwNLO6fqRo="
        //     }
        //   ],
        //   "defaultJob": {
        //     "preferredStartDateTimeFrom": "8/8/2024 9:00:00 AM",
        //     "preferredStartDateTimeTo": "8/8/2024 11:00:00 AM"
        //   }
        // }

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('valuationOrderFetch api response ', res);
          if (fetchOrderData === null) {
            setFetchOrderData(res);
          }

          console.log('dashboard', API.PROPERTY_VALUATION_ORDER_FETCH, res);
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
    console.log('handleValuationAction journeyStatus ', journeyStatus);
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
 

  const isActive =  t('preapprovalSubStatus.' + journeyStatus, { defaultValue: undefined }) as
  | 'InProgress'
  | 'Rejected'
  | 'Complete'
  | 'Pending'
  | undefined

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
                  fetchOrderData={fetchOrderData}
                  journeyStatus={journeyStatus}
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
                  fetchOrderData={fetchOrderData}
                  journeyStatus={journeyStatus}
                  active={ isActive === 'Complete' ? true : false}
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
                  fetchOrderData={fetchOrderData}
                  journeyStatus={journeyStatus}
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

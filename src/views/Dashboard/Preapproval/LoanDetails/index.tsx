import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Container, Typography, FormControl, InputAdornment, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoanPreferenceGroup from '@/components/PreApproval/LoanPreferenceGroup';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPreApprovalStep, updateLoanDetails } from '@/store/slices/MortgageSlice';
import { AppButton } from '@/components';
import TextInput from '@/components/common/TextInput';
import AppSelect from '@/components/common/AppSelect';
import FinancingOptionsGroup from '@/components/PreApproval/FinancingOptionsGroup';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { styled } from '@mui/system';
import { useEffect } from 'react';
import API from '@/utils/apiEnpoints';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import { updateRMDetails } from '@/store/slices/CustomerAuthSlice';

interface FormValues {
  loanPreference: 'ADCB' | 'ADCB Islamic';
  financingOption: 'threeYear' | 'fiveYear' | 'variable';
  purchaseType: string;
  loanAmount: string;
  loanTenure: string;
  specialistCode: string;
}

const validationSchema = Yup.object({
  loanPreference: Yup.string()
    .oneOf(['ADCB', 'ADCB Islamic'], 'Please select a loan preference')
    .required('Loan preference is required'),
  financingOption: Yup.string()
    .oneOf(['threeYear', 'fiveYear', 'variable'], 'Please select a financing option')
    .required('Financing option is required'),
  purchaseType: Yup.string().required('Purchase type is required'),
  loanAmount: Yup.string()
    .required('Loan amount is required')
    .matches(/^\d+$/, 'Must be a number')
    .test('range', 'Amount must be between 250,000 and 24,000,000', (value) => {
      const num = Number(value);
      return !isNaN(num) && num >= 250000 && num <= 24000000;
    }),
  loanTenure: Yup.string()
    .required('Loan tenure is required')
    .matches(/^\d+$/, 'Must be a number')
    .test('range', 'Tenure must be between 1 and 25 years', (value) => {
      const num = Number(value);
      return !isNaN(num) && num >= 1 && num <= 25;
    }),
  specialistCode: Yup.string(),
});

const purchaseTypes = [
  { value: 'ready', label: 'Ready Property' },
  { value: 'offplan', label: 'Off-Plan Property' },
  { value: 'construction', label: 'Under Construction' },
];

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: 16,
  marginTop: 40,
  justifyContent: 'space-between',
});

export default function LoanDetails() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const loanDetails = useAppSelector((state) => state.mortgage.preApproval.loanDetails);
  const navigate = useNavigate();
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);
  const formik = useFormik<FormValues>({
    initialValues: {
      loanPreference: loanDetails.loanPreference || 'ADCB',
      financingOption: loanDetails.financingOption || 'threeYear',
      purchaseType: loanDetails.purchaseType || '',
      loanAmount: loanDetails.loanAmount || '',
      loanTenure: loanDetails.loanTenure || '',
      specialistCode: loanDetails.specialistCode || '',
    },
    validationSchema,

    onSubmit: (values) => {
      dispatch(updateLoanDetails(values));
      dispatch(setPreApprovalStep(preApproval.activeStep + 1));
    },
  });

  const { errors, touched, values, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = formik;

  const handleSelectChange = (name: string, value: string) => {
    setFieldValue(name, value);
  };

  const handleCancel = () => {
    // dispatch(setPreApprovalStep(0));
    navigate(-1);
  };

  const handleBack = () => {
    dispatch(setPreApprovalStep(0));
  };

  const getRmDetails = () => {
    modNetwork(
      API.FETCH_RM_DETAILS,

      {
        searchParameterType: 'RMCODE',
        searchParameterValue: values.specialistCode,
      },
      (res: any) => {
        // "oprstatus": 0,
        // "returnCode": "0",
        // "httpStatusCode": 0,
        // "rmDetails": [
        // "rmCode": "C106794"
        // "rmMobile": "971562910316",
        // "rmEmailld": "HeenaRajwani.ext@adcb.com",
        // "rmName": "MAHJOOB MUSTAFA"
        // },
        // "rmCode": "C109094",
        // "rmMobile": "971562910316",
        // "rmEmailld": "hr.ext@adcb.com",
        // "rmName":
        console.log('FETCH_RM_DETAILS', res);
        if (res.oprstatus == 0 && res.returnCode == 0) {
          dispatch(updateRMDetails(res.rmDetails[0]));
        } else {
          alert(res.errmsg[1]);
        }
      },
      '',
      '',
      '',
      'register'
    );
  };
  useEffect(() => {
    getRmDetails();
  }, [values.specialistCode]);

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: 'white', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t('preApproval.loanDetails.title')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('preApproval.loanDetails.description')}
            </Typography>

            <form onSubmit={handleSubmit}>
              <LoanPreferenceGroup
                value={values.loanPreference}
                onChange={(value) => formik.setFieldValue('loanPreference', value)}
                onBlur={() => formik.setFieldTouched('loanPreference')}
                error={errors.loanPreference}
                touched={touched.loanPreference}
              />

              <FinancingOptionsGroup
                value={values.financingOption}
                onChange={(value) => formik.setFieldValue('financingOption', value)}
                onBlur={() => formik.setFieldTouched('financingOption')}
                error={errors.financingOption}
                touched={touched.financingOption}
              />

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <AppSelect
                  name="purchaseType"
                  label={t('preApproval.loanDetails.purchaseType.label')}
                  placeholder={t('preApproval.loanDetails.purchaseType.placeholder')}
                  options={purchaseTypes}
                  value={values.purchaseType}
                  onChange={handleSelectChange}
                  onBlur={handleBlur}
                  error={touched.purchaseType && Boolean(errors.purchaseType)}
                  helperText={touched.purchaseType && errors.purchaseType ? errors.purchaseType : undefined}
                />

                <FormControl>
                  <TextInput
                    label={t('preApproval.loanDetails.specialistCode.label')}
                    name="specialistCode"
                    value={values.specialistCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('preApproval.loanDetails.specialistCode.placeholder')}
                  />
                </FormControl>

                <FormControl error={touched.loanAmount && Boolean(errors.loanAmount)}>
                  <TextInput
                    name="loanAmount"
                    value={values.loanAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label={t('preApproval.loanDetails.loanAmount.label')}
                    placeholder={t('preApproval.loanDetails.loanAmount.placeholder')}
                    InputProps={{ endAdornment: <InputAdornment position="end">AED</InputAdornment> }}
                    error={touched.loanAmount && Boolean(errors.loanAmount)}
                  />
                  {touched.loanAmount && errors.loanAmount && <FormHelperText>{errors.loanAmount}</FormHelperText>}
                </FormControl>

                <FormControl error={touched.loanTenure && Boolean(errors.loanTenure)}>
                  <TextInput
                    name="loanTenure"
                    value={values.loanTenure}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('preApproval.loanDetails.loanTenure.placeholder')}
                    error={touched.loanTenure && Boolean(errors.loanTenure)}
                    label={t('preApproval.loanDetails.loanTenure.label')}
                  />
                  {touched.loanTenure && errors.loanTenure && <FormHelperText>{errors.loanTenure}</FormHelperText>}
                </FormControl>
              </Box>

              <Box sx={{ bgcolor: '#F8F9FE', p: 2, borderRadius: 2, mt: 3, mb: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('preApproval.loanDetails.note')}
                </Typography>
              </Box>

              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <AppButton borderless onClick={handleCancel}>
                  {t('preApproval.loanDetails.buttons.cancel')}
                </AppButton>
                <AppButton fullWidth={false} variant="contained" type="submit" disabled={isSubmitting}>
                  {t('preApproval.loanDetails.buttons.continue')}
                </AppButton>
              </Box> */}

              <ActionButtons>
                <AppButton fullWidth={false} onClick={handleBack} withBorder>
                  {t('preApproval.loanDetails.buttons.cancel')}
                </AppButton>

                <AppButton
                  borderless
                  fullWidth={false}
                  style={{ font: 'proximanova-bold-webfont' }}
                  onClick={handleCancel}
                >
                  {t('preApproval.employmentDetails.buttons.cancel')}
                </AppButton>
                <AppButton
                  fullWidth={false}
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ alignSelf: 'end' }}
                >
                  {t('preApproval.loanDetails.buttons.continue')}
                </AppButton>
              </ActionButtons>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

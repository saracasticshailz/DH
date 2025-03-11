import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Container, Typography, styled, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { IMG } from '@/assets/images';
import EmploymentRadioButton from '@/components/PreApproval/EmploymentRadioButton';
import { setPreApprovalStep, updateEmploymentDetails } from '@/store/slices/MortgageSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '@/components/common/CustomDatePicker';

// @ts-ignore
import { Invoker } from '../../../../v2/common/modules/modServiceInvoker';
import AutocompleteField from '@/components/common/AutocompleteField/AutocompleteField.js';
import { isLoading as _isLoading } from '@/store/slices/CustomerAuthSlice.js';
import { useSelector } from 'react-redux';
import EmployerDropdown from '@/components/PreApproval/EmployerDetails/EmployerDropdown';
import { RootState } from '@/store';

interface FormValues {
  employmentType: 'salaried' | 'selfEmployed' | 'pensioner';
  employerName: string;
  joiningDate: string;
}

const StyledContainer = styled(Box)({
  backgroundColor: 'white',
  borderRadius: 24,
  padding: 32,
});

const EmploymentTypeGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  width: '100%',
  marginBottom: 24,
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // On small screens (mobile), change to column
  },
}));

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: 16,
  marginTop: 40,
  justifyContent: 'space-between',
});

export default function EmploymentDetails() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const employmentDetails = useAppSelector((state) => state.mortgage.preApproval.employmentDetails);
  const navigate = useNavigate();
  const { invokeOperation } = Invoker();
  const isLoading: any = useSelector(_isLoading);

  const validationSchema = Yup.object({
    employmentType: Yup.string()
      .oneOf(
        ['salaried', 'selfEmployed', 'pensioner'],
        t('preApproval.employmentDetails.validation.employmentType.invalid')
      )
      .required(t('preApproval.employmentDetails.validation.employmentType.required')),
    // employerName: Yup.string().required(t('preApproval.employmentDetails.validation.employerName.required')),
    joiningDate: Yup.string()
      .required(t('preApproval.employmentDetails.validation.joiningDate.required'))
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, t('preApproval.employmentDetails.validation.joiningDate.format')),
  });
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  const formik = useFormik<FormValues>({
    initialValues: employmentDetails,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateEmploymentDetails(values));
      dispatch(setPreApprovalStep(preApproval.activeStep + 1));
    },
  });

  const handleBack = () => {
    dispatch(setPreApprovalStep(0)); // Go back to Loan Details
  };

  const employmentTypes = [
    {
      value: 'salaried',
      label: t('preApproval.employmentDetails.employmentType.options.salaried'),
      icon: IMG.BusinessIcon,
    },
    {
      value: 'selfEmployed',
      label: t('preApproval.employmentDetails.employmentType.options.selfEmployed'),
      icon: IMG.PersonIcon,
    },
    {
      value: 'pensioner',
      label: t('preApproval.employmentDetails.employmentType.options.pensioner'),
      icon: IMG.ElderlyIcon,
    },
  ];

  const EMPLOYER_DETAILS = [{ companyCode: 'ZZZ', companyName: 'ZZZz', companyStatus: 'aa' }];

  function handleCancel(): void {
    dispatch(setPreApprovalStep(0));
    navigate(-1);
  }

  const handleSelect = (e: any) => {
    console.log(e);
  };

  const handleSearch = (e: any) => {};

  return (
    <Container maxWidth="lg">
      <StyledContainer>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {t('preApproval.employmentDetails.title')}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('preApproval.employmentDetails.employmentType.label')}
          </Typography>

          <EmploymentTypeGroup>
            {employmentTypes.map((type) => (
              <EmploymentRadioButton
                key={type.value}
                value={type.value}
                label={type.label}
                icon={() => <img src={type.icon || '/placeholder.svg'} alt={type.label} />}
                selected={formik.values.employmentType === type.value}
                onChange={(value) => formik.setFieldValue('employmentType', value)}
              />
            ))}
          </EmploymentTypeGroup>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: '1fr 1fr' } }}>
            {/* <Box>
              <TextInput
                fullWidth
                name="employerName"
                placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                value={formik.values.employerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.employerName && Boolean(formik.errors.employerName)}
                helperText={formik.touched.employerName && formik.errors.employerName}
                label={t('preApproval.employmentDetails.employerName.label')}
              />
            </Box> */}

            <Box>
              {/* <AutocompleteField
                name="employer"
                label={t('preApproval.employmentDetails.employerName.label')}
                placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                value={formik.values.employerName}
                options={EMPLOYER_DETAILS}
                onSearch={handleSearch}
                onSelect={formik.handleChange}
                loading={isLoading}
                error={formik.touched.employerName && Boolean(formik.errors.employerName)}
                // helperText={formik.touched.employerName && formik.errors.employerName}
                getOptionLabel={(option) => option.companyName}
                isOptionEqualToValue={(option, value) => option.companyCode === value.companyCode}
              /> */}
              <EmployerDropdown
                name={'Name'}
                label={t('preApproval.employmentDetails.employerName.label')}
                placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                value={formik.values.employerName}
                onChange={formik.handleChange}
                onBlur={function (e: React.FocusEvent<any>): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </Box>

            <Box>
              {/* <TextInput
                fullWidth
                name="joiningDate"
                value={formik.values.joiningDate ? dayjs(formik.values.joiningDate, 'DD/MM/YYYY') : null}
                value={formik.values.joiningDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.joiningDate && Boolean(formik.errors.joiningDate)}
                helperText={formik.touched.joiningDate && formik.errors.joiningDate}
                InputProps={{
                  endAdornment: <InputAdornment position="end"></InputAdornment>,
                }}
                label={t('preApproval.employmentDetails.joiningDate.label')}
              /> */}

              <CustomDatePicker
                value={formik.values.joiningDate}
                onChange={(newValue) => {
                  // Format the date as DD/MM/YYYY to match your validation schema
                  const formattedDate = newValue ? dayjs(newValue).format('DD/MM/YYYY') : '';
                  formik.setFieldValue('joiningDate', formattedDate);
                }}
                label={t('preApproval.employmentDetails.joiningDate.label')}
                type={'date'}
                error={formik.touched.joiningDate && Boolean(formik.errors.joiningDate)}
                onBlur={() => formik.setFieldTouched('joiningDate', true)}
              />
            </Box>
          </Box>

          <ActionButtons>
            <AppButton fullWidth={false} onClick={handleBack} withBorder>
              {t('preApproval.employmentDetails.buttons.back')}
            </AppButton>

            <AppButton borderless fullWidth={false} style={{ font: 'proximanova-bold-webfont' }} onClick={handleCancel}>
              {t('preApproval.employmentDetails.buttons.cancel')}
            </AppButton>
            <AppButton fullWidth={false} type="submit" variant="contained" color="primary" style={{ alignSelf: 'end' }}>
              {t('preApproval.employmentDetails.buttons.continue')}
            </AppButton>
          </ActionButtons>
        </form>
      </StyledContainer>
    </Container>
  );
}

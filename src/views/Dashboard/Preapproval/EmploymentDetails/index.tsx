'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Container, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { IMG } from '@/assets/images';
import EmploymentRadioButton from '@/components/PreApproval/EmploymentRadioButton';
import { setPreApprovalStep, updateEmploymentDetails } from '@/store/slices/MortgageSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { AppButton } from '@/components';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { isLoading as _isLoading } from '@/store/slices/CustomerAuthSlice.js';
import { useSelector } from 'react-redux';
import EmployerDropdown from '@/components/PreApproval/EmployerDetails/EmployerDropdown';
import type { RootState } from '@/store';
import { useState } from 'react';

interface FormValues {
  employmentType: 'SA' | 'SE' | 'PE';
  employerName: string;
  joiningDate: string;
  employerCode: string;
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
  const isLoading: any = useSelector(_isLoading);
  const [showAlert, setShowAlert] = useState(false);

  const validationSchema = Yup.object({
    employmentType: Yup.string()
      .oneOf(['SA', 'SE', 'PE'], t('preApproval.employmentDetails.validation.employmentType.invalid'))
      .required(t('preApproval.employmentDetails.validation.employmentType.required')),
    employerName: Yup.string().required(t('preApproval.employmentDetails.validation.employerName.required')),
    joiningDate: Yup.string()
      .required(t('preApproval.employmentDetails.validation.joiningDate.required'))
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, t('preApproval.employmentDetails.validation.joiningDate.format')),
    // Add validation for employerCode
    employerCode: Yup.string().required(t('preApproval.employmentDetails.validation.employerCode.required')),
  });
  const { preApproval } = useAppSelector((state: RootState) => state.mortgage);

  const formik = useFormik<FormValues>({
    initialValues: {
      ...employmentDetails,
      employerCode: employmentDetails.employerCode || '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values being submitted:', values);

      // Make sure to include employerCode in the values passed to Redux
      dispatch(
        updateEmploymentDetails({
          employmentType: values.employmentType,
          employerName: values.employerName,
          joiningDate: values.joiningDate,
          employerCode: values.employerCode, // Explicitly include employerCode
        })
      );

      dispatch(setPreApprovalStep(preApproval.activeStep + 1));
    },
  });

  const handleBack = () => {
    dispatch(setPreApprovalStep(0)); // Go back to Loan Details
  };

  const employmentTypes = [
    {
      value: 'SA',
      label: t('preApproval.employmentDetails.employmentType.options.salaried'),
      icon: IMG.BusinessIcon,
    },
    {
      value: 'SE',
      label: t('preApproval.employmentDetails.employmentType.options.selfEmployed'),
      icon: IMG.PersonIcon,
    },
    {
      value: 'PE',
      label: t('preApproval.employmentDetails.employmentType.options.pensioner'),
      icon: IMG.ElderlyIcon,
    },
  ];

  function handleCancel(): void {
    dispatch(setPreApprovalStep(0));
    navigate(-1);
  }

  // For debugging - log the current form values when they change
  // console.log('Current form values:', formik.values);

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
            <Box>
              <EmployerDropdown
                name="employerName"
                label={t('preApproval.employmentDetails.employerName.label')}
                placeholder={t('preApproval.employmentDetails.employerName.placeholder')}
                value={{
                  employerCode: formik.values.employerCode || '',
                  companyName: formik.values.employerName || '',
                }}
                onChange={(newValue) => {
                  formik.setFieldValue('employerName', newValue?.companyName || '');
                  formik.setFieldValue('employerCode', newValue?.employerCode || '');
                  // console.log('Employer selected:', newValue);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.employerName && Boolean(formik.errors.employerName)}
                // helperText={formik.touched.employerName && (formik.errors.employerName as string)}
              />
            </Box>

            <Box>
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

          {/* Hidden field to ensure employerCode is included in the form submission */}
          <input type="hidden" name="employerCode" value={formik.values.employerCode} />

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

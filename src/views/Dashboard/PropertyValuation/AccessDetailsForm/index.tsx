'use client';

import type React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/hooks/redux';
import { selectAuth } from '@/store/slices/CustomerAuthSlice';

import dayjs, { type Dayjs } from 'dayjs';
import TextInput from '@/components/common/TextInput';
import PrimaryButton from '@/components/common/AppButton/AppButton';
import { updateAccessDetails, setValuationActiveStep } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import AppButton from '@/components/common/AppButton/AppButton';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import DateTimePicker from '@/components/common/CustomDatePicker';
import { useTranslation } from 'react-i18next';
import { getFormData } from '@/utils/offlineStorage';
import { generateJsonOrder } from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationOrder';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

interface AccessDetailsFormValues {
  contactName: string;
  email: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  date: Dayjs | null;
  time: Dayjs | null;
  specialInstructions?: string;
}

const validationSchema = Yup.object({
  contactName: Yup.string().required('Contact name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobileNumber: Yup.string().required('Mobile number is required'),
  date: Yup.mixed().required('Date is required'),
  time: Yup.mixed().required('Time is required'),
});

const AccessDetailsForm: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userDetails = useAppSelector(selectAuth);
  const accessDetails = useSelector((state: RootState) => state.valuation.accessDetails);

  const initialValues: AccessDetailsFormValues = {
    contactName: accessDetails.contactName || '',
    email: accessDetails.email || '',
    mobileNumber: accessDetails.mobileNumber || '',
    alternateMobileNumber: accessDetails.alternateMobileNumber || '',
    date: accessDetails.date ? dayjs(accessDetails.date) : null,
    time: accessDetails.time ? dayjs(accessDetails.time) : null,
    specialInstructions: accessDetails.specialInstructions || '',
  };

  const formik = useFormik<AccessDetailsFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const savedData = getFormData('propertyDetails');
      const personalAccessDetails = {
        ...savedData,
        ...values,
        bankReference: userDetails.lapsRefNumber,
        applicationReference: userDetails.applicationRefNumber,
      };
      const finalJson = generateJsonOrder(personalAccessDetails);
      dispatch(
        updateAccessDetails({
          ...finalJson,
          //date: values.date?.format('YYYY-MM-DD') || '',
          //time: values.time?.format('HH:mm:ss') || '',
        })
      );
      dispatch(setValuationActiveStep(2)); // Move to Document Upload
      apiCallOnContinue(finalJson);
    },
  });

  const apiCallOnContinue = async (finalJson: any) => {
    console.log('Access Detail Forms apiCallOnContinue finalJson 85', finalJson);
    modNetwork(
      API.PROPERTY_VALUATION_ORDER_CREATE,
      {
        ...finalJson,
      },
      (res: any) => {
        console.log('PROPERTY_VALUATION', res);

        // "orderld": "81676817-5fae-4bce-8851-9c2d140793d0",
        // "orderNumber": "VNO-O16F",
        // "draftJobld": "cd6d9c28-ab07-4285-a3fa-c46485fe9ced",
        // "draftJobNumber": "VNO-OI6F-V26"

        if (res.oprstatus == 0 && res.returnCode == 0) {
          console.log('Access Detail PROPERTY_VALUATIONs response ', res);
          //draftJobld
          dispatch(
            updateAccessDetails({
              ...finalJson,
              //date: values.date?.format('YYYY-MM-DD') || '',
              //time: values.time?.format('HH:mm:ss') || '',
            })
          );
          dispatch(setValuationActiveStep(2)); // Move to Document Upload
          /* empty */
        } else {
          // navigate('/Dashboard');

          // Create new state
          //setDialogText(res.errMsg_EN);
          console.log('Error Message ', res.errmsg);

          //setDialogTitle('ERROR')
          //setDialogPrimaryAction('OK');
          //setShowAlert(true);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const handleBack = () => {
    dispatch(setValuationActiveStep(0)); // Go back to Property Details
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="contactName"
              label={t('valuation.accessDetailForm.contactName')}
              value={formik.values.contactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contactName && Boolean(formik.errors.contactName)}
              helperText={formik.touched.contactName && formik.errors.contactName}
              placeholder={t('valuation.accessDetailForm.placeHolderCN')}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="email"
              label={t('valuation.accessDetailForm.emailAddress')}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              placeholder={t('valuation.accessDetailForm.placeHolderEmail')}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="mobileNumber"
              label={t('valuation.accessDetailForm.mobileNumber')}
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              placeholder={t('valuation.accessDetailForm.placeHolderMobile')}
              countryCode="+971"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="alternateMobileNumber"
              label={t('valuation.accessDetailForm.alternateMobileNumber')}
              value={formik.values.alternateMobileNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('valuation.accessDetailForm.placeholderAlternateMN')}
              countryCode="+971"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* <DatePicker
              label={t("valuation.accessDetailForm.selectDate")}
              value={formik.values.date ? formik.values.date.toDate() : null}
              onChange={(newValue) => {
                formik.setFieldValue('date', newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.date && Boolean(formik.errors.date),
                  helperText: formik.touched.date && (formik.errors.date as string),
                },
              }}
            /> */}
            <CustomDatePicker
              value={formik.values.date}
              onChange={(newValue) => {
                formik.setFieldValue('date', newValue);
              }}
              label={t('valuation.accessDetailForm.selectDate')}
              type={'date'}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* <TimePicker
              label={t("valuation.accessDetailForm.time")}
              value={formik.values.time}
              onChange={(newValue) => {
                formik.setFieldValue('time', newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.time && Boolean(formik.errors.time),
                  helperText: formik.touched.time && (formik.errors.time as string),
                },
              }}
            /> */}

            {/* <DateTimePicker
              type="time"
              label={t("valuation.accessDetailForm.time")}
              value={formik.values.time}
              onChange={(newValue) => {
                formik.setFieldValue('time', newValue);
              }}
              error={formik.touched.time && Boolean(formik.errors.time)}
            /> */}

            <DateTimePicker
              type="time"
              label={t('valuation.accessDetailForm.time')}
              value={formik.values.time}
              onChange={(newValue) => {
                formik.setFieldValue('time', newValue);
              }}
              error={formik.touched.time && Boolean(formik.errors.time)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              name="specialInstructions"
              label={t('valuation.accessDetailForm.specialInstructions')}
              value={formik.values.specialInstructions || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={4}
              placeholder={t('valuation.accessDetailForm.placeholderSpecialInst')}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <AppButton onClick={handleBack} withBorder>
            {t('preApproval.incomeDetails.buttons.back')}
          </AppButton>
          <PrimaryButton withBorder>{t('preApproval.incomeDetails.buttons.cancel')}</PrimaryButton>
          <PrimaryButton type="submit">{t('preApproval.incomeDetails.buttons.continue')}</PrimaryButton>
        </Box>
      </Box>
    </form>
  );
};

export default AccessDetailsForm;

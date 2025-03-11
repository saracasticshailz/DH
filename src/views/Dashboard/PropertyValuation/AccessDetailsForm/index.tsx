'use client';

import type React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { type Dayjs } from 'dayjs';
import TextInput from '@/components/common/TextInput';
import PrimaryButton from '@/components/common/AppButton/AppButton';
import { updateAccessDetails, setValuationActiveStep } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import AppButton from '@/components/common/AppButton/AppButton';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import DateTimePicker from '@/components/common/CustomDatePicker';

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
      dispatch(
        updateAccessDetails({
          ...values,
          date: values.date?.format('YYYY-MM-DD') || '',
          time: values.time?.format('HH:mm:ss') || '',
        })
      );
      dispatch(setValuationActiveStep(2)); // Move to Document Upload
    },
  });

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
              label="Contact Name"
              value={formik.values.contactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contactName && Boolean(formik.errors.contactName)}
              helperText={formik.touched.contactName && formik.errors.contactName}
              placeholder="Enter contact name"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              placeholder="Enter email address"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="mobileNumber"
              label="Mobile number"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              placeholder="Enter mobile number"
              countryCode="+971"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="alternateMobileNumber"
              label="Alternate mobile number"
              value={formik.values.alternateMobileNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter alternate mobile number"
              countryCode="+971"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* <DatePicker
              label="Select date"
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
              label="Select date"
              type={'date'}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* <TimePicker
              label="Time"
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
              label="Time"
              value={formik.values.time}
              onChange={(newValue) => {
                formik.setFieldValue('time', newValue);
              }}
              error={formik.touched.time && Boolean(formik.errors.time)}
            /> */}

            <DateTimePicker
              type="time"
              label="Time"
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
              label="Special instructions"
              value={formik.values.specialInstructions || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={4}
              placeholder="Enter any special instructions"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <AppButton onClick={handleBack} withBorder>
            Back
          </AppButton>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <PrimaryButton withBorder>Cancel</PrimaryButton>
            <PrimaryButton type="submit">Continue</PrimaryButton>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default AccessDetailsForm;

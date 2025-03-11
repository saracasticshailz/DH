'use client';

import type React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Alert,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Import Grid2 instead of Grid
import { useDispatch, useSelector } from 'react-redux';
import { AppButton } from '@/components';
import { updatePropertyDetails, setValuationActiveStep } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import { useEffect } from 'react';
import { saveFormData, getFormData } from '@/utils/offlineStorage';
import TextInput from '@/components/common/TextInput';
import { COLORS } from '@/theme/colors';

const validationSchema = Yup.object({
  propertyType: Yup.string().required('Property type is required'),
  completionStatus: Yup.string().required('Completion status is required'),
  developmentProjectName: Yup.string().required('Development project name is required'),
  buildingName: Yup.string().required('Building name is required'),
  locality: Yup.string().required('Locality is required'),
  emirate: Yup.string().required('Emirate is required'),
  flatNumber: Yup.string().required('Flat/House number is required'),
  floorNumber: Yup.string().required('Floor number is required'),
});

const PropertyDetailsForm: React.FC = () => {
  const dispatch = useDispatch();
  const propertyDetails = useSelector((state: RootState) => state.valuation.propertyDetails);

  // Load saved form data when component mounts
  useEffect(() => {
    const savedData = getFormData('propertyDetails');
    if (savedData) {
      dispatch(updatePropertyDetails(savedData));
    }
  }, [dispatch]);

  const formik = useFormik({
    initialValues: propertyDetails,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updatePropertyDetails(values));
      saveFormData('propertyDetails', values); // Save form data locally
      dispatch(setValuationActiveStep(1)); // Navigate to Access Details (step 1)
    },
  });

  // Save form data when values change
  useEffect(() => {
    saveFormData('propertyDetails', formik.values);
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Property Details
        </Typography>

        <Alert
          severity="warning"
          sx={{
            mb: 3,
            mt: 1,
            backgroundColor: COLORS.NOTICE_RED,
            borderRadius: 1.5,
            color: COLORS.BROWN_PROGRESS,
          }}
        >
          Please review the property details carefully before moving to the next section. Once submitted, this section
          cannot be changed.
        </Alert>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12 }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1, color: '#5d656b', fontWeight: 500 }}>
                Property Type
              </FormLabel>
              <RadioGroup
                row
                name="propertyType"
                value={formik.values.propertyType}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    mr: 4,
                    '& .MuiRadio-root': {
                      color: '#bec1c4',
                      '&.Mui-checked': {
                        color: '#E31B23',
                      },
                    },
                  },
                }}
              >
                <FormControlLabel value="Apartment" control={<Radio />} label="Apartment" />
                <FormControlLabel value="Townhouse" control={<Radio />} label="Townhouse" />
                <FormControlLabel value="Villa" control={<Radio />} label="Villa" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              select
              label="Completion status"
              name="completionStatus"
              value={formik.values.completionStatus}
              onChange={formik.handleChange}
              error={formik.touched.completionStatus && Boolean(formik.errors.completionStatus)}
              helperText={formik.touched.completionStatus && formik.errors.completionStatus}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Under Construction">Under Construction</MenuItem>
              <MenuItem value="Off Plan">Off Plan</MenuItem>
            </TextInput>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Development project name"
              name="developmentProjectName"
              value={formik.values.developmentProjectName}
              onChange={formik.handleChange}
              error={formik.touched.developmentProjectName && Boolean(formik.errors.developmentProjectName)}
              helperText={formik.touched.developmentProjectName && formik.errors.developmentProjectName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Name of building/phase/cluster"
              name="buildingName"
              value={formik.values.buildingName}
              onChange={formik.handleChange}
              error={formik.touched.buildingName && Boolean(formik.errors.buildingName)}
              helperText={formik.touched.buildingName && formik.errors.buildingName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Locality/Area"
              name="locality"
              value={formik.values.locality}
              onChange={formik.handleChange}
              error={formik.touched.locality && Boolean(formik.errors.locality)}
              helperText={formik.touched.locality && formik.errors.locality}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Emirate"
              name="emirate"
              value={formik.values.emirate}
              onChange={formik.handleChange}
              error={formik.touched.emirate && Boolean(formik.errors.emirate)}
              helperText={formik.touched.emirate && formik.errors.emirate}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Flat/House number"
              name="flatNumber"
              value={formik.values.flatNumber}
              onChange={formik.handleChange}
              error={formik.touched.flatNumber && Boolean(formik.errors.flatNumber)}
              helperText={formik.touched.flatNumber && formik.errors.flatNumber}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Floor number"
              name="floorNumber"
              value={formik.values.floorNumber}
              onChange={formik.handleChange}
              error={formik.touched.floorNumber && Boolean(formik.errors.floorNumber)}
              helperText={formik.touched.floorNumber && formik.errors.floorNumber}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              fullWidth
              label="Landmarks (if any)"
              name="landmarks"
              value={formik.values.landmarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <AppButton borderless fullWidth onClick={() => console.log('Cancel clicked')}>
              Cancel
            </AppButton>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ marginLeft: { md: 'auto' } }}>
            <AppButton fullWidth type="submit" variant="contained" color="primary">
              Continue
            </AppButton>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default PropertyDetailsForm;

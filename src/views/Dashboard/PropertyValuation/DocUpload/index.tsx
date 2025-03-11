'use client';

import type React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Typography, Button, Alert, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocuments, setValuationActiveStep } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';

interface DocumentValues {
  propertyAddress: File | null;
  titleDeed: File | null;
  salePurchaseAgreement: File | null;
  floorPlan: File | null;
  oqood: File | null;
  additionalDocuments: File | null;
}

const validationSchema = Yup.object({
  propertyAddress: Yup.mixed().required('Property address document is required'),
  titleDeed: Yup.mixed().required('Title deed is required'),
  salePurchaseAgreement: Yup.mixed().required('Sale purchase agreement is required'),
  floorPlan: Yup.mixed().required('Floor plan is required'),
});

const DocumentUploadForm: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.valuation.documents);

  const formik = useFormik<DocumentValues>({
    initialValues: documents,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateDocuments(values));
      dispatch(setValuationActiveStep(3)); // Move to Review step
    },
  });

  const handleBack = () => {
    dispatch(setValuationActiveStep(1)); // Go back to Access Details
  };

  const handleFileChange = (field: keyof DocumentValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
    }
  };

  const handleFileDelete = (field: keyof DocumentValues) => () => {
    formik.setFieldValue(field, null);
  };

  const renderFileInput = (field: keyof DocumentValues, label: string) => {
    const file = formik.values[field];
    const error = formik.touched[field] && formik.errors[field];

    return (
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            color={error ? 'error' : 'primary'}
            sx={{
              borderColor: '#BEC1C4',
              color: '#273239',
              '&:hover': {
                borderColor: '#273239',
                bgcolor: 'transparent',
              },
            }}
          >
            {file ? file.name : 'Choose file'}
            <input type="file" hidden accept=".pdf,.jpg,.png" onChange={handleFileChange(field)} />
          </Button>
          {file && (
            <IconButton onClick={handleFileDelete(field)} color="error" size="small">
              <Delete />
            </IconButton>
          )}
        </Box>
        {error && (
          <Typography color="error" variant="caption">
            {error as string}
          </Typography>
        )}
      </Grid>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Documents should be max 2MB. Accepted file types are PDF, JPG, PNG.
        </Alert>

        <Grid container spacing={3}>
          {renderFileInput('propertyAddress', 'Standard property address capture')}
          {renderFileInput('titleDeed', 'Title deed')}
          {renderFileInput('salePurchaseAgreement', 'Sale purchase agreement')}
          {renderFileInput('floorPlan', 'Floor plan')}
          {renderFileInput('oqood', 'Oqood')}
          {renderFileInput('additionalDocuments', 'Additional Documents')}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderColor: '#BEC1C4',
              color: '#273239',
              '&:hover': {
                borderColor: '#273239',
                bgcolor: 'transparent',
              },
            }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#BEC1C4',
                color: '#273239',
                '&:hover': {
                  borderColor: '#273239',
                  bgcolor: 'transparent',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#E31B23',
                '&:hover': {
                  bgcolor: '#CC181F',
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default DocumentUploadForm;

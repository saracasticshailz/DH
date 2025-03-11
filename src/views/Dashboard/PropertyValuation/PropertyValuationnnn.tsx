'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Button,
  Alert,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageProgressBar from '@/components/common/ImageProgressBar/ImageProgressBar';
import TextInput from '@/components/common/TextInput';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
}));

const StyledImage = styled('img')({
  borderRadius: 16,
  objectFit: 'cover',
});

const validationSchema = Yup.object({
  propertyType: Yup.string().required('Property type is required'),
  completionStatus: Yup.string().required('Completion status is required'),
  projectName: Yup.string().required('Development project name is required'),
  buildingName: Yup.string().required('Building name is required'),
  locality: Yup.string().required('Locality is required'),
  emirate: Yup.string().required('Emirate is required'),
  flatNumber: Yup.string().required('Flat/House number is required'),
  floorNumber: Yup.string().required('Floor number is required'),
});

const initialValues = {
  propertyType: 'Apartment',
  completionStatus: 'Completed',
  projectName: '',
  buildingName: '',
  locality: '',
  emirate: 'Dubai',
  flatNumber: '',
  floorNumber: '',
  landmarks: '',
};

export default function PropertyDetails() {
  const [step] = useState(1);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AuthHeader />
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'relative', height: '100%', minHeight: 400 }}>
            <ImageProgressBar currentStep={step} totalSteps={5} title={''} />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <StyledPaper>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Property Details
            </Typography>
            <Alert severity="warning" sx={{ mb: 4 }}>
              Please review the property details carefully before moving to the next section. Once submitted, this
              section cannot be changed.
            </Alert>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Property Type
                    </Typography>
                    <RadioGroup row name="propertyType" value={values.propertyType} onChange={handleChange}>
                      <FormControlLabel value="Apartment" control={<Radio />} label="Apartment" />
                      <FormControlLabel value="Townhouse" control={<Radio />} label="Townhouse" />
                      <FormControlLabel value="Villa" control={<Radio />} label="Villa" />
                    </RadioGroup>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Completion status
                        </Typography>
                        <Select name="completionStatus" value={values.completionStatus} onChange={handleChange}>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Under Construction">Under Construction</MenuItem>
                          <MenuItem value="Off Plan">Off Plan</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Development project name
                        </Typography>
                        <TextInput
                          name="projectName"
                          value={values.projectName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.projectName && Boolean(errors.projectName)}
                          helperText={touched.projectName && errors.projectName}
                        />
                      </FormControl>
                    </Grid>

                    {/* Additional form fields */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Name of building/phase/cluster
                        </Typography>
                        <TextInput
                          name="buildingName"
                          value={values.buildingName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.buildingName && Boolean(errors.buildingName)}
                          helperText={touched.buildingName && errors.buildingName}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Locality/Area
                        </Typography>
                        <TextInput
                          name="locality"
                          value={values.locality}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.locality && Boolean(errors.locality)}
                          helperText={touched.locality && errors.locality}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Emirate
                        </Typography>
                        <TextInput
                          name="emirate"
                          value={values.emirate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.emirate && Boolean(errors.emirate)}
                          helperText={touched.emirate && errors.emirate}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Flat/House number
                        </Typography>
                        <TextInput
                          name="flatNumber"
                          value={values.flatNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.flatNumber && Boolean(errors.flatNumber)}
                          helperText={touched.flatNumber && errors.flatNumber}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Floor number
                        </Typography>
                        <TextInput
                          name="floorNumber"
                          value={values.floorNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.floorNumber && Boolean(errors.floorNumber)}
                          helperText={touched.floorNumber && errors.floorNumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Landmarks (if any)
                        </Typography>
                        <TextInput
                          name="landmarks"
                          value={values.landmarks}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="primary">
                      CANCEL
                    </Button>
                    <Button variant="contained" color="error" type="submit">
                      CONTINUE
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </StyledPaper>
        </Grid>
      </Grid>
      <AuthFooter />
    </Container>
  );
}

'use client';

//import type React from 'react';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Typography, Button, Alert, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocuments, setValuationActiveStep } from '@/store/slices/ValuationSlice';
import type { RootState } from '@/store';
import { useAppSelector } from '@/hooks/redux';
import { selectAuth } from '@/store/slices/CustomerAuthSlice';
import { getFileName } from '@/utils/commonFunctions';
import { setPreApprovalStep } from '@/store/slices/MortgageSlice';
import { useNavigate } from 'react-router-dom';
import {
  generateJsonDocumentList,
  generateJsonDocumentRemove,
} from '@/views/Dashboard/PropertyValuation/JsonRequests/PropertyValuationDocument';
//@ts-ignore
import modNetwork from '../../../../../lib/konyLib/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import BG_Card from '@/assets/icon/svg/bgdesktopwide.svg';
import Trash from '@/assets/icon/svg/Trash.svg';
import { CardMedia } from '@mui/material';

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

// Generate dynamic validation schema based on input array
const generateValidationSchema = (fields: any[]) => {
  const validationSchema = Yup.object().shape(
    fields.reduce((acc, { code, requirementType, name }) => {
      // If the field is mandatory, make it required
      console.log('code is manadte ', name, requirementType);
      if (requirementType === 'Mandatory') {
        acc[code] = Yup.string().required(`${name} is required`);
      } else {
        acc[code] = Yup.string().notRequired();
      }
      return acc;
    }, {})
  );
  return validationSchema;
};

const DocumentUploadForm: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [documentListData, setDocumentListData] = useState<any[]>([
    { code: 'floorplans', name: 'Floor Plans', id: '30.0', requirementType: 'Mandatory' },
    { code: 'oqood', name: 'Oqood', id: '33.0', requirementType: 'Optional' },
    {
      code: 'salespurchaseagreement',
      name: 'Sales Purchase Agreement (SPA)',
      id: '34.0',
      requirementType: 'Mandatory',
    },
    {
      code: 'memorandumofunderstanding',
      name: 'Memorandum of Understanding (MOU)',
      id: '35.0',
      requirementType: 'Optional',
    },
    { code: 'additionaldocuments', name: 'Additional Documents', id: '36.0', requirementType: 'Optional' },
  ]);
  const userDetails = useAppSelector(selectAuth);
  const fetchdata: any[] = [];
  const navigate = useNavigate();

  const documents = useSelector((state: RootState) => state.valuation.documents);
  const validationSchema = generateValidationSchema(documentListData);

  const client_id = 'your-client-id'; // Replace with your client ID
  const client_secret = 'your-client-secret'; // Replace with your client secret
  const grant_type = 'client_credentials'; // Replace with the grant type

  const formik = useFormik<DocumentValues>({
    initialValues: documents,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateDocuments(values));
      console.log('onsubmit click');
      dispatch(setValuationActiveStep(3)); // Move to Review step
    },
  });

  useEffect(() => {
    documentFetch();
  }, []);

  function mergeArraysById(arr1: any[], arr2: any[]) {
    // Iterate over arr1 and try to merge with matching documentTypeId from arr2
    return arr1
      .map((item1) => {
        const matchingItem2 = arr2.find((item2) => item2.documentTypeId == item1.id);
        if (matchingItem2) {
          // If there's a match, merge the two objects
          return { ...matchingItem2, ...item1 };
        }
        // If no match, return the item from arr1 as is
        return item1;
      })
      .concat(
        // After mapping, we also add items from arr2 that don't match any item in arr1
        arr2.filter((item2) => !arr1.some((item1) => item1.id === item2.documentTypeId))
      );
  }

  const documentFetch = () => {
    const document = { bankReferenceId: '1234' }; //userDetails.lapsRefNumber
    //const finalJson = generateJsonDocumentFetch(document);
    orderApiCall(document, API.PROPERTY_VALUATION_DOCS_FETCH, 'fetch');
  };
  const documentList = () => {
    const document = { transactionTypeClientCode: '0' };
    const finalJson = generateJsonDocumentList(document);
    orderApiCall(finalJson, API.PROPERTY_VALUATION_DOCS_LIST, 'list');
  };
  const documentUpload = (file: any) => {
    const document = { bankReferenceId: '1234' };
    //const finalJson = generateJsonDocumentUpload(document);
    orderApiCall(document, API.PROPERTY_VALUATION_DOCS_UPLOAD, 'upload');
  };

  const documentRemove = () => {
    const document = { bankReferenceId: '1234', documentId: '' };
    const finalJson = generateJsonDocumentRemove(document);
    orderApiCall(finalJson, API.PROPERTY_VALUATION_DOCS_REMOVE, 'remove');
  };

  // Prepare the data for the POST request
  const data = new URLSearchParams();
  data.append('client_id', client_id);
  data.append('client_secret', client_secret);
  data.append('grant_type', grant_type);

  // Make the fetch call to get the token
  // Function to fetch the token
  function fetchToken(client_id, client_secret, grant_type) {
    const tokenUrl = 'https://your-api-url.com/token'; // Replace with your token URL

    // Prepare the data for the POST request
    const data = new URLSearchParams();
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);
    data.append('grant_type', grant_type);

    // Make the fetch call to get the token
    return fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        // Return the token
        return data.access_token; // Assuming the token is in the access_token field
      })
      .catch((error) => {
        console.error('Error fetching token:', error);
        throw error;
      });
  }

  // Function to upload file with Bearer token and additional parameter
  function uploadFileWithToken(token: any, file: string | Blob, extraParam: string | Blob) {
    const uploadUrl = 'https://your-api-url.com/upload'; // Replace with your file upload URL

    // Prepare the form data for the file upload and additional parameter
    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('extra_param', extraParam); // Append any additional parameter

    // Make the fetch call to upload the file
    return fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token as a Bearer token
      },
      body: formData, // Form data automatically sets the content type to multipart/form-data
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully:', data);
        return data; // Return the upload response data
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        throw error;
      });
  }

  // Fetch the token
  fetchToken(client_id, client_secret, grant_type)
    .then((token) => {
      // Use the token to upload the file once it's received
      const file = ''; // Get the selected file from the input
      const extraParam = ''; // Get the selected file from the input
      if (file) {
        return uploadFileWithToken(token, file, extraParam);
      } else {
        throw new Error('No file selected');
      }
    })
    .then((uploadResponse) => {
      // Handle the response from the upload
      console.log('Upload Response:', uploadResponse);
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });

  const orderApiCall = async (finalJson: any, apiName: string, type: string) => {
    /* type may be fetch, list, upload or remove */
    modNetwork(
      apiName,
      { ...finalJson },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
          /* empty */
          if (type === 'list') {
            if (res.docsList && fetchdata.length > 0) {
              const merged = mergeArraysById(res.docsList, fetchdata[0]);
              setDocumentListData(merged);
            }
          } else if (type === 'fetch') {
            if (fetchdata.length == 0) {
              fetchdata.push(res.docsList);
              setTimeout(() => {
                documentList();
              }, 800);
            }
          }
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
    dispatch(setValuationActiveStep(1)); // Go back to Access Details
  };

  const handleFileChange = (field: keyof DocumentValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
      documentUpload(file);
    }
  };

  const handleFileDelete = (field: keyof DocumentValues) => () => {
    formik.setFieldValue(field, null);
  };
  function handleCancel(): void {
    dispatch(setPreApprovalStep(0));
    navigate(-1);
  }

  const renderFileInput = (field: keyof DocumentValues, label: string, documentObject: any) => {
    const file = formik.values[field];
    const error = formik.touched[field] && formik.errors[field];

    return (
      <Grid key={field} item xs={12} md={6}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            flexDirection: 'row',
            borderColor: '#BEC1C4',
            borderWidth: 1, // Add a 2px solid black border
            borderRadius: '8px', // Add 10px rounded corners
          }}
        >
          <Button
            //variant="outlined"
            component="label"
            fullWidth
            color={error ? 'error' : 'primary'}
            sx={{
              borderColor: '#BEC1C4',
              color: '#273239',
              width: '240px',
              height: '48px',
              '&:hover': { borderColor: '#273239', bgcolor: 'transparent' },
            }}
          >
            {/* {file ? file.name : t('valuation.documentUpload.choosefile')} */}
            {documentObject?.documentLink
              ? getFileName(documentObject.documentLink)?.trim().slice(0, 25)
              : file
                ? file.name.trim().slice(0, 25)
                : t('valuation.documentUpload.choosefile')}
            <input type="file" hidden accept=".pdf,.jpg,.png" onChange={handleFileChange(field)} />
          </Button>
          
            {/* // <IconButton onClick={handleFileDelete(field)} color="error" size="small">
            //   <Delete />
            // </IconButton> */}

        <Button onClick={handleFileDelete(field)}  size="small" >
              <img src={Trash} alt="Delete" />
            </Button>
          
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
      <CardMedia
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          borderRadius: '24px', // Optional, if you want rounded corners
        }}
        component={'image'}
        image={BG_Card}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {t('valuation.documentUpload.title')}
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            {t('valuation.documentUpload.noteDocumentMaxandFileType')}
          </Alert>

          <Grid container spacing={4}>
            {documentListData.map((field) => renderFileInput(field.code, field.name, field))}
          </Grid>

          <Box
            sx={{
              mt: 10,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%' }}>
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderColor: '#BEC1C4',
                  color: '#273239',
                  height: '48px',
                  borderRadius: '8px',
                  width: { xs: '100%', sm: '180px' }, // Full width on mobile, 160px on desktop
                  '&:hover': { borderColor: '#273239', bgcolor: 'transparent' },
                }}
              >
                {t('preApproval.incomeDetails.buttons.back')}
              </Button>
              <Button
                onClick={handleCancel}
                sx={{
                  borderColor: '#BEC1C4',
                  color: '#273239',
                  height: '48px',
                  borderRadius: '5px',
                  width: { xs: '100%', sm: '120px' }, // Full width on mobile, 160px on desktop
                  '&:hover': { borderColor: '#273239', bgcolor: 'transparent' },
                }}
              >
                {t('preApproval.incomeDetails.buttons.cancel')}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row-reverse' }, width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  height: '48px',
                  color: 'white',
                  bgcolor: '#E31B23',
                  borderRadius: '8px',
                  width: { xs: '100%', sm: '180px' }, // Full width on mobile, 160px on desktop
                  '&:hover': { bgcolor: '#CC181F' },
                }}
              >
                {t('preApproval.incomeDetails.buttons.continue')}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardMedia>
    </form>
  );
};

export default DocumentUploadForm;

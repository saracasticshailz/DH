'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, Button, Alert } from '@mui/material';
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
import Grid from '@mui/material/Grid';

import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';
import BG_Card from '@/assets/icon/svg/bgdesktopwide.svg';
import Trash from '@/assets/icon/svg/trash.svg';
import { CardMedia } from '@mui/material';
//@ts-ignore
import modNetwork from '../../../../../lib/konyLib/common/modules/modNetwork';
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

const generateValidationSchema = (fields: any[]) => {
  const validationSchema = Yup.object().shape(
    fields.reduce((acc, { code, requirementType, name }) => {
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

  const client_id = 'your-client-id';
  const client_secret = 'your-client-secret';
  const grant_type = 'client_credentials';

  const formik = useFormik<DocumentValues>({
    initialValues: documents,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateDocuments(values));
      console.log('onsubmit click');
      dispatch(setValuationActiveStep(3));
    },
  });

  useEffect(() => {
    documentFetch();
  }, []);

  function mergeArraysById(arr1: any[], arr2: any[]) {
    return arr1
      .map((item1) => {
        const matchingItem2 = arr2.find((item2) => item2.documentTypeId == item1.id);
        return matchingItem2 ? { ...matchingItem2, ...item1 } : item1;
      })
      .concat(arr2.filter((item2) => !arr1.some((item1) => item1.id === item2.documentTypeId)));
  }

  const documentFetch = () => {
    const document = { bankReferenceId: '1234' };
    orderApiCall(document, API.PROPERTY_VALUATION_DOCS_FETCH, 'fetch');
  };
  const documentList = () => {
    const document = { transactionTypeClientCode: '0' };
    const finalJson = generateJsonDocumentList(document);
    orderApiCall(finalJson, API.PROPERTY_VALUATION_DOCS_LIST, 'list');
  };
  const documentUpload = (file: any) => {
    const document = { bankReferenceId: '1234' };
    orderApiCall(document, API.PROPERTY_VALUATION_DOCS_UPLOAD, 'upload');
  };
  const documentRemove = () => {
    const document = { bankReferenceId: '1234', documentId: '' };
    const finalJson = generateJsonDocumentRemove(document);
    orderApiCall(finalJson, API.PROPERTY_VALUATION_DOCS_REMOVE, 'remove');
  };

  const data = new URLSearchParams();
  data.append('client_id', client_id);
  data.append('client_secret', client_secret);
  data.append('grant_type', grant_type);

  function fetchToken(client_id: string, client_secret: string, grant_type: string) {
    const tokenUrl = 'https://your-api-url.com/token';
    const data = new URLSearchParams();
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);
    data.append('grant_type', grant_type);

    return fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => data.access_token)
      .catch((error) => {
        console.error('Error fetching token:', error);
        throw error;
      });
  }

  function uploadFileWithToken(token: any, file: string | Blob, extraParam: string | Blob) {
    const uploadUrl = 'https://your-api-url.com/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('extra_param', extraParam);

    return fetch(uploadUrl, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error('Error uploading file:', error);
        throw error;
      });
  }

  fetchToken(client_id, client_secret, grant_type)
    .then((token) => {
      const file = '';
      const extraParam = '';
      if (file) {
        return uploadFileWithToken(token, file, extraParam);
      } else {
        throw new Error('No file selected');
      }
    })
    .then((uploadResponse) => {
      console.log('Upload Response:', uploadResponse);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  const orderApiCall = async (finalJson: any, apiName: string, type: string) => {
    modNetwork(
      apiName,
      { ...finalJson },
      (res: any) => {
        if (res.oprstatus == 0 && res.returnCode == 0) {
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
          console.log('Error Message ', res.errmsg);
        }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  const handleBack = () => dispatch(setValuationActiveStep(1));
  const handleFileChange = (field: keyof DocumentValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
      documentUpload(file);
    }
  };
  const handleFileDelete = (field: keyof DocumentValues) => () => formik.setFieldValue(field, null);
  const handleCancel = () => {
    dispatch(setPreApprovalStep(0));
    navigate(-1);
  };

  const renderFileInput = (field: keyof DocumentValues, label: string, documentObject: any) => {
    const file = formik.values[field];
    const error = formik.touched[field] && formik.errors[field];

    return (
      <Grid key={field} size={{ xs: 12, md: 6 }}>
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
            borderWidth: 1,
            borderRadius: '8px',
          }}
        >
          <Button
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
            {documentObject?.documentLink
              ? getFileName(documentObject.documentLink)?.trim().slice(0, 25)
              : file
                ? file.name.trim().slice(0, 25)
                : t('valuation.documentUpload.choosefile')}
            <input type="file" hidden accept=".pdf,.jpg,.png" onChange={handleFileChange(field)} />
          </Button>

          <Button onClick={handleFileDelete(field)} size="small">
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
        sx={{ width: '100%', height: '100%', backgroundColor: 'transparent', borderRadius: '24px' }}
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
                  width: { xs: '100%', sm: '180px' },
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
                  width: { xs: '100%', sm: '120px' },
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
                  width: { xs: '100%', sm: '180px' },
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

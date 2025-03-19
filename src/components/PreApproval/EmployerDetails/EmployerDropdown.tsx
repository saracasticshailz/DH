'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Autocomplete, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/common/TextInput';
//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

interface EmployerDetail {
  companyCode: string;
  companyName: string;
  companyStatus: string;
}

interface EmployerDropdownProps {
  name: string;
  value: { employerCode: string; companyName: string } | null;
  onChange: (value: { employerCode: string; companyName: string } | null) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: boolean;
  helperText?: string;
  label: string;
  placeholder: string;
}

export default function EmployerDropdown({
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label,
  placeholder,
}: EmployerDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<EmployerDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value?.companyName || '');
  const [showAlert, setShowAlert] = useState(false);

  // Find the selected option from the options array
  const selectedOption = options.find((option) => option.companyCode === value?.employerCode) || null;

  // Update inputValue when value prop changes
  useEffect(() => {
    if (value?.companyName) {
      setInputValue(value.companyName);
    }
  }, [value?.companyName]);

  useEffect(() => {
    if (!open || inputValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const handler = setTimeout(() => {
      let active = true;

      const fetchEmployerName = async () => {
        setLoading(true);
        modNetwork(
          API.FETCH_EMPLOYER_DETAILS,
          {
            companyName: inputValue,
            portalFlag: '',
          },
          (res: any) => {
            console.log('API Response:', res);

            setLoading(false);
            if (res.oprstatus == 0 && res.returnCode == 0) {
              if (active) {
                setOptions(res?.company || []);
              }
            } else {
              console.error('API Error:', res.errmsg);
              // alert(res.errmsg[1]);
            }
          },
          '',
          '',
          '',
          MOD_CONSTANTS.REGISTER
        );
      };

      fetchEmployerName();

      return () => {
        active = false;
      };
    }, 800);

    return () => clearTimeout(handler);
  }, [inputValue, open]);

  const handleChange = (event: React.SyntheticEvent, newValue: EmployerDetail | null) => {
    if (newValue) {
      // Update the input value to show the selected option
      setInputValue(`${newValue.companyCode} - ${newValue.companyName}`);

      onChange({
        employerCode: newValue.companyCode,
        companyName: newValue.companyName,
      });
    } else {
      setInputValue('');
      onChange(null);
    }
    setOpen(false);
  };

  return (
    <Autocomplete
      id={name}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.companyCode === value.companyCode}
      getOptionLabel={(option) => `${option.companyCode} - ${option.companyName}`}
      options={options}
      loading={loading}
      value={selectedOption}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        // Only update inputValue when typing, not when selecting
        if (event && event.type === 'change') {
          setInputValue(newInputValue);
        }
      }}
      onChange={handleChange}
      onBlur={onBlur}
      renderOption={(props, option) => (
        <li {...props} key={option.companyCode}>
          {option.companyCode} - {option.companyName}
        </li>
      )}
      renderInput={(params) => (
        <TextInput
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={t('common.noOptions')}
      loadingText={t('common.loading')}
      disableCloseOnSelect={false}
      freeSolo={false}
    />
  );
}

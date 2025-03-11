'use client';

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

// @ts-ignore
import { Invoker } from '../../../v2/common/modules/modServiceInvoker';
import TextInput from '@/components/common/TextInput';

interface EmployerDetail {
  companyCode: string;
  companyName: string;
  companyStatus: string;
}

interface EmployerDropdownProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
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
  const [inputValue, setInputValue] = useState('');
  const { invokeOperation } = Invoker();

  const selectedOption = options.find((option) => option.companyName === value) || null;

  useEffect(() => {
    let active = true;
    if (!open) {
      return undefined;
    }
    if (inputValue.length < 2) {
      setOptions([]);
      return undefined;
    }
    setLoading(true);

    const fetchEmployerName = async () => {
      setLoading(true);
      await invokeOperation(
        'inq_company_details',
        {},
        {
          companyName: inputValue,
          portalFlag: '',
        },
        (res: any) => {
          setLoading(false);
          if (res.oprstatus == 0 && res.returnCode == 0) {
            if (active) {
              setOptions(res?.data || []);
            }
          } else {
            alert(res.errmsg[1]);
          }
        },
        (err: any) => {
          setLoading(false);
          if (active) {
            setOptions([]);
          }
          console.log('ERROR', err);
          alert(JSON.stringify(err));
        }
      );
    };
    fetchEmployerName();
    return () => {
      active = false;
    };
  }, [inputValue, open]);

  const handleChange = (event: React.SyntheticEvent, newValue: EmployerDetail | null) => {
    onChange(newValue ? newValue.companyName : '');
    // Close the dropdown immediately after selection
    setOpen(false);
  };

  return (
    <Autocomplete
      id={name}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        if (typeof option === 'string' || typeof value === 'string') return false;
        return option.companyName === value.companyName;
      }}
      getOptionLabel={(option) => {
        if (!option || typeof option === 'string') {
          return '';
        }
        return option.companyName || '';
      }}
      options={options}
      loading={loading}
      value={selectedOption}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleChange}
      onBlur={onBlur}
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
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      noOptionsText={t('common.noOptions')}
      loadingText={t('common.loading')}
      // Add this prop to close dropdown on selection
      disableCloseOnSelect={false}
    />
  );
}

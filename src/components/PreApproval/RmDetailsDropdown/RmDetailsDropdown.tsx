'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/common/TextInput';
//@ts-ignore
import modNetwork from '../../../../lib/konyLib/common/modules/modNetwork';
import API from '@/utils/apiEnpoints';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

interface RMDetail {
  rmCode: string;
  rmName: string;
  rmMobile: string;
  rmEmailId: string;
}

interface RmDropdownProps {
  name: string;
  value: { rmCode: string; rmName: string } | null;
  onChange: (value: { rmCode: string; rmName: string } | null) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: boolean;
  helperText?: string;
  label: string;
  placeholder: string;
}

export default function RmDropdown({
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label,
  placeholder,
}: RmDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<RMDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const previousOpen = useRef(open);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = options.find((option) => option.rmCode === value?.rmCode) || null;

  const fetchRmDetails = (searchValue: string) => {
    if (!searchValue || searchValue.length < 3) return;

    setLoading(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    modNetwork(
      API.FETCH_RM_DETAILS,
      {
        searchParameterType: 'RMCODE',
        searchParameterValue: searchValue,
      },
      (res: any) => {
        setLoading(false);

        if (res.oprstatus === 0 && res.returnCode === '0') {
          let rmDetails = [];

          if (Array.isArray(res.rmDetails)) {
            rmDetails = res.rmDetails;
          } else if (res.rmDetails && typeof res.rmDetails === 'object') {
            rmDetails = [res.rmDetails];
          }

          setOptions(rmDetails);
        } else {
          setOptions([]);
          if (res.errmsg && res.errmsg[1] && !res.errmsg[1].includes('No records found')) {
            alert(res.errmsg[1] || 'Error fetching data');
          }
        }
      },
      (err: any) => {
        setLoading(false);
        setOptions([]);
      },
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  useEffect(() => {
    if (!open) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (inputValue.length < 3) {
      setOptions([]);
      return;
    }

    timerRef.current = setTimeout(() => {
      fetchRmDetails(inputValue);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, open]);

  useEffect(() => {
    if (open && !previousOpen.current && inputValue.length >= 3) {
      fetchRmDetails(inputValue);
    }

    previousOpen.current = open;
  }, [open, inputValue]);

  const handleChange = (event: React.SyntheticEvent, newValue: RMDetail | null) => {
    if (newValue) {
      onChange({
        rmCode: newValue.rmCode,
        rmName: newValue.rmName,
      });
    } else {
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
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.rmCode === value.rmCode;
      }}
      getOptionLabel={(option) => {
        if (!option) return '';
        return typeof option === 'string' ? option : `${option.rmCode} - ${option.rmName}`;
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
      renderOption={(props, option) => (
        <li {...props} key={option.rmCode}>
          {option.rmCode} - {option.rmName}
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
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      noOptionsText={
        inputValue.length < 3
          ? t('common.typeMoreChars', { count: 3 })
          : loading
            ? t('common.loading')
            : t('common.noOptions')
      }
      loadingText={t('common.loading')}
      disableCloseOnSelect={false}
    />
  );
}

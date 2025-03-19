'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TextInput from '../TextInput';
interface AutocompleteOption {
  employerCode: string;
  companyName: string;
  companyStatus: string;
  [key: string]: any; // Allow for additional properties
}

interface AutocompleteFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  value: any;
  options: AutocompleteOption[];
  onSearch: (searchTerm: string) => void;
  onSelect: (selectedOption: AutocompleteOption | null) => void;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  getOptionLabel?: (option: AutocompleteOption) => string;
  isOptionEqualToValue?: (option: AutocompleteOption, value: AutocompleteOption) => boolean;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: AutocompleteOption) => React.ReactNode;
  noOptionsText?: string;
  className?: string;
}

export default function AutocompleteField({
  name,
  label,
  placeholder,
  value,
  options,
  onSearch,
  onSelect,
  loading = false,
  error = false,
  helperText,
  disabled = false,
  required = false,
  getOptionLabel = (option) => option.label,
  isOptionEqualToValue = (option, value) => option.id === value.id,
  renderOption,
  noOptionsText,
  className,
}: AutocompleteFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle debounced search
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (open && inputValue.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        onSearch(inputValue);
      }, 800);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, open, onSearch]);

  return (
    <Autocomplete
      id={name}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      value={value}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        onSelect(newValue);
      }}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      disabled={disabled}
      className={className}
      noOptionsText={noOptionsText || t('common.noOptions')}
      loadingText={t('common.loading')}
      renderInput={(params) => (
        <TextInput
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
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
    />
  );
}

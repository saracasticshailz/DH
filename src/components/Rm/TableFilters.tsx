'use client';

import type React from 'react';
import { Box, InputAdornment, MenuItem } from '@mui/material';
import { Formik, Form, Field, type FormikHelpers } from 'formik';
import type * as Yup from 'yup';
import { Search } from 'lucide-react';
import TextInput from '@/components/common/TextInput';
import { AppButton } from '@/components';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'select';
  options?: FilterOption[];
  validation?: Yup.AnySchema;
  width?: number; // Flex value
}

export interface FilterValues {
  [key: string]: string;
}

interface TableFiltersProps {
  filters: FilterConfig[];
  initialValues: FilterValues;
  onFilter: (values: FilterValues) => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  validationSchema?: Yup.ObjectSchema<any>;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  initialValues,
  onFilter,
  actionButton,
  validationSchema,
}) => {
  const handleSubmit = (values: FilterValues, helpers: FormikHelpers<FilterValues>) => {
    onFilter(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 3,
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            {filters.map((filter) => (
              <Box key={filter.name} sx={{ flex: filter.width || 1 }}>
                <Field name={filter.name}>
                  {({ field }: any) => (
                    <TextInput
                      {...field}
                      label={filter.label}
                      placeholder={filter.placeholder}
                      fullWidth
                      select={filter.type === 'select'}
                      InputProps={
                        filter.name === 'searchTerm'
                          ? {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={20} />
                                </InputAdornment>
                              ),
                            }
                          : undefined
                      }
                      onChange={(e) => {
                        field.onChange(e);
                        setFieldValue(filter.name, e.target.value);
                        // If it's a search field, trigger filter immediately
                        if (filter.name === 'searchTerm') {
                          setTimeout(() => {
                            onFilter({
                              ...values,
                              [filter.name]: e.target.value,
                            });
                          }, 0);
                        }
                      }}
                    >
                      {filter.type === 'select' &&
                        filter.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </TextInput>
                  )}
                </Field>
              </Box>
            ))}

            {actionButton && (
              <AppButton
                fullWidth={false}
                type="button"
                variant="contained"
                color="primary"
                style={{ alignSelf: 'end' }}
                onClick={actionButton.onClick}
              >
                {actionButton.label}
              </AppButton>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default TableFilters;

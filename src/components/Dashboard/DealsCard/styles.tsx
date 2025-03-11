import { Box, Card, styled } from '@mui/material';

export const DealsHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
});

export const DealItem = styled(Box)({
  display: 'flex',
  gap: 16,
  marginBottom: 16,
  '& img': {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: 'cover',
  },
});

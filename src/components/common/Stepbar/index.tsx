import { Box, Typography, styled } from '@mui/material';
import type { ReactNode } from 'react';

interface StepBarProps {
  text: string;
  isActive?: boolean;
  children?: ReactNode;
}

const StepContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 16,
});

const Bar = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: 4,
  minHeight: '1.5rem', // Minimum height to ensure visibility
  height: 'auto', // Height will adjust based on content
  backgroundColor: active ? '#E31B23' : '#9E9E9E',
  borderRadius: 2,
  marginRight: 16,
  alignSelf: 'stretch', // Make it stretch to match the content height
}));

const TextContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '1.5rem', // Match the minimum height of the StepBar
});

const StepBar = ({ text, isActive = false, children }: StepBarProps) => {
  return (
    <StepContainer>
      <Bar active={isActive} />
      <TextContent>
        <Typography variant="body1" fontWeight={isActive ? 600 : 400}>
          {text}
        </Typography>
        {children}
      </TextContent>
    </StepContainer>
  );
};

export default StepBar;

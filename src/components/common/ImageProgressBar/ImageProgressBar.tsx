import { IMG } from '@/assets/images';
import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledBox = styled(Box)({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  //   height: '524px',
  //   width: '100%',
});

const StyledImage = styled('img')({
  //   width: '100%',
  //   height: '100%',
  objectFit: 'cover',
});

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
});

const ProgressBar = styled(Box)({
  display: 'flex',
  gap: 4,
  '& > div': {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    flex: 1,
    transition: 'flex 0.3s ease',
  },
});

interface ImageProgressBarProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function ImageProgressBar({ currentStep, totalSteps, title }: ImageProgressBarProps) {
  const { t } = useTranslation();

  return (
    <StyledBox>
      <StyledImage src={IMG.ImageProgressBarBg} alt="Modern property exterior" height={'100%'} />
      <Overlay sx={{}}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: '20px', sm: '25px 30px', md: '30px 40px' },
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '0',
            minHeight: { xs: '100px', sm: '120px', md: '140px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'white',
                mb: 1,
                fontSize: '0.975rem',
                fontWeight: 1000,
              }}
            >
              {`${t('imageProgressBar.step')} ${currentStep} ${t('imageProgressBar.of')} ${totalSteps}`}
            </Typography>
            <ProgressBar>
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    flex: index === currentStep - 1 ? 3 : 1,
                    backgroundColor: index === currentStep - 1 ? 'white' : 'rgba(255,255,255,0.3)',
                    height: 5,
                    borderRadius: 8,
                  }}
                />
              ))}
            </ProgressBar>
          </Box>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Overlay>
    </StyledBox>
  );
}

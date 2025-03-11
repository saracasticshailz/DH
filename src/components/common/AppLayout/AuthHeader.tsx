import { FC } from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { IMG } from '@/assets/images';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AuthHeader: FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ae' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Grid
      container
      //spacing={2}
      sx={{
        alignItems: 'center',
        color: '#5d656b',
        paddingTop: 3,
        // marginTop: -2,
      }}
    >
      <Grid size={6}>
        <img src={IMG.AppLogo} alt="ADCB" loading="lazy" height={10} />
      </Grid>
      <Grid size={6} sx={{ textAlign: 'right', fontsize: '1.25rem' }}>
        <IconButton
          onClick={() => {
            console.log('Language switched to Arabic');
            toggleLanguage();
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: '14' }}>
            {t('header.language')}
          </Typography>
        </IconButton>

        {/* <AppButton withBorder onClick={() => console.log('logout')} size={'small'}>
          LOGOUT
        </AppButton> */}
      </Grid>
    </Grid>
  );
};

export default AuthHeader;

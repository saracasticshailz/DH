import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AppAlert, AppButton, AppLink, AppView } from '@/components';

/**
 * "Not Found" aka "Error 404" view
 * url: any unknown :)
 * @page NotFoundView
 */
const NotFoundView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <AppView>
      <Typography variant="h3" component="h1">
      {t('notFoundView.pageNotFound')}
      </Typography>
      <Typography variant="body1">
      {t('notFoundView.requestedAddressMessage')} <AppLink to="/">{t('notFoundView.homePage')}</AppLink>.
      </Typography>
      <AppAlert severity="error" onClose={onClose}>
      {t('notFoundView.error404Message')}
      </AppAlert>
      <Stack direction="row" justifyContent="center">
        <AppButton onClick={onClose}>{t('notFoundView.gotoHomePage')}</AppButton>
      </Stack>
    </AppView>
  );
};

export default NotFoundView;

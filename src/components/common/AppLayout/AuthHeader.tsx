import { FC } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { IMG } from '@/assets/images';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AppButton from '../AppButton';
import DownloadButton from '../DownloadButton/DownloadButton';
import MiniButton from '../MiniButton/MiniButton';
import { EditIcon } from 'lucide-react';
import { Logout } from '@mui/icons-material';
import { useEventLogout, useIsAuthenticated } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout, selectAuth } from '@/store/slices/CustomerAuthSlice';
import { useNavigate } from 'react-router-dom';

const AuthHeader: FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ae' : 'en';
    i18n.changeLanguage(newLang);
  };
  const { isAuthenticated } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    alert(t('header.sureWantToLogout'));
    // useEventLogout();
    dispatch(logout());
    navigate('/Login', { replace: true });
  };
  // console.log('isAuthenticated', isAuthenticated);

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
        {isAuthenticated && <MiniButton text="Logout" icon={<Logout />} onPress={handleLogout} />}
      </Grid>
    </Grid>
  );
};

export default AuthHeader;

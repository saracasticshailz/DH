import { FC, use } from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const AuthFooter: FC = () => {
  const { t } = useTranslation();
  return (
    <Grid
      marginTop={2}
      container
      spacing={2}
      sx={{
        alignItems: 'center',
        fontSize: '0.875rem',
        color: '#5d656b',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        borderTop: '1px solid #d9d9d9',
        paddingY: 1.5,
      }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          sx={{
            fontSize: 'inherit',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {t('footer.copyRight')}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ul className="footer-link justify-center md:justify-end ">
          <li>
            <a href="#">{t('footer.termsConditions')}</a>
          </li>
          <li>
            <span>|</span>
          </li>
          <li>
            <a href="#">{t('footer.privacyPolicy')}</a>
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default AuthFooter;

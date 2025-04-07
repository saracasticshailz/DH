import { ErrorBoundary } from '@/components';
import Routes from '@/routes';
import StoreProvider from '@/store';
import { ThemeProvider } from '@/theme';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './default.css';

// @ts-ignore
import useHandShake from '../lib/konyLib/common/hooks/useHandShake.js';

const MainApp = () => {
  useHandShake();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);

  return (
    <ErrorBoundary name="App">
      <Provider store={StoreProvider}>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes />
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default MainApp;

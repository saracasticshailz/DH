import { ErrorBoundary } from '@/components';
import Routes from '@/routes';
import StoreProvider from '@/store';
import { ThemeProvider } from '@/theme';
// import { apiManager } from './apiManager/apiManager';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LRUCache } from '/Users/apple/Downloads/DH4/node_modules/lru-cache/dist/esm/index';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './default.css';
import { useKonySDK } from './services/kony-service';
import { useEffect } from 'react';
// import KonyInitializer from './kony/KonyInitializer';
// import { useEffect } from 'react';
// import '../lib/temenos-sdk/release/kony-sdk.js';
import useHandShake from './v2/common/hooks/useHandShake.js';

import { Invoker } from './kony/KonyServiceInvoker';

const MainApp = () => {
  useHandShake();

  // useEffect(() => {
  //   // var appkey = 'adcbdhp-dev2int1';
  //   //   var appsecret = 'adcbdhp-dev2int1';
  //   //   var serviceURL = 'https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig';

  //   const { initSDK, invokeOperation } = Invoker();
  //   const mfconfig = {
  //     appKey: 'adcbdhp-dev2int1',
  //     appSecret: 'adcbdhp-dev2int1',
  //     serviceURL: 'https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig',
  //     // appKey: 'adcbmib-uat1int4',
  //   };

  //   initSDK({
  //     mfconnect: mfconfig,
  //     onSuccessCallBack: async (response) => {
  //       console.log('New SDK initialized successfully', response, Date.now());

  //       await invokeOperation(
  //         'inq_handshake', //sub_signup_signin
  //         {},
  //         {
  //           b: `64086422746506901283145899169124447818530164191888454201456180223652179972625035034041482778747817176471997008548029930153694988228805181009654776056175728097265934687782497694363385359540619900996627868414152504922071874967991737916539764365001594875198409863949598407429312746667655119330663049563061050597`,
  //           clientTime: Date.now(),
  //         }, //body
  //         (res) => {
  //           console.log(res);
  //         },
  //         (err) => {
  //           console.log('ERROR', err);
  //         }
  //       );
  //       ///////////
  //     },
  //     onFailureCallBack: (error) => {
  //       console.error('SDK initialization failed:', error);
  //     },
  //   });
  // }, []);

  // console.log('', new window.kony.sdk());
  // useEffect(() => {
  //   var appkey = 'adcbdhp-dev2int1';
  //   var appsecret = 'adcbdhp-dev2int1';
  //   var serviceURL = 'https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig';

  //   var client = new window.kony.sdk();

  //   //set Pragma Header to disable the use of response cache in browsers.
  //   client.setGlobalRequestParam('Pragma', 'no-cache', client.globalRequestParamType.headers);
  //   client.init(
  //     appkey,
  //     appsecret,
  //     serviceURL,
  //     function (response: any) {
  //       console.log('Init success', response);
  //     },
  //     function (error: any) {
  //       console.log('Init Failure');
  //     }
  //   );
  // }, []);
  // const { konySDK, error, isLoading } = useKonySDK();
  // useEffect(() => {
  //   if (konySDK && !isLoading) {
  //     try {
  //       // Example of using Kony SDK
  //       const data = konySDK();
  //       console.log('SHAILESH', data);
  //     } catch (err) {
  //       console.error('Error using Kony SDK:', err);
  //     }
  //   }
  // }, [konySDK, isLoading]);

  // const konyInit = () => {
  //   //Sample code to initialize Quantum Fabric Client
  //   var appkey = 'your - app - key ';
  //   var appsecret = 'your - app - secret';
  //   var serviceURL = 'your - service - url ';
  //   window.KonySDK;

  //   // var client = new kony.sdk();
  //   // //set Pragma Header to disable the use of response cache in browsers.
  //   // client.setGlobalRequestParam('Pragma', 'no-cache', client.globalRequestParamType.headers);
  //   // client.init(
  //   //   appkey,
  //   //   appsecret,
  //   //   serviceURL,
  //   //   function (response: any) {
  //   //     console.log('Init success');
  //   //   },
  //   //   function (error: any) {
  //   //     console.log('Init Failure');
  //   //   }
  //   // );
  // };

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

import { useState, useEffect } from 'react';
// import GlobalObj from '../../common/global';

import modMIBInit from '../../common/modules/modMIBInit';
import appUtils from '../../common/modules/appUtils';
import BigInteger from '../../common/jslibs/libSrpJsbn';
import modNetwork from '../../common/modules/modNetwork';
import modDateTimeUtil from '../../common/modules/modDateTimeUtil';
import GlobalObj from '../modules/appGlobal';

// import DeviceInfo from 'react-native-device-info';
// import modDeviceInfoUtil from 'common/modules/modDeviceInfoUtil';
// import {Platform} from 'react-native';

const useHandShake = () => {
  const [handShakedata] = useState();

  useEffect(function () {
    console.log('useHandShake');

    // async function getAppLaunchInputParam() {
    //   // const devId = modDeviceInfoUtil.getDeviceID();
    //   // const plat = Platform.OS.toUpperCase();
    //   // const osV = DeviceInfo.getSystemVersion();
    //   // const dmV = await DeviceInfo.getDeviceName();
    //   // const appVersionV = '17.5.0'; // DeviceInfo.getVersion();
    //   // const clientTime = '' + modDateTimeUtil.getCurrentTime();

    //   // var inputParamObj = {
    //   //   devdtls: {
    //   //     plat: plat,
    //   //     chnl: 'mobile',
    //   //     os: osV,
    //   //     dm: dmV,
    //   //   },
    //   //   deviceId: devId, //"f588f5c5079ff48d", // '9667038cc6f9d124',
    //   //   appVersion: appVersionV,
    //   //   imeiNo: null,
    //   //   appVer: appVersionV,
    //   //   lang: 'en',
    //   //   devScrnKey: '',
    //   // };
    //   console.log(inputParamObj);
    //   var inputParamObj = {
    //     devdtls: {
    //       plat: 'ANDROID',
    //       chnl: 'mobile',
    //       os: '11',
    //       dm: 'sdk_gphone_x86',
    //     },
    //     deviceId: 'f588f5c5079ff48d', //"f588f5c5079ff48d", // '9667038cc6f9d124',
    //     appVersion: '16.5.2',
    //     imeiNo: null,
    //     appVer: '16.5.2',
    //     lang: 'en',
    //     devScrnKey: '',
    //   };

    //   return inputParamObj;
    // }

    function handShakeDataCallback(response) {
      console.log('handShakeDataCallback', response);

      GlobalObj.Vars.isHandShakeSuccess = true;
      if (response.a != null && response.a != undefined) {
        var yaServVal = new BigInteger(response.a);
        var regKeyVal = yaServVal.modPow(GlobalObj.Vars.rVal, GlobalObj.Constants.REG_P_VAL);
        GlobalObj.Vars.enc_key = regKeyVal;
        GlobalObj.Vars.handshakeKey = regKeyVal;
        if (response.timeDiffInMillis != null && response.timeDiffInMillis != undefined) {
        }
        if (response.Property != null) {
          appUtils.setProperty(response.Property);
          var idleData = appUtils.getPropertyByKey('CLIENT_TIMEOUT');
          var sessionIdleTimeout = appUtils.getPropertyByKey('SESSION_IDLE_TIMEOUT');
          if (sessionIdleTimeout != null && sessionIdleTimeout != '') {
            sessionIdleTimeout = Number(sessionIdleTimeout) * 60 * 1000;
          }
          GlobalObj.Vars.IDLE_TIMEOUT_VAL = Number(idleData.IDLE_TIMEOUT_VAL_MS);
          GlobalObj.Vars.IDLE_ALERT_EXPIRY_TIME_MS = Number(idleData.IDLE_ALERT_EXPIRY_TIME_MS);
          GlobalObj.Vars.SERVER_SESSION_VAL = Number(idleData.SERVER_SESSION_EXTEND_MS);
          GlobalObj.Vars.CC_HIST_DATE_DIFF = Number(appUtils.getPropertyByKey('CC_HST_VALID_DAYS'));
          if (idleData.SERVICE_CALL_TIME_OUT_SEC != null && idleData.SERVICE_CALL_TIME_OUT_SEC != '') {
            GlobalObj.Vars.SERVICE_CALL_TIME_OUT = Number(idleData.SERVICE_CALL_TIME_OUT_SEC);
          } else {
            GlobalObj.Vars.SERVICE_CALL_TIME_OUT = GlobalObj.Constants.SERVICE_CALL_TIME_OUT;
          }
          if (
            appUtils.getPropertyByKey('CLIENT_ERROR_ENABLED') != null &&
            appUtils.getPropertyByKey('CLIENT_ERROR_ENABLED') == 'Y'
          ) {
            GlobalObj.Constants.ISCLIENT_ERRORENABLED = true;
          } else {
            GlobalObj.Constants.ISCLIENT_ERRORENABLED = false;
          }
          GlobalObj.Vars.SESSION_IDLE_TIMEOUT = sessionIdleTimeout;
          var proplist = appUtils.getPropertyByKey('CLIENT_CRASHLOG_ENABLED');
          // if (proplist !== null && proplist == 'Y') {
          //   kony.sdk
          //     .getCurrentInstance()
          //     .getMetricsService()
          //     .setEventTracking([
          //       'FormExit',
          //       'Error',
          //       'Crash',
          //       'FormEntry',
          //       'Touch',
          //     ]);
          //   kony.sdk
          //     .getCurrentInstance()
          //     .getMetricsService()
          //     .setEventConfig('Buffer', 1, 200);
          //   kony.sdk.getCurrentInstance().getMetricsService().flushEvents();
          // }
        }
        if (response.ErrorMapping != null) {
          appUtils.setServerErrorMessages(response.ErrorMapping);
        }

        // var inputParamObj = {
        //   devdtls: {
        //     plat: 'ANDROID',
        //     chnl: 'mobile',
        //     os: '11',
        //     dm: 'sdk_gphone_x86_arm',
        //   },
        //   deviceId: 'f588f5c5079ff48d',
        //   appVersion: '16.1.7',
        //   clientTime: '1724754612620',
        //   imeiNo: '',
        //   appVer: '16.1.7',
        //   lang: 'en',
        //   devScrnKey: '',
        // };
        // const launchParams = await this.getAppLaunchInputParam();

        // appUtils.setStaticUrls(response['URLMapping']);
        // getAppLaunchInputParam().then((inputParamObj) =>
        //   modNetwork(
        //     GlobalObj.Constants.OPERIDS.OPER_INQ_APP_LAUNCH,
        //     inputParamObj,
        //     (res) => {
        //       // dispatch(updateMibAppConfig(res));
        //       console.log(res);
        //       if (res != null) {
        //         if (res.nextScreen == 'HME') {
        //           // navigation.replace("WelcomeScreen");
        //         } else if (res.nextScreen == 'PWD' || res.nextScreen == 'NPE') {
        //           // navigation.replace("PreLoginLanding");
        //         }
        //       }
        //     },
        //     '',
        //     '',
        //     '',
        //     GlobalObj.Constants.AUTH_STEP.REGISTER
        //   )
        // );
      }
    }
    GlobalObj.Vars.enc_salt = GlobalObj.Constants.AUTH_SALT;
    modMIBInit.regHandShakeServiceCall(handShakeDataCallback);
  }, []);

  return [handShakedata];
};

export default useHandShake;

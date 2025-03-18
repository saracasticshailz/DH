/* eslint-disable */
// import { Platform } from "react-native";

// import modDeviceInfoUtil from "./modDeviceInfoUtil";
let appConfigResponseData = null;
let loginResponseData = null;
let uuid = '';
let appConfig = null;
let jsessionId = 'B432C4C1B4C7F96B069FB5B68A9BE918';

import { getPlatform } from '../global';

export const Invoker = () => {
  var invokeService = async ({ url, method, headers, body, onSuccess, onFailure }) => {
    try {
      // Add JSESSIONID to headers if it exists
      // if (jsessionId) {
      //   headers = {
      //     ...headers,
      //     Cookie: `JSESSIONID=${jsessionId}`
      //   };
      // }

      const response = await fetch(url, {
        method: method,
        headers: {
          ...headers,
        },
      });

      // Extract and store JSESSIONID from response headers
      // const setCookie = response.headers.get('set-cookie');
      // if (setCookie) {
      //   const match = setCookie.match(/JSESSIONID=([^;]+)/);
      //   if (match) {
      //     jsessionId = match[1];
      //   }
      // }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (onSuccess) {
        onSuccess(data); // Call the success callback with the response data
      }
      return data; // Return the response data
    } catch (error) {
      console.error('Service call failed:', error);
      if (onFailure) {
        onFailure(error); // Call the failure callback with the error
      }
      throw error; // Rethrow the error for further handling
    }
  };

  const initSDK = async ({ mfconnect, onSuccessCallBack, onFailureCallBack }) => {
    appConfig = mfconnect;
    const url = mfconnect.serviceURL;
    const method = 'GET';

    uuid = generateUUID().toString();
    console.log('initSDK', uuid);
    const headers = {
      'X-Kony-RequestId': uuid,
      'X-Kony-App-Key': mfconnect.appKey,
      'X-Kony-App-Secret': mfconnect.appSecret,
      'X-HTTP-Method-Override': 'GET',
    };
    const body = {}; // No body needed for GET requests

    await invokeService({
      url,
      method,
      headers,
      onSuccess: (data) => {
        // console.log("initSDK",data);
        loginService(data, onSuccessCallBack);
      },
      onFailureCallBack,
    });
  };

  var loginService = async (reponseData, onSuccessCallBack) => {
    // https://uat1auth.mobileapps.adcb.com:8457/authService/100000002/appconfig
    const loginUrl = appConfig.serviceURL.split('/appconfig')[0];
    const url = `${loginUrl}/login`;
    const method = 'POST';

    const headers = {
      'X-Kony-RequestId': uuid,
      'X-Kony-App-Key': appConfig.appKey,
      'X-Kony-App-Secret': appConfig.appSecret,
      'X-Kony-SDK-Type': 'js',
      'X-Kony-SDK-Version': '9.6.40',
      'X-Kony-Platform-Type': getPlatform(),
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'X-Kony-ReportingParams':
      //   '%7B%22os%22:%2211%22,%22dm%22:%22sdk_gphone_x86_arm%22,%22did%22:%22f588f5c5079ff48d%22,%22ua%22:%22sdk_gphone_x86_arm%22,%22aid%22:%22ADCBMIB%22,%22aname%22:%22ADCBMIB%22,%22chnl%22:%22mobile%22,%22plat%22:%22android%22,%22aver%22:%2217.6.19%22,%22atype%22:%22native%22,%22stype%22:%22b2c%22,%22kuid%22:%22%22,%22mfaid%22:%22de0636fa-0f6e-42f6-b981-9fb8729e23e5%22,%22mfbaseid%22:%22629dc8d6-6f4f-4dce-9f4a-c52a7cb92ba5%22,%22mfaname%22:%22MIBServices%22,%22sdkversion%22:%229.6.40%22,%22sdktype%22:%22js%22,%22fid%22:%22frmSplashScreen%22,%22sessiontype%22:%22I%22,%22clientUUID%22:%221731777856654-d26e-2abe-0e92%22,%22rsid%22:%221738308944781-5eea-714d-863f%22,%22svcid%22:%22login_$anonymousProvider%22%7D',
    };
    const body = {
      // Add your login parameters here
    };

    console.log('loginService', headers);

    await invokeService({
      url,
      method,
      headers,
      body,
      onSuccess: (data) => {
        // console.log()
        // console.log("appConfigResponseData",reponseData)
        appConfigResponseData = reponseData;
        loginResponseData = data;
        onSuccessCallBack(reponseData);
      },
      onFailure: (error) => {
        console.error('Login failed:', error);

        // Handle login failure (e.g., show an error message)
      },
    });
  };

  var generateUUID = function () {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return new Date().getTime() + '-' + S4() + '-' + S4() + '-' + S4();
  };

  var invokeOperation = async (operationName, headers, params, onSuccessCallBack, onFailureCallBack) => {
    try {
      console.log(loginResponseData, appConfigResponseData);
      // const url = `${appConfigResponseData.integsvc.IBMIB}/${operationName}`;
      const url = `${appConfigResponseData.integsvc.DreamHomePortal}/${operationName}`;
      var dheaders = {
        'X-Kony-RequestId': uuid, //"1738307860929-58ba-3036-b5c1",
        'Content-Type': 'application/x-www-form-urlencoded',
        // "X-Kony-ReportingParams":
        // "%7B%22os%22:%2211%22,%22dm%22:%22sdk_gphone_x86_arm%22,%22did%22:%22f588f5c5079ff48d%22,%22ua%22:%22sdk_gphone_x86_arm%22,%22aid%22:%22ADCBMIB%22,%22aname%22:%22ADCBMIB%22,%22chnl%22:%22mobile%22,%22plat%22:%22android%22,%22aver%22:%2217.6.19%22,%22atype%22:%22native%22,%22stype%22:%22b2c%22,%22kuid%22:%22%22,%22mfaid%22:%22de0636fa-0f6e-42f6-b981-9fb8729e23e5%22,%22mfbaseid%22:%22629dc8d6-6f4f-4dce-9f4a-c52a7cb92ba5%22,%22mfaname%22:%22MIBServices%22,%22sdkversion%22:%229.6.40%22,%22sdktype%22:%22js%22,%22fid%22:%22frmSplashScreen%22,%22sessiontype%22:%22I%22,%22clientUUID%22:%221731777856654-d26e-2abe-0e92%22,%22rsid%22:%221738313154346-afec-78fd-b68c%22,%22svcid%22:%22inq_handshake%22%7D",
        'X-Kony-Authorization': loginResponseData.claims_token.value,
        // "X-Kony-DeviceId": modDeviceInfoUtil.getDeviceID(),
        'X-Kony-API-Version': '1.0',
      };

      // Add JSESSIONID to headers if it exists
      if (jsessionId) {
        dheaders = {
          ...dheaders,
          'Set-Cookie': `JSESSIONID=B190FEA3A425C5156BB192F2CA9AF2A7`,
        };
      }

      // console.log('params', params);
      // const body = {
      //   data: "ABXboR5LlHouRUCD6iCTrH2QP5LeBsr/Qh5OprHv2c+avpJjHpTwl9CZ2rxOqshHN7+Je6gEckJcwqP6JrMVAL0VPTl+FVDVKHOMHHvaxdPseoJe7GACFF8YgmNgxdZZV89M/Mapi1zcBwNnWn4aqwBQhiGWt50NEDYfuvFmgAiAb5iL/0SjKVb8mTxvg/Lkysd6bShdgfyiFGMrr8u0LpDyQtRLro56gkrJmZUJKb5Bl1MtWyboUsCf6EGzGC1gAA7yWx+0l346zGsNdWjU+Qpz3Hn3IL8sMAKimzfgRygcj36VgJ7Nz8+HLPXJGdTo2UKc01RC2/Va0riFQDAqVIlQhIwTfyaM9BkJzRpVMTBuGrUjP96fnDmM7pXBa6+VCsjAYHSCrnClAr895p3MiGNUz3d4+ca9z9bB6OlM5EYdMaMniuYOuD6je+a48+p3r099SyjJl4fkKGvvuTiqAxnKi58Q5JnVhg==",
      //   appVer: "17.6.19",
      // };
      const method = 'POST';
      const response = await fetch(url, {
        method: method,
        // cache: 'force-cache',
        credentials: 'include', // Include credentials like cookies
        headers: {
          ...dheaders,
          // Cookie: `JSESSIONID=B190FEA3A425C5156BB192F2CA9AF2A7` // Add JSESSIONID cookie to headers
        },
        body: new URLSearchParams(params).toString(),
        // body: params,
      });

      // Extract and store JSESSIONID from response headers
      //  const setCookie = response.headers.get('set-cookie');
      //  if (setCookie) {
      //    const match = setCookie.match(/JSESSIONID=([^;]+)/);
      //    if (match) {
      //      jsessionId = match[1];
      //    }
      //  }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('DATA', data);

      if (onSuccessCallBack) {
        onSuccessCallBack(data); // Call the success callback with the response data
      }
      return data;
    } catch (error) {
      console.error('Service call failed:', error);
      if (onFailureCallBack) {
        console.log('onFailureCallBack');
        onFailureCallBack(error); // Call the failure callback with the error
      }
      // throw error; // Rethrow the error for further handling
    }
  };

  return { initSDK, loginService, invokeOperation };
};

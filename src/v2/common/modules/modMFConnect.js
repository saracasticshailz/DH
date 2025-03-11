import GlobalObj from './appGlobal';
// import modDeviceInfoUtil from './modDeviceInfoUtil';
import { Invoker } from './modServiceInvoker';

class MFConnector {
  constructor() {
    this.mfInstance = null;
    this.networkObject = null;
    this.isConnected = false;
    this.InitTimeOutVal = 10;
    this.isInitTimedOut = false;

    this.mfConfig = {
      // appKey: "ibmibdev2int2",
      // appSecret: "ibmibdev2int2",
      // serviceURL:
      //   "https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig",
      // appKey: "adcbmib-performance-uat3int4",
      // appSecret: "re275194543ea21494af2ca990887v43",
      // serviceURL:
      //   "https://uat3auth.mobileapps.adcb.com:8474/authService/100000002/appconfig",
      // openshift prod
      // appKey: "prod-int4-mibv9",
      // appSecret: "54tr60d542e13c5rf05t2ba22ce1r4r7",
      // serviceURL:
      //   "https://onlineauthq.adcb.com/authService/100000002/appconfig",
      // AWS
      // appKey: "mib-prodc-int1",
      // appSecret: "f4d9c24100fad86c4f5a82595e4ae648",
      // serviceURL:
      //   "https://onlineauthc.adcb.com/authService/100000002/appconfig",
      // env: "A",
      // appKey: "mib-dev2-in5",
      // appSecret: "mib-dev2-in5",
      // serviceURL:
      //   "https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig",
      // appKey: "mib-pentest-uat2int4",
      // appSecret: "ec8c838b7d796a81aa95ed9f6ffbbb38",
      // serviceURL:
      //   "https://uat2auth.mobileapps.adcb.com:8466/authService/100000002/appconfig",
      // appKey: 'adcbmib-uat1int4',
      // appSecret: 'tr4f4f4c50315433c73f6f67e71d0tre',
      // serviceURL:
      //   'https://uat1auth.mobileapps.adcb.com:8457/authService/100000002/appconfig',
      appKey: 'adcbdhp-dev2int1',
      appSecret: 'adcbdhp-dev2int1',
      serviceURL: 'https://dev2auth.mobileapps.adcb.com:8465/authService/100000002/appconfig',
    };
    console.log('mfconfig :' + JSON.stringify(this.mfConfig));
  }

  /**
   * Connect to MobileFabric and initialize the SDK.
   */
  connectFabric() {
    const { initSDK } = Invoker();
    this.isInitTimedOut = false;

    if (!this.isConnected) {
      this.isInitTimedOut = false;
      // console.log('iGenericErrMsg');
      // Handle error with a modal or similar here
    }

    initSDK({
      mfconnect: this.mfConfig,
      onSuccessCallBack: (response) => {
        console.log('New SDK initialized successfully');
        this.successCallback(response);
      },
      onFailureCallBack: (error) => {
        console.error('SDK initialization failed:', error);
      },
    });
  }

  successCallback(res) {
    try {
      if (!this.isInitTimedOut) {
        this.isConnected = true;
        if (this.networkObject !== null) {
          this.invokeOperation(this.networkObject);
        }
      }
    } catch (ex) {
      console.error('Success callback error:', ex);
    }
  }

  errorCallback(res) {
    try {
      if (!this.isInitTimedOut) {
        this.isConnected = false;
        console.log('iGenericErrMsg', 'errorCallback');
      }
    } catch (ex) {
      console.error('Error callback error:', ex);
    }
  }

  setNetworkObj(pendingServiceObj) {
    this.networkObject = pendingServiceObj;
  }

  invokeOperation(networkObj) {
    if (this.isConnected) {
      const headers = {};
      let srvTimeOutVal = GlobalObj.Vars.SERVICE_CALL_TIME_OUT;
      const { invokeOperation } = Invoker();

      if (GlobalObj.Constants.SERVICE_CALLOUT_QUICK_SERVICEID[networkObj.getOperationName()] != null) {
        srvTimeOutVal = GlobalObj.Constants.SERVICE_CALLOUT_QUICK_SERVICEID[networkObj.getOperationName()];
      }

      let resrcTimeOutVal = GlobalObj.Constants.RESOURCE_DOWNLOAD_TIME_OUT;
      // if (modDeviceInfoUtil.isAndroidDevice()) {
      //   resrcTimeOutVal *= 1000;
      //   srvTimeOutVal *= 1000;
      // }

      const options = {
        httpRequestOptions: {
          timeoutIntervalForRequest: srvTimeOutVal,
          timeoutIntervalForResource: resrcTimeOutVal,
        },
      };

      invokeOperation(
        networkObj.getOperationName(),
        headers,
        networkObj.params,
        function (response) {
          // console.log("in success callback");
          networkObj.callFnback(400, response);
        },
        (error) => {
          console.log(error);
          networkObj.callFnback(400, error);
        }
      );
    } else {
      this.setNetworkObj(networkObj);
      this.connectFabric();
    }
  }

  operationSuccess(networkObj, res) {
    networkObj.callFnback(400, res);
  }

  operationFailure(networkObj, res) {
    networkObj.callFnback(400, res);
  }
}

export default MFConnector;

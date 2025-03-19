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
      appKey: 'adcbdhp-dev2int2',
      appSecret: 'adcbdhp-dev2int2',
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

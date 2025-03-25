import MFConnector from './modMFConnect';
import GlobalObj from './appGlobal';
import CryptoObj from './modEncryption';
import modDateTimeUtil from './modDateTimeUtil';
import { print } from '../../common/utils/Utils'; //common/utils/Utils
import { getPlatform } from '../global';
export const mfconnector = new MFConnector();

const modNetwork = (operatorId, params, mNetworkCallback, type, divId, tag, authStep) => {
  const platform = getPlatform();
  print(`calling ${operatorId}  from ${platform}`);
  // debugger;
  //params.clientTime = '' + modDateTimeUtil.getCurrentTime();
  // params.b = '';

  // print('params', params);
  console.log('modNetwork params', params);

  const authKey = CryptoObj.generateAuthKey(operatorId, authStep);
  const encryptedData = CryptoObj.EncryptTxtJS(JSON.stringify(params), authKey);
   console.log('modNetwork encryptedData', encryptedData);

  const inputParamObj = {
    data: encryptedData,
  };

  if (operatorId === GlobalObj.Constants.OPERIDS.OPER_INQ_HANDSHAKE) {
    inputParamObj.appVer = '16.5.0';
  }

  // console.log(inputParamObj);

  const networkObj = {
    getServiceName: () => GlobalObj.Constants.CONSTANT_APP_ID,
    getOperationName: () => operatorId,
    params: inputParamObj,
    callFnback: (status, response) => {
      try {
        console.log('MOD NETWORK response ', response);
        const parsedResponse = response;
        const responseData = parsedResponse.results[0].data;
         console.log('modNetwork responseData', responseData);

        const actualResponse = CryptoObj.DecryptTxtJS(responseData, authKey);
         console.log('modNetwork actualResponse', actualResponse);
        // This decrytption not workin
        const res = JSON.parse(actualResponse);
        // console.log(res.oprstatus);
        if (res?.oprstatus !== 0) {
          //
          //&& res?.returnCode == '1'
          console.log('ERROR IN INVOCATION', operatorId, error, res);

          //error

          // let errorMsg = "";
          // try {
          //   errorMsg = JSON.parse(res.errmsg);
          // } catch (error) {
          // errorMsg = res.errmsg;
          // }
        } else {
          mNetworkCallback(JSON.parse(actualResponse), operatorId, inputParamObj);
        }
      } catch (error) {
        console.log('modNetwork  error -->' + error);
      }
    },
  };

  mfconnector.setNetworkObj(networkObj);
  mfconnector.invokeOperation(networkObj);
};

export default modNetwork;

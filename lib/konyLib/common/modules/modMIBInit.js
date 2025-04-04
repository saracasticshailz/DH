import GlobalObj from './appGlobal';
import appUtils from './appUtils';

import modNetwork, { mfconnector } from './modNetwork';

const modMIBInit = {
  regHandShakeServiceCall: function (handShakeDataCallback) {
    GlobalObj.Vars.isHandShakeSuccess = false;

    const inputParamObj = {
      b: appUtils.getPublicVal().toString(),
    };
    // Initiate the connection to the MobileFabric server
    mfconnector.isConnected = false;

    modNetwork(
      GlobalObj.Constants.OPERIDS.OPER_INQ_HANDSHAKE,
      inputParamObj,
      handShakeDataCallback,
      '',
      '',
      '',
      GlobalObj.Constants.AUTH_STEP.PRE_AUTH
    );
  },
};

export default modMIBInit;

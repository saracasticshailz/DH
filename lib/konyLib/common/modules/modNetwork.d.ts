declare module './modNetwork.js' {
  interface ModNetworkParams {
    clientTime?: string;
    [key: string]: any;
  }

  interface InputParamObj {
    data: string;
    appVer?: string;
  }

  interface NetworkObj {
    getServiceName: () => string;
    getOperationName: () => string;
    params: InputParamObj;
    callFnback: (status: any, response: any) => void;
  }

  type ModNetworkCallback = (response: any, operatorId: string, inputParamObj: InputParamObj) => void;

  function modNetwork(
    operatorId: string,
    params: ModNetworkParams,
    mNetworkCallback: ModNetworkCallback,
    type: string,
    divId: string,
    tag: string,
    authStep: string
  ): void;

  export { ModNetworkParams, InputParamObj, NetworkObj, ModNetworkCallback, modNetwork };
}

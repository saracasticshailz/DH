declare module './modServiceInvoker' {
  export interface MFConnect {
    serviceURL: string;
    appKey: string;
    appSecret: string;
  }

  export interface LoginResponseData {
    claims_token: {
      value: string;
    };
  }

  export interface AppConfigResponseData {
    integsvc: {
      IBMIB: string;
      DreamHomePortal: string;
    };
  }

  export interface ServiceParams {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
    onSuccess?: (data: any) => void;
    onFailure?: (error: Error) => void;
  }

  export interface InitSDKParams {
    mfconnect: MFConnect;
    onSuccessCallBack: (data: any) => void;
    onFailureCallBack: (error: Error) => void;
  }

  export function Invoker(): {
    initSDK: (params: InitSDKParams) => Promise<void>;
    loginService: (responseData: any, onSuccessCallBack: (data: any) => void) => Promise<void>;
    invokeOperation: (
      operationName: string,
      headers: Record<string, string>,
      params: Record<string, any>,
      onSuccessCallBack?: (data: any) => void,
      onFailureCallBack?: (error: Error) => void
    ) => Promise<any>;
  };
  export function Invoker(): {
    invokeOperation: (
      operationName: string,
      headers: any,
      params: any,
      successCallback: (response: any) => void,
      errorCallback: (error: any) => void
    ) => Promise<void>;
  };
}

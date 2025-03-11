// src/v2/common/hooks/useHandShake.d.ts
declare module './v2/common/hooks/useHandShake.js' {
  export interface InitSDKParams {
    mfconnect: {
      serviceURL: string;
      appKey: string;
      appSecret: string;
    };
    onSuccessCallBack: (data: any) => void;
    onFailureCallBack: (error: Error) => void;
  }

  export interface UseHandShakeReturn {
    initSDK: (params: InitSDKParams) => Promise<void>;
    loginService: (responseData: any, onSuccessCallBack: (data: any) => void) => Promise<void>;
    invokeOperation: (
      operationName: string,
      headers: Record<string, string>,
      params: Record<string, any>,
      onSuccessCallBack?: (data: any) => void,
      onFailureCallBack?: (error: Error) => void
    ) => Promise<any>;
  }

  export default function useHandShake(): UseHandShakeReturn;
}

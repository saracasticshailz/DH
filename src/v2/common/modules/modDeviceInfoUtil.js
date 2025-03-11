import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

const modDeviceInfoUtil = {
  getDeviceID() {
    let deviceID = null;

    if (Platform.OS === 'android') {
      const deviceVersion = parseInt(DeviceInfo.getSystemVersion(), 10);

      if (deviceVersion >= 6) {
        deviceID = DeviceInfo.getUniqueIdSync();
        if (!deviceID) {
          const androidId = DeviceInfo.getAndroidIdSync();

          if (androidId) {
            deviceID = androidId;
          }
        }
      } else {
        deviceID = DeviceInfo.getAndroidIdSync();
      }
    } else {
      deviceID = DeviceInfo.getUniqueIdSync();
    }

    // return "f588f5c5079ff48d";
    // return "cbe8f32ddce495bf";
    console.log(deviceID);
    return deviceID;
  },

  getDeviceOS() {
    return Platform.OS.toUpperCase(); // Returns 'ANDROID' or 'IOS'
  },

  async getDeviceVersion() {
    return DeviceInfo.getSystemVersion();
  },

  async getDeviceModel() {
    return DeviceInfo.getModel();
  },

  async getDeviceIMEI() {
    return await this.getDeviceID(); // Simulated IMEI by returning device unique ID
  },

  isAndroidDevice() {
    return Platform.OS === 'android';
  },

  isiOSDevice() {
    return Platform.OS === 'ios';
  },

  getMobileDeviceId() {},
};

export default modDeviceInfoUtil;

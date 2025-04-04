export const print = function (message: string): void {
  console.log('from common : ' + message);
};

export const message = function (message: string): string {
  return `${message} : Hello from common `;
};

export const getPlatform = function () {
  if (navigator && typeof navigator !== undefined && navigator.product == 'ReactNative') {
    const { Platform } = require('react-native');
    return Platform.OS;
  }
  return 'web';
};

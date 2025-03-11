// public/kony-sdk-utils.js

// Define the missing stripTrailingCharacter function
window.stripTrailingCharacter = function (str, char) {
  if (str && str.length > 0 && str.charAt(str.length - 1) === char) {
    return str.substr(0, str.length - 1);
  }
  return str;
};

// Add any other utility functions that might be missing
window.konyLogger = window.konyLogger || {
  trace: function () {
    console.log.apply(console, arguments);
  },
  debug: function () {
    console.debug.apply(console, arguments);
  },
  info: function () {
    console.info.apply(console, arguments);
  },
  warn: function () {
    console.warn.apply(console, arguments);
  },
  error: function () {
    console.error.apply(console, arguments);
  },
};

// Initialize any other objects that might be needed
window.kony = window.kony || {};
window.kony.sdk = window.kony.sdk || {};
window.kony.sdk.util = window.kony.sdk.util || {};

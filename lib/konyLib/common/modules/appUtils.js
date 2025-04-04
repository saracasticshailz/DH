/* eslint-disable */
import sjcl from '../jslibs/sjcl';
import GlobalObj from './appGlobal';
import BigInteger from '../jslibs/libSrpJsbn';
import md5 from 'md5';
// import { I18nManager } from "react-native";

const appUtils = {
  propertyVals: [],
  errMsgs: [],
  setProperty: function (mProperty) {
    this.propertyVals = mProperty;
  },
  getPropertyByKey: function (key) {
    let jsnObject = {};

    if (this.propertyVals && this.propertyVals.length > 0) {
      const jsnObj = this.propertyVals.find((obj) => obj.hasOwnProperty(key) && obj[key]);

      if (jsnObj) {
        try {
          // Attempt to parse the value if it's a valid JSON string
          jsnObject = this.isJson(jsnObj[key]) ? JSON.parse(jsnObj[key]) : jsnObj[key];
        } catch (error) {
          console.error('Error parsing JSON:', error);
          jsnObject = jsnObj[key]; // Return raw value if parsing fails
        }
      }
    }

    return jsnObject;
  },
  getRandomNum: function () {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(Math.random())).toUpperCase();
  },
  generateSHA512CryptoKey: function (value) {
    var key = '';
    // key = ('' + kony.crypto.createHash('sha512', value)).toUpperCase();
    key = sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(value)).toUpperCase();
    return key;
  },
  generateMD5Hash: function (value) {
    return md5(value).toUpperCase();
    // var key = '';
    // key = ('' + KonySdk.crypto.createHash('md5', value)).toUpperCase();
    // return createHash('md5').update(value).digest('hex').toUpperCase();
    // return key;
  },
  isJson: function (str) {
    if (typeof str === 'object' && str !== null) {
      return true;
    }

    if (typeof str !== 'string') {
      return false;
    }
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  getPublicVal: function () {
    var retRegVal;
    GlobalObj.Vars.regRand = new BigInteger(this.getRandomNum());
    if (GlobalObj.Vars.regRand.compareTo(GlobalObj.Constants.SRP_N_VAL) >= 0) {
      GlobalObj.Vars.regRand = GlobalObj.Vars.regRand.mod(
        GlobalObj.Constants.SRP_N_VAL.subtract(GlobalObj.Constants.SRP_ONE_VAL)
      );
    }
    if (GlobalObj.Vars.regRand.compareTo(GlobalObj.Constants.SRP_TWO_VAL) < 0) {
      GlobalObj.Vars.regRand = GlobalObj.Constants.SRP_TWO_VAL;
    }
    GlobalObj.Vars.rVal = this.generateSHA512CryptoKey('' + GlobalObj.Vars.regRand);
    GlobalObj.Vars.rVal = new BigInteger(GlobalObj.Vars.rVal, 16);
    retRegVal = GlobalObj.Constants.REG_G_VAL.modPow(GlobalObj.Vars.rVal, GlobalObj.Constants.REG_P_VAL);
    return retRegVal;
  },
  setServerErrorMessages: function (mErrorMessages) {
    this.errMsgs = mErrorMessages;
  },
  isArabic: function () {
    return false;
  },
  getServerErrorMessages: function (key) {
    var jsnObject = {};
    if (this.errMsgs != null && this.errMsgs.length > 0) {
      for (var i = 0; i < this.errMsgs.length; i++) {
        var jsnObj = this.errMsgs[i];
        if (jsnObj.hasOwnProperty(key) && jsnObj[key] != null) {
          if (this.isJson(jsnObj[key])) {
            jsnObject = JSON.parse(jsnObj[key]);
          } else {
            jsnObject = jsnObj[key];
          }
          break;
        }
      }
    }

    // return I18nManager.isRTL
    //   ? JSON.parse(jsnObject.errMsg_AR)
    //   : JSON.parse(jsnObject.errMsg_EN);

    return JSON.parse(jsnObject.errMsg_EN);
  },
};

export default appUtils;

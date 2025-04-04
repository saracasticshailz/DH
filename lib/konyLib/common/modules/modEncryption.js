import AesUtil from "../jslibs/libAesUtil";
import GlobalObj from "./appGlobal";
import appUtils from "./appUtils";

const CryptoObj = {
  EncryptTxtJS: function (plainText, key) {
    if (GlobalObj.Constants.IS_ENCRYPT_REQ) {
      // console.log("modEncryption",AesUtil)
      var aesUtil = new AesUtil(
        GlobalObj.Constants.ENCRYPT_KEY_SIZE,
        GlobalObj.Constants.ENCRYPT_ITER_COUNT
      );
      var slt = GlobalObj.Vars.enc_salt;
      if (slt == null) {
        slt = "";
      }
      var slLen = slt.length;
      var encrypt = "";
      if (slLen % 2 != 0) {
        slt = "0" + slt;
      }
      encrypt = aesUtil.encrypt(
        slt,
        GlobalObj.Constants.ENCRYPT_IV,
        key,
        plainText
      );
      return encrypt;
    } else {
      return plainText;
    }
  },
  DecryptTxtJS: function (encryptedText, key) {
    if (GlobalObj.Constants.IS_ENCRYPT_REQ) {
      try {
        var aesUtil = new AesUtil(
          GlobalObj.Constants.ENCRYPT_KEY_SIZE,
          GlobalObj.Constants.ENCRYPT_ITER_COUNT
        );
        var slt = GlobalObj.Vars.enc_salt;
        if (slt == null) {
          slt = "";
        }
        var slLen = slt.length;
        var decrypt = "";
        if (slLen % 2 != 0) {
          slt = "0" + slt;
        }
        decrypt = aesUtil.decrypt(
          slt,
          GlobalObj.Constants.ENCRYPT_IV,
          key,
          encryptedText
        );
        return decrypt;
      } catch (ex) {
        console.log(ex);
        return null;
      }
    } else {
      return encryptedText;
    }
  },
  generateAuthKey: function (serviceID, authStep) {
    var hashKey = "";
    var hashStr = "";
    var fixedIV = "F27D5C9927726BCEFE7510B1BDD3D126";
    if (authStep == GlobalObj.Constants.AUTH_STEP.PRE_AUTH) {
      hashStr = GlobalObj.Constants.CONSTANT_APP_ID.toUpperCase() + serviceID;
      GlobalObj.Constants.ENCRYPT_IV = appUtils.generateSHA512CryptoKey(
        fixedIV + serviceID
      );
    } else if (authStep == GlobalObj.Constants.AUTH_STEP.REGISTER) {
      hashStr = "" + GlobalObj.Vars.enc_key;
      GlobalObj.Vars.enc_salt = appUtils.generateSHA512CryptoKey(
        GlobalObj.Vars.enc_key + serviceID
      );

      GlobalObj.Constants.ENCRYPT_IV = appUtils.generateSHA512CryptoKey(
        fixedIV + serviceID + GlobalObj.Vars.enc_key
      );
      return hashStr;
    } else if (authStep == GlobalObj.Constants.AUTH_STEP.POST_AUTH) {
      hashStr = appUtils.generateSHA512CryptoKey(
        GlobalObj.Vars.enc_key + serviceID
      );
      GlobalObj.Constants.ENCRYPT_IV = appUtils.generateSHA512CryptoKey(
        fixedIV + serviceID + GlobalObj.Vars.enc_key
      );
      return hashStr;
    } else if (authStep == GlobalObj.Constants.AUTH_STEP.PRE_AUTH_SESSION_EXT) {
      hashStr = "" + GlobalObj.Vars.handshakeKey;
      GlobalObj.Vars.enc_salt = appUtils.generateSHA512CryptoKey(
        GlobalObj.Vars.handshakeKey + serviceID
      );
      GlobalObj.Constants.ENCRYPT_IV = appUtils.generateSHA512CryptoKey(
        fixedIV + serviceID + GlobalObj.Vars.handshakeKey
      );
      return hashStr;
    } else if (authStep == GlobalObj.Constants.AUTH_STEP.PRE_EDW) {
      hashStr = "" + GlobalObj.Vars.handshakeKey;
      GlobalObj.Vars.enc_salt = appUtils.generateSHA512CryptoKey(
        GlobalObj.Vars.handshakeKey + serviceID
      );
      GlobalObj.Constants.ENCRYPT_IV = appUtils.generateSHA512CryptoKey(
        fixedIV + serviceID + GlobalObj.Vars.handshakeKey
      );
      return hashStr;
    }
    hashKey = appUtils.generateSHA512CryptoKey(hashStr);
    return hashKey;
  },
};

export default CryptoObj;

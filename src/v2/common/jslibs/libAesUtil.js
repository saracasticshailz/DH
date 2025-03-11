import sjcl from './sjcl';

var AesUtil = function (keySize, iterationCount) {
  this.keySize = keySize;
  this.iterationCount = iterationCount; // 10,000
};
AesUtil.prototype.hmacSHA512 = function (key) {
  var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512);
  this.encrypt = function () {
    return hasher.encrypt.apply(hasher, arguments);
  };
};
/**
 * @function generateKey
 *  used to generate key for enc/dec
 * @param salt
 * @param passPhrase
 */
AesUtil.prototype.generateKey = function (salt, passPhrase) {
  //   var passwordWithSalt = sjcl.misc.pbkdf2(passPhrase,sjcl.codec.hex.toBits(salt),{ keySize: this.keySize, iterations: this.iterationCount },hmacSHA512);
  var passwordWithSalt = sjcl.misc.pbkdf2(
    sjcl.codec.utf8String.toBits(passPhrase),
    sjcl.codec.hex.toBits(salt),
    this.iterationCount,
    this.keySize,
    this.hmacSHA512,
  );
  var key = new sjcl.cipher.aes(passwordWithSalt);
  return key;
};
/**
 * @function encrypt
 *
 * @param salt
 * @param iv
 * @param passPhrase
 * @param plainText
 */
AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
  var key = this.generateKey(salt, passPhrase);
  var encrypted = sjcl.mode.gcm.encrypt(
    key,
    sjcl.codec.utf8String.toBits(plainText),
    sjcl.codec.utf8String.toBits(iv),
    null,
    128,
  ); // hex
  return sjcl.codec.base64.fromBits(encrypted);
};
/**
 * @function decrypt
 *
 * @param salt
 * @param iv
 * @param passPhrase
 * @param cipherText
 */
AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
  var key = this.generateKey(salt, passPhrase);
  var decrypted = sjcl.mode.gcm.decrypt(
    key,
    sjcl.codec.base64.toBits(cipherText),
    sjcl.codec.utf8String.toBits(iv),
    null,
    128,
  ); //hex
  return sjcl.codec.utf8String.fromBits(decrypted);
};

export default AesUtil;

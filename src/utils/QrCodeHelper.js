const CryptoJS = require('crypto-js');

export const decryptQRcode = (qrcodeValue, secretKey) => {
  const secret = CryptoJS.enc.Utf8.parse(secretKey);
  // base64 to UTF-8
  const utf8String = CryptoJS.enc.Base64.parse(qrcodeValue).toString(CryptoJS.enc.Utf8);
  let result = {};

  try {
    result = JSON.parse(utf8String);
  } catch (e) {
    return null;
  }

  const { iv = null, data = null } = result;
  if (!iv || !data) {
    return null;
  }
  let decryptString = null;

  try {
    const encryptedCP = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(data),
      formatter: CryptoJS.format.OpenSSL,
    });
    decryptString = CryptoJS.AES.decrypt(encryptedCP, secret, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
    });
  } catch (e) {
    return null;
  }

  return decryptString.toString(CryptoJS.enc.Utf8);
};

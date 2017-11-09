let crypto = require('crypto');
let config = require('config');
let encryption = config.get('CreditCard.encryption');

module.exports = (name, number, expiration, ccv) => {
  let obj = {
    "cardholderName" : name,
    "number" : number,
    "expirationDate" : expiration,
    "cvv" : ccv
  }
  return new Promise((resolve,reject) => {
    let text = JSON.stringify(obj);
    let cipher = crypto.createCipher(encryption.algorithm,encryption.password)
    let crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    resolve(crypted);
  })
}

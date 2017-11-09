var redis = require('../redis/connect.js');
let Validation = require('../request/validation.js');
let decrypt = require('../request/decryption.js');
let errorOutputGenerator = require('./get-payment-error.js');
let successOutputGenerator = require('./get-payment-success.js');
let Payment = require('../db/payment/model.js');

module.exports = (obj, encrypted) => {
  return new Promise((resolve, reject) => {
    if (!Validation.check(obj)) {
      let result = errorOutputGenerator( "INVALID_PATAMETER");
      result.structure = JSON.stringify(result.structure);
      reject(result);
    }
    if (encrypted) {
      obj = decrypt(obj);
    }
    redis.getAsync(obj.orderinfo.referenceCode).then((res) => {
      if (res !== null) {
        res = JSON.parse(res);
        if (res.hasOwnProperty('firstName') && res.firstName === obj.orderinfo.firstName &&  res.hasOwnProperty('lastName') && res.lastName === obj.orderinfo.lastName &&  res.hasOwnProperty('phoneNumber') && res.phoneNumber === obj.orderinfo.phoneNumber) {
          return res;
        } else {
          throw 'RECORD_NOT_FOUND';
        }
      } else {
        let query = {
          firstName: obj.orderinfo.firstName,
          lastName: obj.orderinfo.lastName,
          phoneNumber: obj.orderinfo.phoneNumber,
          referenceCode: obj.orderinfo.referenceCode,
        };
        let _payment =  new Payment();
        return _payment.find(query);
      }
    }).then((doc) => {
      redis.set(doc.referenceCode, JSON.stringify(doc), redis.print);
      return successOutputGenerator(doc);
    }, (err) => {
      throw err;
    }).catch((err) => {
      return errorOutputGenerator(err);
    }).then((res) => {
      if (res.status === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    })
  })
}

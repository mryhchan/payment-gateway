var paypal = require('../connect.js');
let errorOutputGenerator = require('../../process/make-payment-error.js');
var _ = require('lodash');
module.exports = (obj) => {
  return new Promise((resolve, reject) => {
    cardType={
      "Visa" : "visa",
      "Discover" : "discover",
      "American Express" : "amex",
      "JCB" : "jcb",
      "Maestro" : "maestro",
      "MasterCard" : "mastercard",
      "China UnionPay" : "cup",
    }
    if(obj.type === "Maestro"){
      _.unset(obj,'cvv2');
    }
    obj.type =  cardType[obj.type];
    paypal.creditCard.create(obj,(error, creditcard) => {
      if (error) {
        reject(error);
      } else {
        resolve(creditcard);
      }
    });
  })
}

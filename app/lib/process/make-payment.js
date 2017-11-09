let decrypt = require('../request/decryption.js');
let Validation = require('../request/validation.js');
let errorOutputGenerator = require('./make-payment-error.js');
let successOutputGenerator = require('./make-payment-success.js');

let createCustomer = require('../braintree/customer/create.js');
let deleteCustomer = require('../braintree/customer/delete.js');
let _ = require('lodash');
let createCard = require('../braintree/creditcard/create.js');

let braintreeCreateTransaction = require('../braintree/transaction/create.js');
let paypalCreateTransaction= require('../paypal/transaction/create.js');

let Payment = require('../db/payment/model.js');
let config = require('config');
var redis = require('../redis/connect.js');


let braintreeMerchantAccounts =   config.get('Braintree.merchantAccounts');

module.exports = (obj, encrypted) => {
  return new Promise((resolve, reject) => {
    if (!Validation.payment(obj)) {
      let result = errorOutputGenerator({
        err: "INVALID_PATAMETER"
      });
      result.structure = JSON.stringify(result.structure);
      reject(result);

    }
    if (encrypted) {
      obj = decrypt(obj);
    }
    let customerInfo = {
      firstName: obj.orderinfo.firstName,
      lastName: obj.orderinfo.lastName,
      phone: obj.orderinfo.phoneNumber,
    };
    let cardInfo = obj.paymentinfo;
    let orderInfo = obj.orderinfo;
    let gatewayRespnse = {} ;
    let gatewayType = 'Braintree';
    cardInfo.number = cardInfo.number.replace(/\s/g,'')
    let promise = createCustomer(customerInfo);
    promise.then((result) => {
      customerInfo.customerId = result.customer.id;
      cardInfo.customerId = result.customer.id;
      if(cardInfo.cvv === null || cardInfo.cvv.length === 0){
        err = {
          err: "CVV_IS_REQUIRED"
        }
        throw err;
      }
      return createCard(cardInfo);
    }, (err) => {
      throw err;
    }).then((response) => {
      if(parseInt(response.creditCard.expirationYear)<(new Date()).getFullYear()){
        err = {
          err: "CREDIT_CARD_IS_EXPRIED"
        }
        throw err;
      }
      let usePayPal = ['USD', 'EUR', 'AUD', 'American Express'];

      if (_.indexOf(usePayPal, response.creditCard.cardType) >= 0 && obj.orderinfo.currency !== 'USD') {
        err = {
          err: "CREDIT_CARD_AMERICAN_EXPRESS_IS_ONLY_FOR_USD"
        }
        throw err;
      }
      if (usePayPal.indexOf(orderInfo.currency) >= 0) {
        gatewayType = 'PayPal'
        var card_data = {
        "type": response.creditCard.cardType,
        "number": cardInfo.number,
        "expire_month": response.creditCard.expirationMonth,
        "expire_year": response.creditCard.expirationYear,
        "cvv2": cardInfo.cvv,
        "first_name": "Braintree",
        "last_name": cardInfo.cardholderName,
        "external_customer_id": cardInfo.customerId
        };
        let transactionInfo = {
          amount : obj.orderinfo.price,
          currency : obj.orderinfo.currency,
        };
        return paypalCreateTransaction(card_data, transactionInfo);
      } else {
        let transactionInfo = {
          amount : obj.orderinfo.price,
          merchantAccountId: braintreeMerchantAccounts[obj.orderinfo.currency],
          customer :  _.clone(customerInfo),
          creditCard : _.clone(obj.paymentinfo),
          customerId : customerInfo.customerId
        };
        transactionInfo.customer.phone =   transactionInfo.customer.phoneNumber;
        _.unset(transactionInfo.customer,'phoneNumber');
        _.unset(transactionInfo.customer,'customerId');
        _.unset(transactionInfo.creditCard,'customerId');

        return braintreeCreateTransaction(transactionInfo);
      }
    }, (err) => {
      throw err;
    }).then((result) => {
      let _payment = new Payment(obj,result,gatewayType);
      return _payment.save();
    }, (err) => {
      throw err;
    }).then((doc)=>{
      redis.set(doc.referenceCode, JSON.stringify(doc), redis.print);
      return successOutputGenerator(doc);
    }, (err) => {
      throw err;
    }).catch((err) => {
      //prepare error and return;
      if (customerInfo.hasOwnProperty('customerId')) {
        return deleteCustomer(customerInfo.customerId, err);
      }
      return errorOutputGenerator(err);
    }).then((res) => {
      if (res.status === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    })
  });
}

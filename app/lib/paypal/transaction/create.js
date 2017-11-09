var paypal = require('../connect.js');
var createCreditCard = require('../creditcard/create.js')


createTransaction = (create_payment_json) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        reject(error);
      } else {
        resolve(payment);
      }
    });
  })
}


module.exports = (creditCardInfo, transactionInfo) => {
  return new Promise((resolve, reject) => {
    var create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "credit_card"
      },
      "transactions": [{
        "amount": {
          "currency": transactionInfo.currency,
          "total": transactionInfo.amount
        },
        "description": "Payment by vaulted credit card."
      }]
    };
    let promise = createCreditCard(creditCardInfo);

    promise.then((creditCard) => {
      create_payment_json.payer.funding_instruments = [];
      create_payment_json.payer.funding_instruments.push({
        "credit_card_token": {
          "credit_card_id": creditCard.id,
          "external_customer_id": creditCard.external_customer_id
        }
      });
      return createTransaction(create_payment_json)
    }, (error) => {
      throw error;
    }).then((paymentresponse) =>{
      resolve(paymentresponse);
    },(error) => {
      throw error;
    }).catch((error) => {
      reject(error);
    });


  })
}

let cardinfoDecryptor = require('../db/cardinfo-decryption.js');
module.exports = (doc) => {
  let output = {
    status: 200,
    firstName: doc.firstName,
    lastName: doc.lastName,
    phoneNumber: doc.phoneNumber,
    referenceCode: doc.referenceCode,
    currency: doc.payment.orderinfo.currency,
  };
  switch (doc.gatewayType) {
    case 'Braintree':
      output.number = doc.gatewayRespnse.transaction.creditCard.maskedNumber
      output.expirationDate =
        doc.gatewayRespnse.transaction.creditCard.expirationDate;
      output.cardImage = doc.gatewayRespnse.transaction.creditCard.imageUrl
      output.cardholderName = doc.gatewayRespnse.transaction.creditCard.cardholderName
      output.price = doc.gatewayRespnse.transaction.amount;
      output.transactionStatus = doc.gatewayRespnse.transaction.status;
      break;
    case 'PayPal':
      let cardInfo = cardinfoDecryptor(doc.payment.paymentinfo.creditCard);
      output.price = doc.gatewayRespnse.transactions[0].amount.total
      output.transactionStatus = doc.gatewayRespnse.state
      output.cardholderName = cardInfo.cardholderName
      output.number = '******'+cardInfo.number.substr(cardInfo.number.length -4);
      output.number = cardInfo.number.substr(0,cardInfo.number.length - output.number.length)+output.number;
      break;
  }
  return output;
}

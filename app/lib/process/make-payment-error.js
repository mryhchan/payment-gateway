module.exports = (err) => {
  let output = {
    status: 500,
    messages: []
  };
  if (err.hasOwnProperty('success') && !err.success) {
    let tmpArray = err.message.split("\n")
    for (i in tmpArray) {
      output.messages[i] = {
        message: tmpArray[i]
      };
      switch (tmpArray[i]) {
        case 'Credit card number must be 12-19 digits.':
        case 'Credit card number is not an accepted test number.':
        case 'Credit card number is invalid.':
          output.messages[i].err = "INVALID_CREDIT_CARD_NUMBER";
          break;
        case 'Credit card number is required.':
        case 'Credit card must include number, payment_method_nonce, or venmo_sdk_payment_method_code.':
          output.messages[i].err = "CREDIT_CARD_NUMBER_IS_REQUIRED";
          break;
        case 'Expiration year is invalid. It must be between 1975 and 2201.':
          output.messages[i].err = "INVALID_EXPIRATION_YEAR"
          break;
        case 'Expiration date is invalid.':
          output.messages[i].err = "INVALID_EXPIRATION_DATE";
          break;
        case 'Expiration date is required.':
          output.messages[i].err = "EXPIRATION_DATE_IS_REQUIRED";
          break;
        case 'CVV must be 4 digits for American Express and 3 digits for other card types.':
          output.messages[i].err = "INVALID_CVV";
          break;
        case 'Do Not Honor':
          output.messages[i].message = "Credit card is rejected. Please try another card";
          output.messages[i].err = "CREDIT_CARD_IS_REJECTED";
          break;
        case 'Gateway Rejected: duplicate':
          output.messages[i].message = "Gateway rejected: same transaction created within short time";
          output.messages[i].err = "GATEWAY_REJECTED";
          break;
      }
    }

  } else if (err.hasOwnProperty('httpStatusCode') && err.httpStatusCode === 400 && err.hasOwnProperty('response') && !err.response.hasOwnProperty('details') && !Array.isArray(err.response.details)) {
    let message = {};
    if (err.response.hasOwnProperty('message')) {
      switch (err.response.message) {
        case "Credit card was refused.":
          message.message = "Credit card is rejected. Please try another card";
          message.err = 'CREDIT_CARD_IS_REJECTED';
        case 'Credit card type is not supported.':
          message.message = "This Application does not support this Credit card with this currency, please try  another credit card or use another currency to complete payment";
          message.err = 'CREDIT_CARD_TYPE_IS_NOT_SUPPORTED';
      }
    }

    output.messages.push(message);
  } else if (err.hasOwnProperty('response') && err.response.hasOwnProperty('details') && Array.isArray(err.response.details)) {
    err = err.response.details;
    for (i in err) {
      if (err[i].hasOwnProperty('issue')) {
        output.messages[i] = {
          message: err[i].issue
        };
        switch (err[i].issue) {
          case "The credit card number is not valid for the specified credit card type":
            output.messages[i].message = "Credit card number is invalid.";
            output.messages[i].err = "INVALID_CREDIT_CARD_NUMBER";
            break;
          case "One of the fields are required: start_month/start_year or issue_number":
            output.messages[i].message = "This Application does not support this Credit card with this currency, please try  another credit card or use another currency to complete payment";
            output.messages[i].err = "CREDIT_CARD_TYPE_IS_NOT_SUPPORTED";

        }
      }
    }
  } else {
    switch (err.err) {
      case "INVALID_PATAMETER":
        output.messages.push({
          err: "INVALID_PATAMETER",
          message: "Invalid parameter.",
          structure: {
            orderinfo: {
              firstName: "String",
              lastName: "String",
              phoneNumber: "String",
              currency: "String",
              price: "String"
            },
            paymentinfo: {
              cardholderName: "String",
              number: "String",
              expirationDate: "String",
              cvv: "string"
            }
          }
        });
        break;
      case "CREDIT_CARD_AMERICAN_EXPRESS_IS_ONLY_FOR_USD":
        output.messages.push({
          message: 'Credit card American Express is possible to use only for USD',
          err: err.err
        });
        break;
      case "CREDIT_CARD_IS_EXPRIED":
        output.messages.push({
          message: 'Credit card is expired',
          err: err.err
        });
        break;
      case 'CVV_IS_REQUIRED':
        output.messages.push({
          message: 'CCV is required',
          err: err.err
        });
        break;
      case "COULD_NOT_CONNECT_TO_DB":
        output.messages.push({
          message: 'Could not connect to DB',
          err: err.err
        });
        break;
      case 'CURRENCY_IS_NOT_SUPPORT':
        output.messages.push({
          message: 'Currency is not support.',
          err: err.err
        });
        break;
    }
  }
  return output;
};

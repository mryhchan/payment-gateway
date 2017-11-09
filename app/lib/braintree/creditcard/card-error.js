class CardError extends Error{
  constructor(errorCode){
      this.errorCode = errorCode;
      super(errorCodeToString(errorCode));
      Error.captureStackTrace(this, CardError)
  }
  errorCodeToString(){
    switch(this.errorCode){
      case 501:
        return 'Not a valid credit card number';
      default:
        return 'unknow error';
    }
  }
}

CardError.prototype.NOT_A_VALID_CARD_NUM = 501;
module.exports = CardError;

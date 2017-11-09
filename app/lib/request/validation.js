module.exports = {
  payment: (obj) => {
    if (!obj.hasOwnProperty('orderinfo')){
      return false;
    }else{
      let orderinfo = obj.orderinfo;
      if (!orderinfo.hasOwnProperty('firstName')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('lastName')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('phoneNumber')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('currency')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('price')){
        return false;
      }
    }
    if(!obj.hasOwnProperty('paymentinfo')){
      return false;
    }else{
      let paymentinfo = obj.paymentinfo;
      if (!paymentinfo.hasOwnProperty('cardholderName')){
        return false;
      }
      if (!paymentinfo.hasOwnProperty('number')){
        return false;
      }
      if (!paymentinfo.hasOwnProperty('expirationDate')){
        return false;
      }
      if (!paymentinfo.hasOwnProperty('cvv')){
        return false;
      }
    }
    return true;
  },
  check: (obj)=>{
    if (!obj.hasOwnProperty('orderinfo')){
      return false;
    }else{
      let orderinfo = obj.orderinfo;
      if (!orderinfo.hasOwnProperty('firstName')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('lastName')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('phoneNumber')){
        return false;
      }
      if (!orderinfo.hasOwnProperty('referenceCode')){
        return false;
      }
    }
    return true;
  }
}

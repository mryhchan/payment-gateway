let jasmine = require('jasmine-node');
let makePayment = require('../lib/process/make-payment.js');

describe("makePayment", () => {
  it("should success to payment with braintree to paypal (american express , USD 0.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "USD",
        price: "0.99"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '378282246310005',
        expirationDate: '11/2022',
        cvv: "1111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      console.log('hello',res);
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      //should not go here;

    })
  }, 30000);

  it("should success to payment with paypal (Visa , AUD 2.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Wai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "AUD",
        price: "2.99"
      },
      paymentinfo: {
        cardholderName: "Chan Wai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      console.log('hello',res);
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      //should not go here;

    })
  }, 30000);

  it("should success to payment with paypal (Mastercard , EUR 5.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Wai Lam",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "EUR",
        price: "5.99"
      },
      paymentinfo: {
        cardholderName: "Chan Wai Lam",
        number: '5555555555554444',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      console.log('hello',res);
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      //should not go here;

    })
  }, 30000);

  it("should success to payment with braintree (visa card, HKD 10.1)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      //should not go here;

    })
  });
  it("should fail to payment with braintree (send duplicated transaction in previous within shorttime)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here when sent duplicated transaction within shorttime;
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      expect(err.messages[0].err).toBe('GATEWAY_REJECTED');
      done();
    })
  });

  it("should fail to payment with braintree (payment processer reject.)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Yan",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "2000.00"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Yan",
        number: '4000111111111115',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('CREDIT_CARD_IS_REJECTED');
      done();
    })
  });

  it("should success to payment with braintree (Master card, CNY 120.1)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "CNY",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '5555555555554444',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      expect(res.status).toBe(200);
      done();
    }, (err) => {
      //should not go here;

    })
  });

  it("should fail to payment with braintree (failed(3000) with JCB Card)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Yai Yan",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "2000.00"
      },
      paymentinfo: {
        cardholderName: "Chan Yai Yan",
        number: '3566002020360505',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('CREDIT_CARD_IS_REJECTED');
      done();
    })
  });


  it("should fail at parameter validation", (done) => {
    let obj = {}
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('INVALID_PATAMETER');
      done();
    })
  });

  it("should fail at card validation - (invalid number)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: "411",
        expirationDate: "11/2022",
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('INVALID_CREDIT_CARD_NUMBER');
      done();
    })
  });
  it("should fail at card validation - (invalid number)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: "41111111111111111",
        expirationDate: "11/2022",
        cvv: "123"
      }
    }

    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('INVALID_CREDIT_CARD_NUMBER');
      done();
    })
  });

  it("should fail at card validation - (number is null)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '',
        expirationDate: "11/2022",
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('CREDIT_CARD_NUMBER_IS_REQUIRED');
      expect(err.messages.length).toBe(2);
      done();
    })
  });

  it("should fail at card validation - (invalid expiration year)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: "11/2222",
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {

      expect(err.messages[0].err).toBe('INVALID_EXPIRATION_YEAR');
      done();
    })
  });

  it("should fail at card validation - (invalid expiration month)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: "13/2022",
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {

      expect(err.messages[0].err).toBe('INVALID_EXPIRATION_DATE');
      done();
    })
  });

  it("should fail at card validation - (expirationDate is null)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: null,
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {

      expect(err.messages[0].err).toBe('EXPIRATION_DATE_IS_REQUIRED');
      done();
    })
  });

  it("should fail at card validation - (CVV is null)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: ""
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {

      expect(err.messages[0].err).toBe('CVV_IS_REQUIRED');
      done();
    })
  });

  it("should fail at card validation - (credit card expired)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: "11/2002",
        cvv: "123"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      console.log(err);
      expect(err.messages[0].err).toBe('CREDIT_CARD_IS_EXPRIED');
      done();
    })
  });

  it("should fail at card validation - (cvv is 4 digits and visa card)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: "1234"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      console.log(err);

      expect(err.messages[0].err).toBe('INVALID_CVV');
      done();
    })
  });

  it("should fail at card validation - (cvv is invalid)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '4111111111111111',
        expirationDate: '11/2022',
        cvv: "12345"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
    }, (err) => {
      console.log(err);

      expect(err.messages[0].err).toBe('INVALID_CVV');
      done();
    })
  });



  it("should fail to make payment (AMEX is possible to use only for currency USD)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "10.1"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '378282246310005',
        expirationDate: '11/2022',
        cvv: "1234"
      }
    }
    let promise = makePayment(obj);
    promise.then(() => {
      //should not go here;
      done();
    }, (err) => {
      console.log(err);
      expect(err.messages[0].err).toBe('CREDIT_CARD_AMERICAN_EXPRESS_IS_ONLY_FOR_USD');
      done();
    })
  });

  it("should fail to payment with paypal (Baribtree provied Maestro card, USD 0.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "USD",
        price: "0.99"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '6304000000000000',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      console.log(err);
      expect(err.messages[0].err).toBe('CREDIT_CARD_TYPE_IS_NOT_SUPPORTED');
      done();
    })
  });

  it("should fail to payment with paypal (Braintree provied Diners Club card, USD 0.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Tai Man",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "USD",
        price: "0.99"
      },
      paymentinfo: {
        cardholderName: "Chan Tai Man",
        number: '36259600000004',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('INVALID_CREDIT_CARD_NUMBER');
      done();
    })
  });

  it("should fail to payment with paypal (Braintree provied JCB card, USD 0.99)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Lai Sum",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "USD",
        price: "0.99"
      },
      paymentinfo: {
        cardholderName: "Chan Lai Sum",
        number: '3530111333300000',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('CREDIT_CARD_TYPE_IS_NOT_SUPPORTED');
      done();
    })
  });

  it("should fail to payment (not using the credit card provied from braintree.)", (done) => {
    let obj = {
      orderinfo: {
        firstName: "Kam Wan",
        lastName: "Chan",
        phoneNumber: "12345678",
        currency: "HKD",
        price: "30.00"
      },
      paymentinfo: {
        cardholderName: "Chan Kam Wan",
        number: '4253199694839495',
        expirationDate: '11/2022',
        cvv: "111"
      }
    }
    let promise = makePayment(obj);
    promise.then((res) => {
      //should not go here;
    }, (err) => {
      expect(err.messages[0].err).toBe('INVALID_CREDIT_CARD_NUMBER');
      done();
    })
  });
});

var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  var absolutePath = path.resolve('./key/public.pem');
  var publicKey = fs.readFileSync(absolutePath, "utf8");

  let output = {
    token: "",
    publicKey: publicKey,
    form:{
      id: "panel-title",
      str: "Payment",
      orderinfo: {
        id: "order-section-title",
        str: "Order",
        firstName: {
          id: "order-customer-firstname",
          str: "Customer First Name",
          placeholder: "Tai Man"
        },
        lastName: {
          id: "order-customer-lastname",
          str: "Customer Last Name",
          placeholder: "Chan"
        },
        phoneNumber: {
          id: "order-customer-phone-number",
          str: "Phone Number",
          placeholder: "852+12345678"
        },
        currency: {
          id: "order-currency",
          str: "Currency",
        },
        price: {
          id: "order-price",
          str: "Price",
          placeholder: "12345678"
        }
      },
      paymentinfo: {
        id: "paymentinfo-section-title",
        str: "Payment Information",
        cardholderName: {
          id: "card-holder-name",
          str: "Credit Card Holder Name",
          placeholder: "Chan Tai Man"
        },
        number: {
          id: "card-number",
          str: "Credit Card Number",
          placeholder: "4111 1111 1111 1111"
        },
        expirationDate: {
          id: "card-expiration-date",
          str: "Credit Card Expiration Date",
          placeholder: "MM/YYYY"
        },
        cvv: {
          id: "card-ccv",
          str: "Credit Card CCV",
          placeholder: "123"
        }
      },
      purchaseBtn: {
        id: "submit",
        str: "Purchase"
      }
    }
  };

  res.render('index', output);
});

module.exports = router;

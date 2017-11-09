var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var getPayment=require('../lib/process/get-payment.js')

router.get('/', (req, res, next) => {
  var absolutePath = path.resolve('./key/public.pem');
  var publicKey = fs.readFileSync(absolutePath, "utf8");
  output = {
    firstName: (req.query.hasOwnProperty('fn')) ? req.query.fn: "",
    lastName: (req.query.hasOwnProperty('ln')) ? req.query.ln: "",
    phoneNumber: (req.query.hasOwnProperty('pn')) ? req.query.pn: "",
    referenceCode: (req.query.hasOwnProperty('rc')) ? req.query.rc: "",
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
          val: "",
          placeholder: "Tai Man"
        },
        lastName: {
          id: "order-customer-lastname",
          str: "Customer Last Name",
          val: "",
          placeholder: "Chan"
        },
        phoneNumber: {
          id: "order-customer-phone-number",
          str: "Phone Number",
          val: "",
          placeholder: "852+12345678"
        },
        referenceCode: {
          id: "order-referenceCode",
          str: "Reference Code",
          val: "",
          placeholder: "41c32f1b-3c7b-4dd4-b3ff-52af779c6567",
        },
      },
      checkBtn: {
        id: "submit",
        str: "Check"
      }
    }
  }
  res.render('payment', output);
})

router.post('/check', (req, res, next) => {
  let encrypted = false;
  if(req.query.hasOwnProperty('encrypted') && req.query.encrypted === 'true'){
    encrypted = true;
  }
  let promise = getPayment(req.body,req.query);
  promise.then((result) => {
    res.status(result.status).send(result);
  }, (err) => {
    res.status(err.status).send(err);
  })
});
module.exports = router;

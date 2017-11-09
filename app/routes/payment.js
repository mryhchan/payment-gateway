var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var makePayment = require('../lib/process/make-payment.js');
router.post('/', (req, res, next) => {
  let encrypted = false;
  if(req.query.hasOwnProperty('encrypted') && req.query.encrypted === 'true'){
    encrypted = true;
  }
  let promise = makePayment(req.body,encrypted);
  promise.then((result) => {
    res.status(result.status).send(result);
  }, (err) => {
    res.status(err.status).send(err);
  })
});


module.exports = router;

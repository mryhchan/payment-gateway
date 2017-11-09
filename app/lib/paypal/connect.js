let paypal = require('paypal-rest-sdk');
let config = require('config');
let sandbox = config.get('Paypal.Config');

paypal.configure({
  'mode': sandbox.mode, //sandbox or live
  'client_id': sandbox.clientID,
  'client_secret': sandbox.clientSecret
});

module.exports = paypal;

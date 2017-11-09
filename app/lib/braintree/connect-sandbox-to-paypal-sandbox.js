let config = require('config');

var braintree = require("braintree");
let sandbox = config.get('Paypal.Config');

module.exports = braintree.connect({
  accessToken: sandbox.token
});

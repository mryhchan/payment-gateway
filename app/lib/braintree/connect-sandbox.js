let config = require('config');

var braintree = require("braintree");
let sandbox = config.get('Braintree.Sandbox');

module.exports = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: sandbox.merchantId,
  publicKey: sandbox.publicKey,
  privateKey: sandbox.privateKey
});

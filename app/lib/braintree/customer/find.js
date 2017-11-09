var braintree_sandbox = require('../connect-sandbox.js');

module.exports = (customerId) => {
  return new Promise((resolve, reject) => {
    braintree_sandbox.customer.find(customerId, function(err, customer) {
      if (err) {
        reject(err);
      } else {
        resolve(customer);
      }
    });
  })
}

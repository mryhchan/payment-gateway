var braintree_sandbox = require('../connect-sandbox.js');

module.exports = (obj) => {
  return new Promise((resolve, reject) => {
    braintree_sandbox.customer.create(obj, function(err, result) {
      if(err){
        reject(err);
      } else if(!result.success){
        reject(result);
      }else {
        resolve(result);
      }
    });
  });
}

var braintree_sandbox = require('../connect-sandbox.js');
let errorOutputGenerator = require('../../process/make-payment-error.js');

module.exports = (id, error) => {
  return new Promise((resolve, reject) => {
    braintree_sandbox.customer.delete(id, (err) => {
      if(err){
        reject(err);
      }else{
        if(error){
          resolve(errorOutputGenerator(error));
        }else{
          resolve();
        }
      }
    });
  });
}

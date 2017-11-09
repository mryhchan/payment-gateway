var braintree_sandbox = require('../connect-sandbox.js');

module.exports = (obj) => {
  return new Promise((resolve, reject) => {
    braintree_sandbox.transaction.sale(obj, function(err, result) {
      if(err){
        reject(err);
      }else{
        if(result.success){
          resolve(result);
        }else {
          reject(result);
        }
      }
    });
  })
}

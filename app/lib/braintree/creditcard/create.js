var braintree_sandbox = require('../connect-sandbox.js');

module.exports = (obj) => {
  return new Promise((resolve,reject) => {
    braintree_sandbox.creditCard.create(obj, function (err, response) {
      if(err){
        reject(err);
      }else if(!response.success){
        reject(response);
      }else{
        resolve(response);
      }
    });
  });
}

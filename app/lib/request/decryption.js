var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
let config = require('config');
let passphrase = config.get('Request.passphrase');


let decrypt = (obj) => {
  for( i in obj ){
      if(typeof(obj[i]) === 'object'){
        obj[i] = decrypt(obj[i]);
      }else{
        var absolutePath = path.resolve('./key/private.pem');
        var privateKey = fs.readFileSync(absolutePath, "utf8");
        var buffer = new Buffer(obj[i], "base64");
        var decrypted = crypto.privateDecrypt({
          key:privateKey,
          passphrase: passphrase,
          padding: crypto.constants.RSA_PKCS1_PADDING //for support jsencrypt
        }, buffer);
        obj[i] = decrypted.toString("utf8");
      }
  }
  return obj;
}


module.exports = decrypt;

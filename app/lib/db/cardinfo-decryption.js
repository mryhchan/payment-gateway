let crypto = require('crypto');
let config = require('config');
let encryption = config.get('CreditCard.encryption');

module.exports = (str) => {
    let text = str;
    let decipher = crypto.createDecipher(encryption.algorithm,encryption.password)
    let decrypted = decipher.update(text,'hex','utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

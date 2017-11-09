let encryption = require('../lib/db/cardinfo-encryption.js');
let decryption = require('../lib/db/cardinfo-decryption.js');
var braintree_sandbox = require('../lib/braintree/connect-sandbox.js');
var braintree = require("braintree");


describe("encryption of card information", () => {
  encrypt_output = 'd027d4e76327849156fc9a137f1294181b099535f0b13f659dab29e35706cbcc904ba1078f032b6b99eb089b4ccaa82e58fd75026c824051db3bb66faeaec9afa7eb99283c3f02c06294cf7b4c50152f0f1136d39c9c66a089e53572876d586352e3788d';
  it('should encrypt a string', (done) => {
    let promise = encryption('Chan Tai Man', '1234223433344434', '11/2022', '123');
    promise.then((str) => {
      expect(str).toBe(encrypt_output);
      done();
    });
  })
  it('should decryped a string', (done) => {
    let obj = decryption(encrypt_output);
    expect(obj['cardholderName']).toBe('Chan Tai Man');
    done();

  });
})

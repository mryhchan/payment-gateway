let dbconnect = require('../lib/db/connect.js');
let config = require('config');

describe("connect to mongo db using mongoose",() => {
  it("should success to connect to db", (done) => {
    let dbConfig = config.get('Test.dbConfig');
    promise = dbconnect('Test');
    promise.then((db) => {
        expect(db.host).toBe(dbConfig.host);
        done();
      },(err) => {
        //should success to connect
      })
  })

  it("should fail to connect to db", (done) => {
    promise = dbconnect('Test_fail');
    promise.then(() => {
      //should fail to connect
    },(err) => {
      expect(err.message.indexOf('failed to connect to server') !== -1).toBe(true);
      done();
    })
  })
})

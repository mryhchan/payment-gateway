var redis = require('../lib/redis/connect.js');
const uuidv4 = require('uuid/v4');


describe("redis test", () => {
  it('should be insert some data to redis', (done) => {
    let key = uuidv4();
    console.log(key);
    let val = 'Hello world';
    redis.set(key, val, redis.print);
    redis.getAsync(key).then(function(res) {
        console.log(res);
        expect(res).toBe(val);
        done();
    })
  });
})

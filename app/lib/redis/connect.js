let redis = require('redis');
let bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let config = require('config');
let redisConfig = config.get('Payment.redis');

client = redis.createClient({ "host": redisConfig.host, "port": redisConfig.port });

if(redisConfig.hasOwnProperty('password')){
  client.auth(redisConfig.password, function (err) {
      if (err) throw err;
  });
}

client.on('connect', ()=>{
  console.log('connected');

});

client.on('error',(err)=>{
  console.log(err);
})

module.exports = client;

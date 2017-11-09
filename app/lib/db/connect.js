"use strict"
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let config = require('config');

module.exports= (type) => {
    let dbConfig = config.get(type+'.dbConfig');
    let url= "mongodb://";
    if(dbConfig.hasOwnProperty('user') && dbConfig.user.length > 0 && dbConfig.hasOwnProperty('password') && dbConfig.password.length>0){
      url += dbConfig.user+":"+dbConfig.password + "@";
    }
    url+=dbConfig.host;
    url+=":"+dbConfig.port;
    url+="/"+dbConfig.dbname;
    console.log(url);
    return mongoose.createConnection(url, {
      useMongoClient: true
    });
}

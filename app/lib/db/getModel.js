"use strict"
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports= (collection, schema) => {
  //if the model is exist.
  if (mongoose.models[collection] !== undefined) {
    //return the exist model
    return mongoose.model(collection);
  }
  //create a new model
  return mongoose.model(collection, schema);
}

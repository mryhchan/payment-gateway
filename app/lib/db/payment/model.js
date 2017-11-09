let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let config = require('config');
let dbconnect = require('../connect.js');
let getModel = require('../getModel.js');
let encryption = require('../cardinfo-encryption.js');
let _ = require('lodash');


const uuidv4 = require('uuid/v4');

class model {
  constructor(paymentinfo, gatewayrespnse, type, query) {
    this.payment = paymentinfo;
    this.gatewayRespnse = gatewayrespnse;
    this.gatewayType = type;
    this.query = query;
  }
  find(query) {
    let self = this;
    return new Promise((resolve,reject) => {
        let promise = dbconnect('Payment');
        promise.then((db) => {
          let model = db.model('Payment', self.Schema());
          return model.findOne(query)
        }, (err) => {
          throw "COULD_NOT_CONNECT_TO_DB";
        }).then((doc) => {
          if (doc === null){
            throw 'RECORD_NOT_FOUND';
          }
          resolve(doc);
        }, (err) => {
          throw err;
        }).catch((err) => {
          reject(err);
        })
    });
  }
  save() {
    let self = this;
    return new Promise((resolve, reject) => {
      let promise = encryption(self.payment.paymentinfo.cardholderName,self.payment.paymentinfo.number,self.payment.paymentinfo.expirationDate,self.payment.paymentinfo.cvv);
      promise.then((str) =>{
        self.payment.paymentinfo.creditCard =str;
        _.unset(self.payment.paymentinfo,'cardholderName');
        _.unset(self.payment.paymentinfo,'number');
        _.unset(self.payment.paymentinfo,'expirationDate');
        _.unset(self.payment.paymentinfo,'cvv');

        return dbconnect('Payment');
      }).then((db) => {
        let model = db.model('Payment', self.Schema());
        let newPayment = new model({
          firstName: self.payment.orderinfo.firstName,
          lastName: self.payment.orderinfo.lastName,
          phoneNumber: self.payment.orderinfo.phoneNumber,
          referenceCode: uuidv4(),
          timeCreated: Date.now(),
          timeModified: Date.now(),
          payment: self.payment,
          gatewayRespnse: self.gatewayRespnse,
          gatewayType: self.gatewayType
        });
        return newPayment.save();
      }, (err) => {
        console.log(err);
        throw "COULD_NOT_CONNECT_TO_DB";
      }).then((doc) => {
        resolve(doc);
      }, (err) => {
        throw err;
      }).catch((err) => {
        reject(err);
      })
    })
  }

  Schema() {
    return new mongoose.Schema({
      firstName: {
        type: String,
        require: true
      },
      lastName: {
        type: String,
        require: true
      },
      phoneNumber:{
        type: String,
        require: true
      },
      referenceCode: {
        type: String,
        require: true
      },
      timeCreated: {
        type: Number,
        require: true
      },
      timeModified: {
        type: Number,
        require: true
      },
      payment: Object,
      gatewayRespnse: Object,
      gatewayType: String
    });
  }
}
module.exports = model;

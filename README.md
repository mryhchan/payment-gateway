# payment-gateway
A full stack node.js application for payment

## 1. Requirements
This application is basic on these requirements to develop.
- Create payment from server to difference payment gateway.
- Use different payment gateway according to different payment method and currencies.

### 1.1 Rules
- If credit card is American Express, then use `PayPal Sandbox`;
- If currency is `USD`, `EUR` or `AUD`, then use `PayPal Sandbox`. Otherwise use `Braintree Sandbox`;
- If credit card is `American Express`, but the currency is not `USD`, the application should return error message to state that
  credit card type `American Express` is possible to use only for `USD`;

### 1.2 Logic flow of make a payment
1. User input the payment information, then submit.
1. Frontend validate all input parameters, if there have empty parameters then return to step `1.`. Else, send the payment information to Backend.
1. Backend validate all input parameters, if there have empty parameters then send error to step `8.`. Else, prepare to make the payment.
1. Create customer to `Braintree Sandbox` using input parameters, if Backend can not create customer to `Braintree Sandbox` then send error to step `8.`.
1. Try to create credit card to `Braintree Sandbox` using input parameters, Backend can not create credit card to `Braintree Sandbox` then send error to step `8.`.
1. Using different payment gateway to make a payment, if Backend can not make a payment then send error to step `8.`.
1. Save the payment gateway response to Data Base and Cache Engine, if the Backend have error from DB then send error to step `8.`.
1. Generate the output base on the successful result from step `7.` or generate the error message base on the error from step `4.`,`5.`,`6.`,`7.`.
1. Send the output from Backend to Frontend.
1. Generate the view to User base on the output from Backend.

### 1.3 Logic Flow of check payment
1. User input the payment record information, then submit.
1. Frontend validate all input parameters, if there have empty parameters then return to step `1.`. Else, send the payment information to Backend.
1. Backend validate all input parameters, if there have empty parameters then send error to step `5.`. Else, prepare to make the payment.
1. Try to get the payment record from Cache Engine according to the input parameters, if there have no payment record from Cache Engine then try to find the payment record from Data Base according to the input parameters, if the Backend have error from DB or  then send error to step `5.`.
1. Generate the output base on the successful result from step 4. or generate the error message base on the error from step `3.`,`4.`.
1. Send the output from Backend to Frontend.
1. Generate the view to User base on the output from Backend.

## 2. Design
### Structure(docker-compose)
To modify the docker-compose.yml can be set more than one `payment-gateway` to load-balancing the application.
>  nginx > payment-gateway(load-balancing) >  redis
>        > payment-gateway(load-balancing) >   and mongo db

### Structure(heroku)
For the Structure of `heroku`, `payment-gateway` is connected redisLab(redis) and Mlab(mongoDB) in cloud.
> payment-gateway > redis and mongo db

### Structure(test)
For the Structure of `test`, `payment-gateway` is connected redisLab(redis) and Mlab(mongoDB) in cloud.
> payment-gateway > redis and mongo db


## 3. Installation Guide
You need to install `Docker` with `docker-compose`, `node.js` version 6.11.4 or above, `git` command line client before to start this application at local.
### 3.1 GIT Clone
```
git clone https://github.com/mryhchan/payment-gateway.git
```
### 3.2 Install Node.JS component
```
# change directory to app in the repos
cd /path/to/payment-gateway/app
# install component
npm install
```

### 3.3 Switch Configuration
Author provided three Configuration files in /app/config
```
# switch node environment to use docker-compose
export NODE_ENV=default
# switch node environment to use the image pushed on heroku
export NODE_ENV=heroku
# switch node environment to test unit
export NODE_ENV=test
```
### 3.4 start application
```
#====================================
# start with NODE_ENV=default
export NODE_ENV=default
# in root directory in this git
# you need to build before when you're first time to start this application
docker-compose build
# start the application
docker-compose up

#====================================
# start with NODE_ENV=heroku
export NODE_ENV=heroku
# go to sub folder app
cd /path/to/the/patment-gateway/app
# start the application
npm start

#====================================
# start with NODE_ENV=test
export NODE_ENV=test
# go to sub folder app
cd /path/to/the/patment-gateway/app
# start to test the application
npm test
```
### 3.5 Edit Configuration file
You can create your own Configuration file to run application. Here is a full configuration file.
```json
{
  "Payment": {
    "dbConfig" : {
      "host" : "required mongo db host",
      "port" : "required mongo db port",
      "dbname" : "required Data Base Name",
      "user": "optional username",
      "password": "optional password"
    },
    "redis": {
      "host": "required redis db host",
      "port": "required redis db port",
      "password": "optional password"

    }
  },
  "Braintree": {
    "Sandbox": {
      "merchantId": "required Braintree Sandbox merchantId",
      "publicKey": "required Braintree Sandbox publicKey",
      "privateKey": "required Braintree Sandbox privateKey"
    },
    "merchantAccounts": {
      "HKD": "required Braintree Sandbox merchantAccounts ID",
      "JPY": "required Braintree Sandbox merchantAccounts ID",
      "CNY": "required Braintree Sandbox merchantAccounts ID"
    }
  },
  "CreditCard" :{
    "encryption" : {
      "password" : "required encryption password",
      "algorithm" : "required encryption algorithm"
    }
  },
  "Request": {
    "passphrase": "required RSA encryption privateKey passphrase"
  },
  "PayPal": {
    "Config": {
      "mode": "required PayPal mode (Sandbox or live)",
      "token": "required PayPal access token",
      "email": "required PayPal merchantAccount email",
      "expiryDate": "required PayPal access token expiryDate",
      "clientID": "required PayPal clientID",
      "clientSecret": "required PayPal clientSecret"
    }
  }
}
```

## 4. End Points
### 4.1. /
- method: GET
- response: html page with payment form

### 4.2. /payment
- method: POST
- optional parameters (query):
  - GET parameter: encrypted
    - boolean(true)
    - description: if stated this parameter, you should encrypt all parameters in body with provided public key as format as Base64 and padding as RSA_PKCS1_PADDING or using [jsencrypt] to encrypt all parameters in body
- parameters (body):
```json
{
  "orderinfo": {
    "firstName": "required string of first name",
    "lastName": "required string of Last name",
    "phoneNumber": "required string of currency with format of a phone number, e.g.(123+12345678)",
    "currency": "required string of currency with format of three capital letters, e.g.(USD)",
    "price": "required string of price with format of a float number with 2 decimal places, e.g.(12.00)"
  },
  "paymentinfo": {
    "cardholderName": "required string of credit card holder name",
    "number": "required string of credit card number",
    "expirationDate": "required string form with format with Date (MM/YYYY)",
    "cvv": "required cvv"
  }
}
```
- response :
  - status `200`:
  ```json
  {
    "status": 200,
    "html": "<div>Your payment has been successfully created, your Reference Code is <strong><REFERENCECODE></strong></div><div>You can check this payment record by your First Name , Last Name, Phone Number and Reference Code <a href=\"/paymentCheckingForm?fn=<FIRSTNAME>&ln=<LASTNAME>&pn=<PHONENUMBER>&rc=<REFERENCECODE>\" >here</a>.</div>",
    "paymentCheckingFormURL": "/paymentCheckingForm?fn=<FIRSTNAME>&ln=<LASTNAME>&pn=<PHONENUMBER>&rc=<REFERENCECODE>",
    "referenceCode": "<REFERENCECODE>"
  }
  ```
  - status `500`:
  ```json
  {
    "status": 500,
    "messages": [{
      "message" : "<ERROR_MESSAGE>",
      "err" : "<ERROR_TYPE>"
      }]
  }
  ```

### 4.3 /paymentCheckingForm
- method: GET
- optional parameters:
  - GET parameter: fn
    - description: the value of form elements firstName in the form
  - GET parameter: ln
    - description: the value of form elements lastName in the form
  - GET parameter: pn
    - description: the value of form elements phoneNumber in the form
  - GET parameter: rc
    - description: the value of form elements referenceCode in the form
- response: html page with payment checking form

### 4.4 /paymentCheckingForm/checking
- method: POST
- optional parameters (query):
  - GET parameter: encrypted
    - boolean(true)
    - description: if stated this parameter, you should encrypt all parameters in body with provided public key as format as Base64 and padding as RSA_PKCS1_PADDING or using [jsencrypt] to encrypt all parameters in body
- parameters (body):
```json
{
  "orderinfo": {
    "firstName": "required string of first name",
    "lastName": "required string of Last name",
    "phoneNumber": "required string of currency with format of a phone number, e.g.(123+12345678)",
    "referenceCode": "required string of reference code, e.g.(a221e90c-12ae-4d26-a984-78c7987f2941)"
  }
}
```
- response :
  - status `200`:
  ```json
  {
    "status": 200,
    "firstName": "<FIRSTNAME>",
    "lastName": "<LASTNAME>",
    "phoneNumber": "<PHONENUMBER>",
    "referenceCode": "<REFERENCECODE>",
    "currency": "<CURRENCY>",
    "number": "<CREDIT_CARD_NUMBER_WITH_HIDDEN_PARTS>",
    "expirationDate": "<EXPIRATIONDATE>",
    "cardImage": "<BRAINTREE_SANDBOX_CREDIT_CARD_IMAGE_URL>",
    "cardholderName": "<CARDHOLDERNAME>",
    "transactionStatus": "<TRANSACTIONSTATUS>",
  }
  ```
  - status `500`:
  ```json
  {
    "status": 500,
    "messages": [{
      "message" : "<ERROR_MESSAGE>",
      "err" : "<ERROR_TYPE>"
      }]
  }
  ```
  - status `404`:
  ```json
  {
    "status": 404,
    "messages": [{
      "message" : "Record not found.",
      "err" : "RECORD_NOT_FOUND"
      }]
  }
  ```

## 5. Tests
### Credit Card Numbers
Braintree provided some Test Card for testing and verification, you can access [here]
For more test case, Please refer to file in `/path/to/payment-gateway/spec/make-payment-spec.js`

Credit Card Numbers| Method | Success, Fail | result
--- | --- | --- | ---
`378282246310005` American Express | `PayPal Sandbox` | *Success* | Successful pay with `PayPal Sandbox` but it's terribly slow
`4111111111111111` Visa | `PayPal Sandbox` | *Fail* > *Success* | `PayPal Sandbox` always refused the payment and it's terribly slow
`5555555555554444` Master Card| `Braintree Sandbox` | *Fail* > *Success* | `PayPal Sandbox` always refused the payment and it's terribly slow
`4111111111111111` Visa | `Braintree Sandbox` | *Success* | Successful pay with `Braintree Sandbox`
`5555555555554444` Master Card | `Braintree Sandbox` | *Success* | Successful pay with `Braintree Sandbox`

## 6. Development notes

### 6.1. Security
- This application have encrypted all information in transfer sensitive data. The sensitive data between Frontend to Backend, and Backend to Data Base and Cache Engine.
- Data Base and Cache Engine are storing the encrypted data.
- The Encryption Algorithm is using RSA and AES.
 - RSA for Frontend to Backend
 - AES for data stored in the Data Base and Cache Engine.

### 6.2. Problem known at dates
11/Nov/2017
- No error handling when decryption is failed
- No test case for currency is not listed in /app/config/default.json.Braintree.merchantAccountId
- No error handling when application can not connect to redis
- No end point to get the publicKey for encryption of payment information.
- It's terribly slow of testing create payment with `PayPal Sandbox`
- Application do not void the payment when the Payment record cannot save to Data Base and Cache Engine
- Since `Braintree Sandbox` is limited client to test the cards with card number provided from `Braintree Sandbox`, so this application can only use these credit card number [here].
- Regarding to the previous problem, `PayPal Sandbox` is not accept all of the credit card provided from `Braintree Sandbox`.
- `PayPal Sandbox` always refuse the payment record from using CreditCard except American Express and currency is `USD`, `EUR` or `AUD`.


## 7. Public access URL
>https://young-dusk-45508.herokuapp.com/

[here]: https://developers.braintreepayments.com/guides/credit-cards/testing-go-live/node
[jsencrypt]:http://travistidwell.com/jsencrypt/

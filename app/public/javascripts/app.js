angular.module('app', [])
  .controller('Payment_Controller', ($scope, $http) => {
    let form = document.querySelector('#paymentForm');
    let token = document.querySelector('#token');
    var submit = document.querySelector('#submit');
    let payment = this;
    let authorization = token.innerText;
    $scope.currency = ['AUD', 'CNY', 'EUR', 'HKD', 'JPY', 'USD']
    $scope.hostedFieldsInstance = {};
    $scope.readOnly = false;
    $scope.form = {
      id: "panel-title",
      str: "Payment",
      orderinfo: {
        id: "order-section-title",
        str: "Order",
        firstName: {
          id: "order-customer-firstname",
          str: "Customer First Name",
          val: "",
          placeholder: "Tai Man"
        },
        lastName: {
          id: "order-customer-lastname",
          str: "Customer Last Name",
          val: "",
          placeholder: "Chan"
        },
        phoneNumber: {
          id: "order-customer-phone-number",
          str: "Phone Number",
          val: "",
          placeholder: "852+12345678"
        },
        currency: {
          id: "order-currency",
          str: "Currency",
          val: $scope.currency[3],
        },
        price: {
          id: "order-price",
          str: "Price",
          val: null,
          placeholder: "12345678"
        }
      },
      paymentinfo: {
        id: "paymentinfo-section-title",
        str: "Payment Information",
        cardholderName: {
          id: "card-holder-name",
          str: "Credit Card Holder Name",
          val: "",
          placeholder: "Chan Tai Man"
        },
        number: {
          id: "card-number",
          str: "Credit Card Number",
          val: "",
          placeholder: "4111 1111 1111 1111"
        },
        expirationDate: {
          id: "card-expiration-date",
          str: "Credit Card Expiration Date",
          val: "",
          placeholder: "MM/YYYY"
        },
        cvv: {
          id: "card-ccv",
          str: "Credit Card CCV",
          val: "",
          placeholder: "123"
        }
      },
      purchaseBtn: {
        id: "submit",
        str: "Purchase"
      }
    }

    payment.setReadOnly = (bool) => {
      $scope.readOnly=bool;
    }
    $scope.submit = function(form) {
      payment.setReadOnly(true);
      $scope.payment = {
        orderinfo: {
          firstName: form.orderinfo.firstName.val,
          lastName: form.orderinfo.lastName.val,
          phoneNumber: form.orderinfo.phoneNumber.val,
          currency: form.orderinfo.currency.val,
          price: form.orderinfo.price.val,
        },
        paymentinfo: {
          cardholderName: form.paymentinfo.cardholderName.val,
          number: form.paymentinfo.number.val,
          expirationDate: form.paymentinfo.expirationDate.val,
          cvv: form.paymentinfo.cvv.val,
        }
      };
      $('.message').text('').removeClass('has-warning')
      let pass = true;
      for (i in $scope.payment) {
        for (j in $scope.payment[i]) {
          if ($scope.payment[i][j] === '' || $scope.payment[i][j] === null) {
            $('#' + $scope.form[i][j].id).next('.message').text($scope.form[i].str + ' > ' + $scope.form[i][j].str + ' is empty.').addClass('has-warning');
            pass = false;
          } else {
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey($('#publicKey').text());
            if (typeof($scope.payment[i][j]) === 'number') {
              $scope.payment[i][j] = $scope.payment[i][j].toString();
            }
            $scope.payment[i][j] = encrypt.encrypt($scope.payment[i][j]);
          }
        }
      }
      if (pass) {
        $http.post('/payment?encrypted=true', $scope.payment).then((res) => {
          $('#' + $scope.form.purchaseBtn.id).next('.message').html(res.data.html).addClass('has-success');
        }, (err) => {
          console.log(err);
          payment.setReadOnly(false);
          if (err.status === 500) {
            if (err.data.hasOwnProperty('messages') && Array.isArray(err.data.messages)) {
              for (i in err.data.messages) {
                payment.generateError(err.data.messages[i]);
              }
            } else {
              $('#' + $scope.form.purchaseBtn.id).next('.message').text('Unknown error.').addClass('has-warning');
            }
          } else if (err.status === 404) {
            $('#' + $scope.form.purchaseBtn.id).next('.message').html('Host not found. Please try again later.').addClass('has-warning');
          } else {
            $('#' + $scope.form.purchaseBtn.id).next('.message').html('Unknown error.').addClass('has-warning');
          }
        });

      } else {
        payment.setReadOnly(pass);
        return pass;
      }
    }
    payment.generateError = (err) => {
      switch (err.err) {
        case 'INVALID_CREDIT_CARD_NUMBER':
        case 'CREDIT_CARD_NUMBER_IS_REQUIRED':
        case 'CREDIT_CARD_AMERICAN_EXPRESS_IS_ONLY_FOR_USD':
        case "CREDIT_CARD_TYPE_IS_NOT_SUPPORTED":
        case 'CREDIT_CARD_IS_REJECTED':
          id = $scope.form.paymentinfo.number.id;
          break;
        case "INVALID_EXPIRATION_YEAR":
        case "INVALID_EXPIRATION_DATE":
        case "EXPIRATION_DATE_IS_REQUIRED":
        case "CREDIT_CARD_IS_EXPRIED":
          id = $scope.form.paymentinfo.expirationDate.id;
          break;
        case "INVALID_CVV":
        case 'CVV_IS_REQUIRED':
          id = $scope.form.paymentinfo.cvv.id
          break;
        default:
          id = $scope.form.purchaseBtn.id;
          break;
      }
      $('#' + id).next('.message').append(err.message).addClass('has-warning');
    }
    $scope.init = function() {}
  });

angular.module('app', [])
  .controller('Payment_Checking_Form_Controller', ($scope, $http) => {
    let form = document.querySelector('#paymentForm');
    let token = document.querySelector('#token');
    var submit = document.querySelector('#submit');
    let payment = this;
    let authorization = token.innerText;
    $scope.hostedFieldsInstance = {};
    $scope.readOnly = false;
    $scope.formHide = false;
    $scope.recordHide = true;
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
        referenceCode: {
          id: "order-referenceCode",
          str: "Reference Code",
          val: "",
          placeholder: "41c32f1b-3c7b-4dd4-b3ff-52af779c6567",
        },
      },
      checkBtn: {
        id: "submit",
        str: "Check"
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
          referenceCode: form.orderinfo.referenceCode.val,
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
        $http.post('/paymentCheckingForm/check?encrypted=true', $scope.payment).then((res) => {
          $scope.formHide =true,$scope.recordHide=false;
          $scope.record = res.data;
        }, (err) => {
          payment.setReadOnly(false);
          if (err.status === 500) {
            $('#' + $scope.form.purchaseBtn.id).next('.message').text('Unknown error.').addClass('has-warning');
          } else if (err.status === 404) {
            let msg = 'Host not found. Please try again later.';
            if(err.hasOwnProperty('data')&&err.data.hasOwnProperty('messages')){
              msg = '';
              for(i in err.data.messages){
                if(err.data.messages[i].hasOwnProperty('message')){
                  msg += err.data.messages[i].message+'<br/>';
                }
              }
            }
            $('#' + $scope.form.checkBtn.id).next('.message').html(msg).addClass('has-warning');
          } else {
            $('#' + $scope.form.checkBtn.id).next('.message').html('Unknown error.').addClass('has-warning');
          }
        });

      } else {
        payment.setReadOnly(pass);
        return pass;
      }
    }
    $scope.formBack = () => {
      $scope.formHide=false;
      $scope.recordHide=true;
      payment.setReadOnly(false);
    }
    $scope.init = () => {
      $scope.form.orderinfo.firstName.val =$("#"+$scope.form.orderinfo.firstName.id).attr('value');
      $scope.form.orderinfo.lastName.val =$("#"+$scope.form.orderinfo.lastName.id).attr('value');
      $scope.form.orderinfo.phoneNumber.val =$("#"+$scope.form.orderinfo.phoneNumber.id).attr('value');
      $scope.form.orderinfo.referenceCode.val =$("#"+$scope.form.orderinfo.referenceCode.id).attr('value');
    }
  });

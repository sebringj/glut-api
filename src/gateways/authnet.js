var config = require('config');
var request = require('request');
var _ = require('lodash');

var authNet = config.gateways.authNet;

var merchantAuthentication = {
  name: authNet.apiLoginId,
  transactionKey: authNet.transactionKey
};

var validationMode = authNet.sandbox ? 'testMode' : 'liveMode';

function authenticate() {
  return authNetRequest({
    authenticateTestRequest: {
      merchantAuthentication: merchantAuthentication
    }
  });
}

function createCustomer(options) {
  // ?? validation for email, creditCard and expirationDate
  return authNetRequest({
  	createCustomerProfileRequest: {
  		merchantAuthentication: merchantAuthentication,
  		profile: {
  			email: options.email,
  			paymentProfiles: {
  				customerType: 'individual',
  				payment: {
  					creditCard: {
  						cardNumber: options.cardNumber,
  						expirationDate: options.expirationDate
  					}
  				}
  			}
  		},
  		validationMode: validationMode
  	}
  });
}

function deleteCustomer(options) {
  return authNetRequest({
  	deleteCustomerProfileRequest: {
  		merchantAuthentication: merchantAuthentication,
  		customerProfileId: options.customerProfileId
  	}
  });
}

function updateCustomer(options) {
  // ?? validation for newEmail, customerProfileId
  return authNetRequest({
    updateCustomerProfileRequest: {
      merchantAuthentication: merchantAuthentication,
      profile: {
        email: options.email,
        customerProfileId: options.customerProfileId
      }
    }
  });
}

function updateCustomerPaymentProfile(options) {
  // ?? validation for customerProfileId, paymentProfileId, creditCard, expirationDate
  return authNetRequest({
    updateCustomerPaymentProfileRequest: {
      merchantAuthentication: merchantAuthentication,
      customerProfileId: options.customerProfileId,
      paymentProfile: {
        payment: {
          creditCard: {
            cardNumber: options.cardNumber,
            expirationDate: options.expirationDate
          }
        },
        customerPaymentProfileId: options.customerPaymentProfileId
      },
      validationMode: validationMode
    }
  });
}

function createTransaction(options) {
  return authNetRequest({
    createTransactionRequest: {
      merchantAuthentication: merchantAuthentication,
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        // customer: options.customer,
        amount: options.amount,
        payment: {
          creditCard: {
            cardNumber: options.creditCard.cardNumber,
            expirationDate: options.creditCard.expirationDate,
            cardCode: options.creditCard.cardCode
          }
        }
      }
    }
  });
}

function chargeCreditCard(options) {
  // ?? validation for amount, customerProfileId, paymentProfileId
  return authNetRequest({
    createCustomerProfileTransactionRequest: {
      merchantAuthentication: merchantAuthentication,
      transaction: {
        profileTransAuthCapture: {
          amount: options.amount,
          customerProfileId: options.customerProfileId,
          customerPaymentProfileId: options.customerPaymentProfileId,
          cardCode: options.cardCode
        }
      }
    }
  });
}

function getCustomerProfile(options) {
  // ?? validation for customerProfileId
  return authNetRequest({
    getCustomerProfileRequest: {
      merchantAuthentication: merchantAuthentication,
      customerProfileId: options.customerProfileId
    }
  });
}

function getCustomerProfileIds() {
  return authNetRequest({
    getCustomerProfileIdsRequest: {
      merchantAuthentication: merchantAuthentication
    }
  });
}

function authNetRequest(json) {
  var promise = new Promise(function(resolve, reject) {
		request({
	    url: authNet.endpoint,
	    json: true,
	    body: json,
	    method: 'post'
	  }, function(err, httpResponse, body) {
	    if (err) {
	      reject({ err: 'auth.net error.' })
	      return;
	    }
	    var parsedJson;
	    try {
	      parsedJson = JSON.parse(body.trim());
	    } catch(ex) {}
	    var resultCode = _.get(parsedJson, 'messages.resultCode');
	    if (resultCode === 'Ok')
	      resolve(parsedJson);
	    else
	      reject(parsedJson);
	  });
	});
	return promise;
}

module.exports = {
  authenticate: authenticate,
  createCustomer: createCustomer,
  deleteCustomer: deleteCustomer,
  updateCustomer: updateCustomer,
  updateCustomerPaymentProfile: updateCustomerPaymentProfile,
  createTransaction: createTransaction,
  chargeCreditCard: chargeCreditCard,
  getCustomerProfile: getCustomerProfile,
  getCustomerProfileIds: getCustomerProfileIds
};

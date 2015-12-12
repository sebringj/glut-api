'use strict';

let Transaction = require('glut-models').models.Transaction;
let Product = require('glut-models').models.Product;
let User = require('glut-models').models.User;
let paymentProvider = require('../../paymentProviders/' + require('config').paymentProvider);
let _ = require('lodash');
let hasAllProps = require('../../utils/validation');
let code = require('../../utils/httpStatusCodes');
let paymentUtils = require('../../utils/payment');

function verifyCustomer(user, data) {
	let promise = new Promise(function(resolve, reject) {
		User.findOne({
			_id: user._id,
			formsOfPayment: {
				$elemMatch: {
					customerId: data.customerId,
					paymentId: data.paymentId
				}
			}
		}).exec()
		.then(function(doc) {
			if (doc)
				resolve(doc);
			else
				reject('user not found');
		})
		.catch(reject);
	});
	return promise;
}

function createCustomer(data) {
	let promise = new Promise(function(resolve, reject) {
		User.findOne({ primaryEmail: data.email }).exec()
		.then(function(doc) {
			if (!doc)
				return paymentProvider.createCustomer({
					email: data.email,
					cardNumber: data.cardNumber,
					expirationDate: data.expMonth + '-' + data.expYear
				});
			else
				return Promise.reject('user already exists');
		})
		.then(function(resp) {
			return User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					primaryEmail: data.email,
					formsOfPayment: {
						$push: {
							customerId: resp.customerId,
							paymentId: resp.paymentId,
							paymentType: 'card',
							last4: paymentUtils.last4(data.cardNumber),
							expMonth: data.expMonth,
							expYear: data.expYear
						}
					}
				}).exec();
		})
		.then(function(doc) {
			resolve({
				customerId: data.customerId,
				paymentId: data.paymentId
			});
		})
		.catch(reject);
	});
	return promise;
}

module.exports = function() {
  return function handleRequest(req, res) {

    if (!hasAllProps(req.body, ['cardCode', 'cart']))
      return res.status(code.BAD_PARAMS).send('invalid request');

    if (!Array.isArray(req.body.cart))
      return res.status(code.BAD_PARAMS).send('invalid cart');

    let tryExistingCustomer = hasAllProps(req.body,
			['customerId', 'paymentId']) && req.user;

    if (!tryExistingCustomer && !hasAllProps(req.body, [
      'cardNumber', 'expMonth', 'expYear', 'email'
    ]))
      return res.status(code.BAD_PARAMS).send('invalid request');

    let upcs = [];
    let upcQuantity = {};

    for (let item of req.body.cart) {
      let upc = _.get(item, 'product.upc');
      let quantity = _.get(item, 'quantity');
      if (typeof upc !== 'string')
        return res.status(code.BAD_PARAMS).send('invalid cart upc');
      if (typeof quantity !== 'number' || quantity < 1)
        return res.status(code.BAD_PARAMS).send('invalid cart quantity');
      upcs.push({ upc: upc });
      upcQuantity[upc] = item.quantity;
    }

    Product.find({ $and: upcs }).exec()
    .then(function(products) {
      if (products.length !== upcs.length)
        return Promise.reject('products count error');
      let total = 0;
      for (let product of products)
        total += upcQuantity[product.upc] * product.msrp;

      if (tryExistingCustomer)
				return verifyCustomer(req.user, req.body);
			else
				return createCustomer(req.body);
    })
		.then(function(data) {
			return paymentProvider.chargeCreditCard({
				amount: total,
				customerId: data.customerId,
				paymentId: data.paymentId,
				cardCode: req.body.cardCode
			});
		})
    .then(function(json) {
      var transaction = new Transaction({
        cart: req.body.cart,
      });
      return transaction.save();
    })
    .then(function(doc) {
      res.json({
        transactionId: doc._id.toString()
      });
    })
    .catch(function(err) {
      res.status(code.SERVER_ERROR).send('server error');
    });
  };
};

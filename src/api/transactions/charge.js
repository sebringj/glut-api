'use strict';

let Transaction = require('glut-models').models.Transaction;
let _ = require('lodash');
let validation = require('../../utils/validation');
let hasAllProps = validation.hasAllProps;
let isValidActor = validation.isValidActor;
let status = require('../../utils/httpStatusCodes');
let paymentUtils = require('../../utils/payment');
let paymentProvider = require('../../paymentProviders/' + require('config').paymentProvider);
let shippingProvider = require('../../shippingProviders/' + require('config').shippingProvider);
let shippingUtils = require('../../utils/shipping');
let applicableSalesTax = require('config').applicableSalesTax;
let email = require('../../utils/email');
let template = require('../../utils/template');

module.exports = function() {
  return function(req, res) {

    if (!hasAllProps(req.body, [
      'shippingMethod', 'payer', 'recipient', 'cvv2',
      'cardNumber', 'expMonth', 'expYear', 'products'
    ])) {
      res.status(status.BAD_PARAMS).json({ err: 'bad initial params' });
      return;
    }

    if (!isValidActor(req.body.payer) || !isValidActor(req.body.recipient)) {
      res.status(status.BAD_PARAMS).json({ err: 'bad actors' });
      return;
    }

    shippingUtils.rates({
      shippingMethod: req.body.shippingMethod,
      address: req.body.recipient.address,
      products: req.body.products
    })
    .then(function(data) {
      var products = data.products;
      var shippingAmount = parseFloat(_.get(data, 'rates.total.amount'));
      if (isNaN(shippingAmount))
        return Promise.reject({ message: 'Shipping calculation error.' });

      let total = 0;

      let subtotal = 0;
      for (let product of products) {
        subtotal += _.get(product, 'quantity', 0) *
        (product.sale ? _.get(product, 'salePrice', 0) : _.get(product, 'msrp', 0));
      }

      let payerAddress = req.body.payer.address;

      let salesTaxRate = 0;

      if (payerAddress.countryCode === 'US' && applicableSalesTax[payerAddress.stateOrProvince])
        salesTaxRate = applicableSalesTax[payerAddress.stateOrProvince];

			total += subtotal;
			let salesTax = salesTaxRate * total;
      total += salesTax;
      total += shippingAmount;

      return Promise.all([
        paymentProvider.createTransaction({
          amount: Number(total.toFixed(2)),
          cardNumber: req.body.cardNumber,
          expMonth: req.body.expMonth,
          expYear: req.body.expYear,
          cvv2: req.body.cvv2
        }),
        { products, subtotal, salesTax, shippingAmount, total }
      ]);
    })
    .then(function(values) {
      let paymentRefId = values[0].refId;
      let data = values[1];
      let products = data.products;
      let cartItems = _.map(products, function(product) {
        let price = Number((product.sale ? product.salePrice : product.msrp).toFixed(2));
        return {
          product: product._id,
          quantity: product.quantity,
          subtotal: Number((product.quantity * price).toFixed()),
          price
        };
      });
      let transactionData = {
        last4: paymentUtils.last4(req.body.cardNumber),
        exp: req.body.expMonth + '-' + req.body.expYear,
        payer: req.body.payer,
        recipient: req.body.recipient,
        cart: cartItems,
        shippingMethod: data.shippingMethod,
        shippingAmount: Number(data.shippingAmount.toFixed(2)),
        salesTax: Number(data.salesTax.toFixed(2)),
        total: Number(data.total.toFixed(2)),
        status: 'paid',
        paymentRefId
      };
      let transaction = new Transaction(transactionData);
      return Promise.all([
        transaction.save(),
        transactionData
      ]);
    })
    .then(function(values) {
      let transactionData = values[1];
			return Promise.all([
				shippingProvider.methods(),
				transactionData
			]);
    })
    .then(function(values) {
			let shippingMethods = values[0];
			let transactionData = values[1];
			_.assign(transactionData, { shippingLabel: shippingMethods[transactionData.shippingMethod] });
			return email.sendReceipt({
				to: transactionData.payer.email,
				html: template.emailReceipt(transactionData)
			});
    })
		.then(function() {
			res.json({ message: 'success' });
		})
    .catch(function(err) {
			console.log(err);
      if (err && err.message)
        res.status(status.BAD_PARAMS).json({ message: err.message });
      else
        res.status(status.SERVER_ERROR).json({ err: 'server error' });
    });
  };
};

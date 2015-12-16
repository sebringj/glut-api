'use strict';

let shippingProvider = require('../shippingProviders/' + require('config').shippingProvider);
let product = require('../utils/product');
let hasAllProps = require('../utils/validation').hasAllProps;
let calculatePackages = require('./packages').calculate;

module.exports = {
	rates: function(data) {

		if (!hasAllProps(data, [
			'shippingMethod', 'products', 'address'
		]))
			return Promise.reject({ message: 'bad params' });

		let promise = new Promise(function(resolve, reject) {
			product
			.getValidProducts(data.products)
			.then(function(products) {
				return Promise.all([
					shippingProvider.rates({
						shippingMethod: data.shippingMethod,
						address: data.address,
						products
					}),
					products
				]);
			})
			.then(function(values) {
				let rates = values[0];
				let products = values[1];
				let packages = calculatePackages(products);
				resolve({ rates, products, packages });
			})
			.catch(reject);
		});
		return promise;
	}
};

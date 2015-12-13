'use strict';

let Product = require('glut-models').models.Product;
let _ = require('lodash');

module.exports = {
	getValidProducts: function(inputProducts) {
		let promise = new Promise(function(resolve, reject) {
			let upcLookup = {};
			let productUpcs = _.map(inputProducts, function(product) {
				upcLookup[product.upc] = product.quantity;
		    return { upc: product.upc };
		  });
			Product.find({ $or: productUpcs }).lean().exec()
			.then(function(products) {
				if (!products || !products.length)
					return reject({ message: 'No products found.' });
				products.forEach(function(product) {
					product.quantity = upcLookup[product.upc];
				});
				resolve(products);
			})
		});
		return promise;
	}
};

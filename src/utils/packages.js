'use strict';

let _ = require('lodash');

module.exports = {
	calculate: function calculate(products) {
		if (!Array.isArray(products))
			return [];

		let i = 0;
		return _.map(products, function(product) {
			i++;
			return {
				sequence: i,
				groupPackageCount: 1,
				weight: {
					unit: product.weight.unit,
					value: product.weight.value
				},
				dimensions: {
					length: product.dimensions.length,
					width: product.dimensions.width,
					height: product.dimensions.height,
					unit: product.dimensions.unit
				}
			};
		});
	}
};

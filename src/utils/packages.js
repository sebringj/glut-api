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
				groupPackageCount: product.quantity,
				weight: {
					unit: _.get(product,'weight.unit', 'LB'),
					value: _.get(product,'weight.value', 0)
				},
				dimensions: {
					length: _.get(product,'dimensions.length', 0),
					width: _.get(product,'dimensions.width', 0),
					height: _.get(product,'dimensions.height', 0),
					unit: _.get(product,'dimensions.unit', 'IN')
				}
			};
		});
	}
};

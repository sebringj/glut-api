'use strict';

let _ = require('lodash');

module.exports = {
	hasAllProps: function hasProperties(obj, arr) {
		if (!Array.isArray(arr))
			arr = [arr];
		for (let item of arr) {
			if (!_.has(obj, item))
				return false;
		}
		return true;
	}
};

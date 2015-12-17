'use strict';

let handlebars = require('handlebars');
let fs = require('fs');

let customerReceipt;
let orderReceipt;

handlebars.registerHelper('moneyFormat', function(number) {
	if (typeof number !== 'number')
		return '0.00';
	return number.toFixed(2);
});

handlebars.registerHelper('addressFormat', function(arr) {
	if (!Array.isArray(arr))
		return '';
	return arr.join('\n\r');
});

fs.readFile('./src/templates/customer_receipt.html', 'utf8', function(err, data) {
	if (err) throw err;
	customerReceipt = handlebars.compile(data);
});

fs.readFile('./src/templates/order_receipt.html', 'utf8', function(err, data) {
	if (err) throw err;
	orderReceipt = handlebars.compile(data);
});

module.exports = {
	customerReceipt: function(data) {
		return customerReceipt(data);
	},
	orderReceipt: function(data) {
		return orderReceipt(data);
	}
};

'use strict';

let handlebars = require('handlebars');
let fs = require('fs');

let emailReceipt;

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

fs.readFile('./src/templates/email_receipt.html', 'utf8', function(err, data) {
	if (err) throw err;
	emailReceipt = handlebars.compile(data);
});

module.exports = {
	emailReceipt: function(data) {
		return emailReceipt(data);
	}
};

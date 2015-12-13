'use strict';

let handlebars = require('handlebars');
let fs = require('fs');

let emailReceipt;

fs.readFile('./src/templates/email_receipt.html', 'utf8', function(err, data) {
	if (err) throw err;
	emailReceipt = handlebars.compile(data);
});

module.exports = {
	emailReceipt: function(data) {
		return emailReceipt(data);
	}
};

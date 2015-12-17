'use strict';

let config = require('config');
let transporter = config.email.providers[config.email.provider];
let _ = require('lodash');

function send(options) {
	let promise = new Promise(function(resolve, reject) {
		transporter.sendMail(options, function(err, info) {
			if (err)
				return reject(err);
			resolve(info);
		});
	});
	return promise;
}

function sendOrderReceipt(options) {
	return send(_.assign(options, {
		to: config.email.receipt.notifyEmail,
		from: config.email.receipt.from,
		subject: 'order receipt ' + (new Date()).toLocaleString()
	}));
}

function sendCustomerReceipt(options) {
	return send(_.assign(options, {
		from: config.email.receipt.from,
		subject: config.email.receipt.subject
	}));
}

module.exports = { send, sendOrderReceipt, sendCustomerReceipt };

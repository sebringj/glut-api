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

function sendReceipt(options) {
	_.assign(options, {
		from: config.email.receipt.from,
		subject: config.email.receipt.subject,
		bcc: config.email.receipt.notifyEmail
	});
	return send(options);
}

module.exports = { send, sendReceipt };

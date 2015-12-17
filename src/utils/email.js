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
	let emails = [
		send(_.assign({}, options, {
			from: config.email.receipt.from,
			subject: config.email.receipt.subject
		}))
	];
	if (config.email.receipt.notifyEmail) {
		emails.push(
			send(_.assign({}, options, {
				to: config.email.receipt.notifyEmail,
				from: config.email.receipt.from,
				subject: 'order: ' + config.email.receipt.subject
			}))
		);
	}
	return Promise.all(emails);
}

module.exports = { send, sendReceipt };

'use strict';

let router = require('express').Router();
let paymentProvider = require('../paymentProviders/' + require('config').paymentProvider);
let status = require('../utils/httpStatusCodes');

router.get('/methods', function(req, res) {
	paymentProvider.methods()
	.then(function(methods) {
		res.json(methods);
	})
	.catch(function() {
		res.status(status.BAD_GATEWAY).json({ err: 'payment api' });
	});
});

module.exports = router;

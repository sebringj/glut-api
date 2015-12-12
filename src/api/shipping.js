'use strict';

let router = require('express').Router();
let shipping = require('../shippingProviders/' + require('config').shippingProvider);

router.get('/methods', function(req, res) {
	shipping.methods()
	.then(function(methods) {
		res.json(methods);
	})
	.catch(function(err) {
		res.status(500).json({ err: 'shipping api' });
	});
});

router.post('/rates', function(req, res) {
	shipping.rates(req.body)
	.then(function(rates) {
		res.json(rates);
	})
	.catch(function(err) {
		res.status(500).json({ err: 'shipping api' });
	});
});

module.exports = router;

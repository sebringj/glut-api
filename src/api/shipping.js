'use strict';

let router = require('express').Router();
let shippingProvider = require('../shippingProviders/' + require('config').shippingProvider);
let shipping = require('../utils/shipping');

router.get('/methods', function(req, res) {
  shippingProvider.methods()
  .then(function(methods) {
    res.json(methods);
  })
  .catch(function(err) {
    res.status(500).json({ err: 'shipping api' });
  });
});

router.post('/rates', function(req, res) {
  shipping.rates(req.body)
  .then(function(data) {
    res.json(data.rates);
  })
  .catch(function(err) {
    console.error(err);
    if (err && err.message)
      res.status(400).json({ message: err.message });
    else
      res.status(500).json({ err: 'shipping api' });
  });
});

module.exports = router;

'use strict';

let router = require('express').Router();
let config = require('config');

router.get('/applicable-sales-tax', function(req, res) {
  res.json(config.applicableSalesTax);
});

module.exports = router;

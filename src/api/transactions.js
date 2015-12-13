'use strict';

let _ = require('lodash');
let router = require('express').Router();
let Transaction = require('glut-models').models.Transaction;
let security = require('../security');
let status = require('../utils/httpStatusCodes');

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
  Transaction.find(req.query).sort({ modified: -1 }).exec()
	.then(function(docs) {
		res.json(docs);
	})
	.catch(function(err) {
		res.status(status.SERVER_ERROR).send('server error');
	});
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
  let transaction = new Transaction(req.body);
  transaction.save()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

router.put('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Transaction.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

router.delete('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Transaction.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

router.post('/charge', require('./transactions/charge')());

module.exports = router;

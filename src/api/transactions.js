'use strict';

var router = require('express').Router();
var Transaction = require('glut-models').models.Transaction;
var security = require('../security');
var cors = require('cors');

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
  Transaction.find(req.query).sort({ modified: -1 }).exec()
	.then(function(docs) {
		res.json(docs);
	})
	.catch(function(err) {
		res.status(500).send('server error');
	});
});

router.post('/', cors(), security.auth(), security.authAdmin(), function(req, res) {
  var transaction = new Transaction(req.body);
  transaction.save()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.put('/:id', cors(), security.auth(), security.authAdmin(), function(req, res) {
  Transaction.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.delete('/:id', cors(), security.auth(), security.authAdmin(), function(req, res) {
  Transaction.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ transaction: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

module.exports = router;

'use strict';

var router = require('express').Router();
var Product = require('glut-models').models.Product;
var security = require('../security');

router.get('/', function(req, res) {
  Product.find(req.query).lean().exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
  var product = new Product(req.body);
  product.save()
  .then(function(doc, numAffected) {
    res.json({ product: doc, numAffected: numAffected });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.put('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Product.findOneAndUpdate({
    $or: [
      { _id: req.params.id },
      { upc: req.params.id }
    ]
  }, req.body).exec()
  .then(function(doc) {
    res.json({ product: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.delete('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Product.findOneAndRemove({
    $or: [
      { _id: req.params.id },
      { upc: req.params.id }
    ]
  }).exec()
  .then(function(doc) {
    res.json({ product: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

module.exports = router;

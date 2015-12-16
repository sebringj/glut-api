'use strict';

let router = require('express').Router();
let Product = require('glut-models').models.Product;
let security = require('../security');

let publicFields = [
  'upc', 'sku', 'quantity', 'digital', 'downloadUrl', 'physical',
  'available', 'name', 'description', 'tags', 'medias', 'msrp',
  'sale', 'salePrice', 'variants'
];

let nonPublicFields = [
  'wholesale', 'weight', 'dimensions'
];

router.get('/', function(req, res) {
  let fields;
  if (req.user && req.user.isAdmin())
    fields = publicFields.concat(nonPublicFields).join(' ');
  else
    fields = publicFields.join(' ');
  Product.find(req.query, fields).lean().exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
  let product = new Product(req.body);
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

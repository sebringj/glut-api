'use strict';

let router = require('express').Router();
let Variant = require('glut-models').models.Variant;
let security = require('../security');
let _ = require('lodash');

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
  Variant.find(req.query).exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
  let variant = new Variant(req.body);
  variant.save()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.put('/:id', security.auth(), function(req, res) {
  Variant.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.delete('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Variant.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

module.exports = router;

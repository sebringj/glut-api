'use strict';

let router = require('express').Router();
let Variant = require('glut-models').models.Variant;
let security = require('../security');
let _ = require('lodash');
var cors = require('cors');

router.get('/', cors(), security.auth(), security.authAdmin(), function(req, res) {
  Variant.find({}).exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.post('/', cors(), security.auth(), security.authAdmin(), function(req, res) {
  let variant = new Variant(req.body);
  variant.save()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.put('/:id', cors(), security.auth(), function(req, res) {
  Variant.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.delete('/:id', cors(), security.auth(), security.authAdmin(), function(req, res) {
  Variant.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ variant: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

module.exports = router;

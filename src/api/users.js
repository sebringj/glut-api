'use strict';

var router = require('express').Router();
var User = require('glut-models').models.User;

router.get('/', function(req, res) {
  res.status(500).send('not implemented');
});

module.exports = router;

'use strict';

var router = require('express').Router();
var Transaction = require('glut-models').models.Transaction;
var security = require('../security');

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
	res.status(500).send('not implemented');
});

module.exports = router;

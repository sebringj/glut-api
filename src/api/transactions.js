'use strict';

var router = require('express').Router();
var Transaction = require('glut-models').models.Transaction;

router.get('/', function(req, res) {
	res.status(500).send('not implemented');
});

module.exports = router;

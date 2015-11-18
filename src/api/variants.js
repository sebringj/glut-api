'use strict';

var router = require('express').Router();
var Variant = require('glut-models').models.Variant;

router.get('/', function(req, res) {
	res.status(500).send('not implemented');
});

module.exports = router;

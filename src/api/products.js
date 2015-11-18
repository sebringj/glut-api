'use strict';

var router = require('express').Router();
var Product = require('glut-models').models.Product;
var cors = require('cors');
var security = require('../security');

router.get('/', cors(), function(req, res) {
	Product.find({}).lean().exec()
	.then(function(docs) {
		res.json(docs);
	});
});

module.exports = router;

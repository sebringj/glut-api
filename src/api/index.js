'use strict';

var router = require('express').Router();

router.use('/products', require('./products'));
router.use('/transactions', require('./transactions'));
router.use('/users', require('./users'));
router.use('/variants', require('./variants'));

module.exports = router;

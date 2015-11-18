'use strict';

var express = require('express');
var app = new express();
var config = require('config');
var mongoose = require('glut-models').mongoose;
var bodyParser = require('body-parser');

mongoose.connect(config.mongodb);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', require('./api'));

app.listen(config.port, function() {
  console.log('glut-api started on port ' + config.port);
});

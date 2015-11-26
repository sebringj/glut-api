'use strict';

let express = require('express');
let app = new express();
let config = require('config');
let mongoose = require('glut-models').mongoose;
let bodyParser = require('body-parser');
let cors = require('cors');

mongoose.connect(config.mongodb);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', require('./api'));

app.listen(config.port, function() {
  console.log('glut-api started on port ' + config.port);
});

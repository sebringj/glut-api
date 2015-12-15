'use strict';

let express = require('express');
let app = new express();
let config = require('config');
let mongoose = require('glut-models').mongoose;
let bodyParser = require('body-parser');
let cors = require('cors');
let http = require('http');
let https = require('https');
let fs = require('fs');

mongoose.connect(config.mongodb);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', require('./api'));

if (config.sslPort)
  https.createServer({
    key: fs.readFileSync(config.sslKey),
    cert: fs.readFileSync(config.sslCert)
  }, app).listen(config.sslPort);
else
  http.createServer(app).listen(config.port);

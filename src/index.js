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

const lex = require('greenlock-express').create({
  server: 'production',
  email: config.letsEncrypt.email,
  agreeTos: true,
  approveDomains: config.letsEncrypt.domains
});

http.createServer(app).listen(config.port);
if (443)
  https.createServer({
    key: fs.readFileSync(config.sslKey),
    cert: fs.readFileSync(config.sslCert)
  }, app).listen(config.sslPort);

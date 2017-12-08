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

if (config.doLocal)
  require('http').createServer(app).listen(config.port, function() {
    console.log('listening on port ' + this.address().port);
  });
else {
  require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
    console.log('Listening for ACME http-01 challenges on', this.address());
  });
  require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address());
  });
}

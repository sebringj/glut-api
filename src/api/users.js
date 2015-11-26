'use strict';

let router = require('express').Router();
let User = require('glut-models').models.User;
let security = require('../security');
let _ = require('lodash');

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
  User.find(req.query).sort({ modified: -1 }).exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.post('/',
  function(req, res, next) {
    let roles = _.get(req, 'body.roles', []);
    // if admin and new user is admin, then ensure admin is doing this
    if (Array.isArray(roles) && roles.indexOf('admin') > -1) {
      security.auth()(req, res, function() {
        security.authAdmin()(req, res, next);
      });
    } else {
      // todo: validate referrer if anonymous
      next();
    }
  },
  function(req, res) {
    let user = new User(req.body);
    user.save()
    .then(function(doc) {
      res.json({ user: doc });
    })
    .catch(function(err) {
      res.status(500).send('server error');
    });
  }
);

router.get('/verify', security.auth(), function(req, res) {
  res.json(req.user);
});

router.get('/verify-admin', security.auth(), security.authAdmin(), function(req, res) {
  res.json(req.user);
});

router.put('/:id', security.auth(), function(req, res) {
  User.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ user: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

router.delete('/:id', security.auth(), security.authAdmin(), function(req, res) {
  User.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ user: doc });
  })
  .catch(function(err) {
    res.status(500).send('server error');
  });
});

module.exports = router;

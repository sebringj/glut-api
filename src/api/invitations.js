'use strict';

let router = require('express').Router();
let status = require('../utils/httpStatusCodes');
let security = require('../security');
let config = require('config');
let Invitation = require('glut-models').models.Invitation;
let User = require('glut-models').models.User;
let _ = require('lodash');
let invitationUtils = require('./invitations');
let hasAllProps = require('../utils/validation').hasAllProps;

router.get('/', security.auth(), security.authAdmin(), function(req, res) {
  Invitation.find(req.query, fields).lean().exec()
  .then(function(docs) {
    res.json(docs);
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {

  if (!hasAllProps(req.body, ['email', 'successRedirect', 'failureRedirect']))
    return res.status(status.SERVER_ERROR).json({ err: 'bad params' });

  let roles = _.get(req, 'body.roles', []);

  (new Invitation({
    email: req.body.email,
    sent: new Date(),
    successRedirect: req.body.successRedirect,
    errorRedirect: req.body.errorRedirect,
    roles
  }))
  .save()
  .then(function(invitation) {
    return invitationUtils.send({
      invitationId: invitation.invitationId,
      email: invitation.email,
      successRedirect: invitation.successRedirect,
      errorRedirect: invitation.failureRedirect
    });
  })
  .then(function(json) {
    res.json(json);
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).json(err);
  });
});

router.put('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Invitation.findOneAndUpdate({ _id: req.params.id }, req.body).exec()
  .then(function(doc) {
    res.json({ invitation: doc });
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

router.delete('/:id', security.auth(), security.authAdmin(), function(req, res) {
  Invitation.findOneAndRemove({ _id: req.params.id }).exec()
  .then(function(doc) {
    res.json({ invitation: doc });
  })
  .catch(function(err) {
    res.status(status.SERVER_ERROR).send('server error');
  });
});

module.exports = router;

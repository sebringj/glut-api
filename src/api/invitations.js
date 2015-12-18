'use strict';

let router = require('express').Router();
let status = require('../utils/httpStatusCodes');
let security = require('../security');
let hasAllProps = require('../utils/validation').hasAllProps;
let request = require('request');
let config = require('config');
let Invitation = require('glut-models').models.Invitation;
let User = require('glut-models').models.User;
let _ = require('lodash');

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
	if (!hasAllProps(req.body, ['email']))
		return res.status(status.BAD_PARAMS).json({ err: 'params missing' });

		let roles = _.get(req, 'body.roles', []);

		(new Invitation({
			email: req.body.email,
			sent: new Date(),
			roles
		}))
		.save()
		.then(function(invitation) {
			res.json({ invitationId: invitation.invitationId });
		})
		.catch(function(err) {
			res.status(status.SERVER_ERROR).json(err);
		});
});

module.exports = router;

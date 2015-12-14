'use strict';

let router = require('express').Router();
let status = require('../utils/httpStatusCodes');
let security = require('../security');
let hasAllProps = require('../utils/valiation').hasAllProps;
let request = require('request');
let config = require('config');
let jwt = require('jsonwebtoken');
let Invitation = require('glut-models').models.Invitation;

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
	if (!hasAllProps(req.body, ['email', 'successRedirect', 'errorRedirect']))
		return res.status(status.BAD_PARAMS).json({ err: 'params missing' });

		(new Invitation({
			email: req.body.email,
			successRedirect: req.body.successRedirect,
			errorRedirect: req.body.errorRedirect,
			sent: new Date()
		}))
		.save()
		.then(function(invitation) {
			return new Promise(function(resolve, reject) {
				request({
					url: '',
					header: {
						Authorization: 'JWT ' + jwt.sign({
							iss: config.passportJwtOptions.issuer,
							email: invitation.email,
							successRedirect: invitation.successRedirect,
							errorRedirect: invitation.errorRedirect,
							invitation: invitation.invitationId
						}, config.passportJwtOptions.secretOrKey),
						'Content-Type': 'application/json'
					}
				}, function(err, resp, body) {
					if (err)
						return reject(err);
					resolve(JSON.parse(body));
				})
			});
		})
		.then(function(data) {
			res.json(data);
		})
		.catch(function(err) {
			res.status(status.SERVER_ERROR).json(err);
		});
});

module.exports = router;

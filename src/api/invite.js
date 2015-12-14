'use strict';

let router = require('express').Router();
let status = require('../utils/httpStatusCodes');
let security = require('../security');
let hasAllProps = require('../utils/valiation').hasAllProps;
let request = require('request');
let config = require('config');
let jwt = require('jsonwebtoken');
let Invitation = require('glut-models').models.Invitation;
let User = require('glut-models').models.User;
let _ = require('lodash');

router.post('/redeem', function(req, res) {
	(new Promise({
		jwt.verify(req.body.jwt, config.passportJwtOptions.secretOrKey, function(err, verifiedAndDecoded) {
			if (err) {
				return reject({ err });
			}
			if (!hasAllProps(jwt, {
				'provider', 'profileId', 'invitationId'
			}))
				return reject({ err: 'missing params' });

			resolve(verifiedAndDecoded);
		});
	}))
	.then(function(jwt) {
		return Promise.all([
			Invitation.findOneAndUpdate({
				invitationId: jwt.invitationId,
				redeemed: { $exists: false }
			}, { redeemed: new Date() }).exec(),
			jwt
		]);
	})
	.then(function(values) {
		let invitation = values[0];
		let jwt = values[1];
		if (!invitation)
			return Promise.reject({ err: 'invitation not found' });

		return (new User({
			invitation: invitation._id,
			email: invitation.email,
			profiles: [{
				profileId: invitation.profileId,
				provider: invitation.provider,
				roles: invitation.roles
			}]
		})).save();
	})
	.then(function() {
		res.json({ message: 'ok' });
	})
	.catch(function(err) {
		res.status(status.BAD_PARAMS).json(err);
	});
});

router.post('/', security.auth(), security.authAdmin(), function(req, res) {
	if (!hasAllProps(req.body, ['email', 'successRedirect', 'errorRedirect']))
		return res.status(status.BAD_PARAMS).json({ err: 'params missing' });

		let roles = _.get(req, 'body.roles', []);

		(new Invitation({
			email: req.body.email,
			successRedirect: req.body.successRedirect,
			errorRedirect: req.body.errorRedirect,
			sent: new Date(),
			roles
		}))
		.save()
		.then(function(invitation) {
			return new Promise(function(resolve, reject) {
				request.post({
					url: config.hallpassUrl,
					form: {
						jwt: jwt.sign({
							iss: config.passportJwtOptions.issuer,
							email: invitation.email,
							successRedirect: invitation.successRedirect,
							errorRedirect: invitation.errorRedirect,
							invitation: invitation.invitationId
						}, config.passportJwtOptions.secretOrKey)
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

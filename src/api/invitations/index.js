let jwt = require('jsonwebtoken');
let request = require('request');
let _ = require('lodash');
let config = require('config');

function send(options) {

  return new Promise(function(resolve, reject) {
		jwt.sign(
			options,
			config.passportJwtOptions.secretOrKey,
			{ issuer: config.passportJwtOptions.issuer },
			function(signedToken) {
				request.post({
					url: config.hallpassUrl,
					form: { jwt: signedToken }
				}, function(err, res, body) {
					if (err)
						return reject(err);
					try {
						let json = JSON.parse();
						resolve();
					} catch(ex) {

					}
				});
			}
		);
  });
}

module.exports = {
  send
};

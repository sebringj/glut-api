'use strict';

let passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let config = require('config');
let User = require('glut-models').models.User;
let _ = require('lodash');

passport.use(new JwtStrategy(config.passportJwtOptions, function(payload, done) {
  User.findOne({
    profiles: {
      $elemMatch: {
        profileId: payload.id,
        provider: payload.provider
      }
    }
  }).exec()
  .then(function(user) {
    done(null, user);
  })
  .catch(function(err) {
    done(null, false);
  });
}));

module.exports = {
  auth: function() {
    return function(req, res, next) {
      passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) { return res.status(500).send('server error'); }
        if (!user) { return res.status(403).send('unauthorized'); }
        req.logIn(user, function(err) {
          if (err) { return res.status(500).send('server error'); }
          next();
        });
      })(req, res, next);
    };
  },
  authAdmin: function() {
    return function(req, res, next) {
      var roles = _.get(req, 'user.roles', []);
      if (roles.indexOf('admin') > -1)
        next();
      else
        res.status(403).send('unauthorized');
    };
  }
};

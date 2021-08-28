const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const {User} = require('../models');

module.exports = () => {
 
  passport.use(new FacebookStrategy({ 
    clientID: process.env.FACEBOOK_ID,
    clientSecret : process.env.FACEBOOK_PWD,
    callbackURL: 'http://localhost:3060/user/facebook/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'facebook' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: null,
          nickname: profile.displayName,
          snsId: profile.id,
          provider: 'facebook',
          color : nickcolor,
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
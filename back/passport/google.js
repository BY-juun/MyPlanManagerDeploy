const passport = require('passport');
const GoogleStrategy   = require('passport-google-oauth2').Strategy;

module.exports = () => {
 
    passport.use(new GoogleStrategy({ 
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret : process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3060/user/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const exUser = await User.findOne({
          where: { snsId: profile.id, provider: 'google' },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            email: null,
            nickname: profile.displayName,
            snsId: profile.id,
            provider: 'google',
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
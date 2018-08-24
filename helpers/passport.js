const passport = require('helpers/passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (User) => {
    const credentials = {usernameField: 'user[email]', passwordField: 'user[password]'};
    const strategy = new LocalStrategy(credentials, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if (!user || !user.validPassword(password)) {
                return done(null, false, {errors: {'email or password': 'is invalid'}});
            }
            return done(null, user);
        }).catch(done);
    });
    passport.use(strategy);
};


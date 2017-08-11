const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
           done(null, user); 
        });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    secret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id })
            .then((existingUser) => {
                if(existingUser) {
                    //we already have a record with given ID
                   return done(null, existingUser);
                } else {
                    new User({googleId: profile.id})
                        .save()
                        .then(user => done(null, user));
                }
            });
        }
    )
);



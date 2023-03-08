const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();
var userProfile;

app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.get('/', function(req, res) {
    res.render('auth');
});

app.set(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/* AUTH GOOGLE */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '620258892888-72q3mc2khbsl1gnvec8qcekpp94t6ijm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy( {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function(accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google', passport.authenticate('google', {
    scope : ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/error'
}),
    function(req, res) {
        res.redirect('/success');
    }
);
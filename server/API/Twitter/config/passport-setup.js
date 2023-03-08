const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
require('dotenv').config();

const db = require("../../db");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.CALLBACK_TWITTER_URL,
            passReqToCallback: true
        },
        async (req, token, tokenSecret, profile, done) => {
            const user_id = JSON.parse(req.session.state).user_id;
            const user = {
                user_id: profile.id,
                username: profile.username,
                display_name: profile.displayName,
                token: token,
                tokenSecret: tokenSecret
            };

            let credInDB = false;
            db.selectDB("user_credentials", "user_id", user_id, function(credentials) {
                if (credentials === "KO") {
                    credInDB = false;
                } else if (credentials.oauth2_id === "2") {
                    credInDB = true;
                }
            });
            if (credInDB === false) {
                const jsonToken =
                    {
                        "token": token,
                        "tokenSecret": tokenSecret
                    };
                db.insertDB("user_credentials", "user_id, oauth2_id, token", `'${user_id}', '2', '${JSON.stringify(jsonToken)}'`, function(result) {
                    if (result === "KO") {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    }
                });
            } else {
                return done(null, user);
            }
        }
));
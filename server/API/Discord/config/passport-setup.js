const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const db = require("../../db");

// serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((user, done) => {
    done(null, user);
});

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_DISCORD_URL,
            passReqToCallback: true,
            scope: scopes
        },
        async (req, accessToken, refreshToken, profile, done) => {
            const user_id = JSON.parse(req.session.state).user_id;
            const user = {
                user_id: profile.id,
                username: profile.username,
                display_name: profile.displayName,
                accessToken: accessToken,
                refreshToken: refreshToken
            };

            let credInDB = false;
            db.selectDB("user_credentials", "user_id", user_id, function(credentials) {
                if (credentials === "KO") {
                    credInDB = false;
                } else if (credentials.oauth2_id === "4") {
                    credInDB = true;
                }
            });
            if (credInDB === false) {
                const jsonToken = {
                    "accessToken": accessToken,
                    "refreshToken": refreshToken,
                    "discord_id": profile.id
                };
                db.insertDB("user_credentials", "user_id, oauth2_id, token", `'${user_id}', '4', '${JSON.stringify(jsonToken)}'`, function(result) {
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
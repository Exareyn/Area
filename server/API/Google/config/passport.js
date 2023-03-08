const passport = require("passport");
require('dotenv').config();
const db = require("../../db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done)=>{
    // console.log("serializeUser");
    done(null,user);
});

passport.deserializeUser((user, done)=>{
    done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    access_type: 'offline',
    passReqToCallback: true,
    scope: ['email',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/spreadsheets'],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const user_id = JSON.parse(req.session.state).user_id;
    console.log(profile);
    const user = {
      user_id: profile.id, 
      // username: profile.name['givenName'],
      display_name: profile.displayName,
      mail: profile.emails[0].value,
      token: accessToken,
      tokensecret: refreshToken
    };
    console.log(user.user_id.toString());


    let credInDB = false;
    db.selectDB("user_credentials", "user_id", user_id, function(credentials) {
      if (credentials === "KO") {
        credInDB = false;
      } else if (credentials.oauth2_id === "1") {
        credInDB = true;
      }
    });
    if (credInDB === false) {
      const jsonToken =
      {
        "token": accessToken,
        "tokenSecret": refreshToken
      };
      db.insertDB("user_credentials", "user_id, oauth2_id, token", `'${user_id}', '1', '${JSON.stringify(jsonToken)}'`, function(result) {
        if (result === "KO") {
            return done(null, false);
        } else {
            return done(null, user);
        }
      });
    } else {
      return done(null, user);
    }
    /*create account or verify if already exists */
    // db.selectDB("users", "firstname", user.id, function (result) {
    //   if (result[0] === undefined) {
    //     db.insertDB("users", "name, firstname, mail, password", `'${user.display_name}', '${user.user_id.toString()}', '${user.mail}', ''`, function (result) {
    //       if (result === "KO")
    //         console.log("KO TAMER");
    //     });
    //   } else
    //     console.log("GIGA PROUT");
    // });
    // console.log("ok gg lul t co");
    // done(null, profile);
  }
));

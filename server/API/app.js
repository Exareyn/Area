const express = require('express');
const fs = require('fs');
const passport = require('passport');
const passportGoogleSetup = require("./Google/config/passport");
const passportTwitterSetup = require("./Twitter/config/passport-setup");
const passportDiscordSetup = require("./Discord/config/passport-setup");
const passportFacebookSetup = require("./Facebook/config/passport-setup");
const passportGithubSetup = require("./Github/config/passport-setup");
const session = require('express-session');
const authGoogleRoute = require("./Google/routes/auth");
const authTwitterRoutes = require("./Twitter/routes/auth-routes");
const authDiscordRoutes = require("./Discord/routes/auth-routes");
const authFacebookRoutes = require("./Facebook/routes/auth-routes");
const authGithubRoutes = require("./Github/routes/auth-routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const twitter = require("./twitter").default;
const discord = require("./discord").default;
const fb = require("./facebook");
const db = require("./db");
const trigger = require("./trigger");

const app = express();
const router = express.Router();

db.connectToDatabase();

// parse cookies
app.use(cookieParser());


// set up session cookies
app.use(session({secret: process.env.SESSION_SECRET || 'secret'}));
// initialize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());


// set up cors to allow us to accetp requests from our client
app.use(
    cors({
        origin: "http://localhost:8081",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);

app.listen(8080, () => {
    console.log('Server started on port 8080');
    setInterval(trigger.triggerTweetofUser, 1000 * 60 * 60);
    setInterval(trigger.triggerTweetofTrend, 1000 * 60 * 60);
});

app.use(express.json());

/************ TRIGGER ************/
/*                               */
/*       TRIGGER OMG BLQLQL      */
/*                               */
/************ TRIGGER ************/

// Make Trigger here
discord;

/************ REST API ************/
/*                                */
/*         Use of REST API        */
/*                                */
/************ REST API ************/

app.post('/login', (req, res) => {
    console.log(req.body);
    const mail = req.body.mail;
    const password = req.body.password;
    if (mail === '' || password === '') {
        res.status(400).json({
            message: "missing parameters"
        });
    } else {
        db.selectDB("users", "mail", mail, function (result) {
            console.log("result: ", result);
            if (result[0] !== undefined) {
                console.log("User found");
                console.log("password: ", password);
                console.log("result[0].password: ", result[0].password);
                if (result[0].password === password) {
                    console.log("User logged in");
                    res.status(200).json(`{ user_id: "${result[0].id}", error: "OK" }`);
                } else {
                    console.log("Wrong password");
                    res.status(401).json(`{error: "KO"}`);
                }
            } else {
                console.log("User not found");
            }
        });
    }
});

app.post('/register', (req, res) => {
    console.log(req.body);
    const name = req.body.username;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const password = req.body.password;
    db.insertDB("users", "name, firstname, mail, password", `'${name}', '${firstname}', '${mail}', '${password}'`, function (result) {
        if (result === "KO")
        res.status(200).json("{error: 'KO'}");
        else {
            db.selectLastDB("users", "id", function(result) {
                res.status(200).json(`{id: "${result[0].id}", username: "${name}", error: "OK"}`);
            });
        }
    });
});

app.post('/area', (req, res) => {
    console.log(req.body);
    const user_id = req.body.user_id;
    const title = req.body.title;
    const action_id = req.body.action_id;
    const reaction_id = req.body.reaction_id;
    const loaded_data = JSON.stringify(req.body.loaded_data);

    db.insertDB("area", "user_id, title, action_id, reaction_id, loaded_data", `'${user_id}', '${title}', '${action_id}', '${reaction_id}', '${loaded_data}'`, function(result) {
        if (result === "KO") {
            res.status(200).json("{error: 'KO'}");
        } else {
            res.status(200).json("{error: 'OK'}");
        }
    });
});

app.post('/area/update', (req, res) => {
    console.log(req.body);
    const user_id = req.body.user_id;
    console.log("user_id: " + user_id);
    db.selectDB("area", "user_id", `${user_id}`, function(result) {
        if (result === "KO") {
            res.status(200).json("{error: 'KO'}");
        } else {
            res.status(200).json(result);
        }
    });
});

app.post('/area/delete', (req, res) => {
    console.log(req.body);
    const id = req.body.id;

    db.deleteDB("area", "id", `${id}`, function(result) {
        if (result === "KO") {
            res.status(200).json("{error: 'KO'}");
        } else {
            res.status(200).json("{error: 'OK'}");
        }
    });
});

app.post('/area/dashboard', (req, res) => {
    res.send(req.body);
});

app.get('/', (req, res) => {
    res.send('!');
});

app.get('/about.json', (req, res) => {
    fs.readFile('about.json', (err, data) => {
        res.status(200).json({
            "client": {
                "host": "10.101.53.35"
            },
            "server": {
                "current_time": Date.now(),
                "services": [
                    {
                        "name": "facebook",
                        "actions": [
                        ],
                        " reactions ": [
                            {
                                " name ": "send_post",
                                " description ": "send a post on your facebook page"
                            }
                        ]
                    },
                    {
                        "name": "twitter",
                        "actions": [
                            {
                                "name": "getlasttweet",
                                "description": "get the last tweet from a given account"
                            },
                            {
                                "name": "gettopic",
                                "description": ""
                            }
                        ],
                        "reactions": [
                            {
                                "name": "send_tweet",
                                "description": "send a tweet on your twitter account"
                            },
                            {
                                "name": "retweet",
                                "description": "retweet last tweet from action 1 or 2"
                            }
                        ]
                    },
                    {
                        "name": "discord",
                        "actions": [],
                        "reactions": [
                            {
                                "name": "send_message",
                                "description": "send a message on your discord server"
                            }
                        ]
                    },
                    {
                        "name": "github",
                        "actions": [
                            {
                                "name": "getlastcommit",
                                "description": "get the last commit from a given repository"
                            }
                        ],
                        "reactions": []
                    },
                    {
                        "name": "google",
                        "actions": [],
                        "reactions": [
                            {
                                "name": "add_event",
                                "description": "add an event on your google calendar"
                            }
                        ]
                    }
                ]
            }
        });
    });
});

////////// TWITTER //////////

app.get('/twitter/:username/tweets', async (req, res) => {
    const response = await twitter.getTweetofUser(req.params.username);
    res.send({data: response});
});

app.get('/twitter/trigger/:username/tweets', (req, res) => {
    const trigger = trigger_twitter_new_tweet(req.params.username);
    if (trigger)
    res.send("OK");
    else
    res.send("KO");
});

////////// FACEBOOK //////////

fb.getUserInfo();

// set up routes
app.use("/auth", authTwitterRoutes);
app.use("/auth", authDiscordRoutes);
app.use("/auth", authFacebookRoutes);
app.use("/auth", authGithubRoutes);

////////// GOOGLE //////////
app.use("/auth", authGoogleRoute, (err, req, res, next) => {
    console.log(err.message, err.code, err.uri, err.status);
    next(err);
});
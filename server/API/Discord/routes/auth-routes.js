const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:8081/dashboard";
const db = require("../../db");

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

// when logout, redirect to client
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
// app.get('/discord', passport.authenticate('discord'));
router.get("/discord/redirect/:user_id", (req, res, next) => {
    req.session.state = JSON.stringify(req.params);
    passport.authenticate('discord',
        {
            state: JSON.stringify(req.params)
        }
    )(req, res, next);
});

router.get(
    "/discord/redirect",
    passport.authenticate('discord', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: "/auth/login/failed"
    })
);

router.post("/discord/is_logged_in", (req, res) => {
    db.selectDB("user_credentials", "user_id", req.body.user_id, function (result) {
        let success = false;
        for (let i = 0; i < result.length; i++) {
            if (result[i].oauth2_id === 4) {
                success = true;
                res.json({
                    success: true,
                    message: "user has successfully authenticated",
                    user: result[i]
                });
                return;
            }
        }
        if (success === false) {
            res.json({
                success: false,
                message: "user failed to authenticate."
            });
            return;
        }
    });
})

module.exports = router;
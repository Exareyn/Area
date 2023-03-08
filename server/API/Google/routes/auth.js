const router = require("express").Router();
const passport = require("passport");
const db = require("../../db");

router.get("/login/success", (req, res) => {
    console.log("req.user: ", req.user);
    if(req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req,res) => {
    req.logout();
    res.redirect("http://localhost:8081/")
})

// router.get("/google", passport.authenticate("google", {scope: ['profile', 'email']}));
// router.get("/google/callback", passport.authenticate("google", {
//     successRedirect: "http://localhost:8081/dashboard",
//     failureRedirect: "/login/failed"
//     })
// );

router.get("/google/callback/:user_id", (req, res, next) => {
    req.session.state = JSON.stringify(req.params);
    passport.authenticate('google',
        {
            state: JSON.stringify(req.params)
        }
     )(req, res, next);
});

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:8081/dashboard",
        failureRedirect: "/auth/login/failed"
    })
);

router.post("/google/is_logged_in", (req, res) => {
    db.selectDB("user_credentials", "user_id", req.body.user_id, function (result) {
        let success = false;
        for (let i = 0; i < result.length; i++) {
            if (result[i].oauth2_id === 2) {
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
});

module.exports = router
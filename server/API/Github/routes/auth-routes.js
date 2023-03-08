const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:8081/dashboard";
const db = require("../../db");

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(CLIENT_HOME_PAGE_URL);
  }
);

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  console.log("req.user: ", req.user);
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

// auth with github
router.get("/github/redirect/:user_id", (req, res, next) => {
  req.session.state = JSON.stringify(req.params);
  passport.authenticate('github',
      {
          state: JSON.stringify(req.params)
      }
   )(req, res, next);
 });

// redirect to home page after successfully login via github
router.get(
  "/github/redirect",
  passport.authenticate("github", {
      successRedirect: CLIENT_HOME_PAGE_URL,
      failureRedirect: "/auth/login/failed"
  })
);

router.post("/github/is_logged_in", (req, res) => {
  db.selectDB("user_credentials", "user_id", req.body.user_id, function (result) {
      let success = false;
      for (let i = 0; i < result.length; i++) {
          if (result[i].oauth2_id === 5) {
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

module.exports = router;
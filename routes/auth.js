const express = require("express"),
  passport = require("passport"),
  User = require("../models/user"),
  middleware = require("../middleware/index"),
  router = express.Router();

// Register
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Quickbites " + user.username);
      res.redirect("/hotels");
    });
  });
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/hotels",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out !");
  res.redirect("/hotels");
});

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("index", { page: "index" });
});

module.exports = router;

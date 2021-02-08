var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
var User = require("../models/user");

var passport = require("passport");
var authenticate = require("../authenticate");

const cors = require("./cors");
router.use(bodyParser.json());
/* GET users listing. */

router.options("*", cors.corsWithOption, (req, res) => {
  res.sendStatus(200);
});

router
  .route("/")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      User.find({}).then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      });
    }
  );

router
  .route("/facebook/token")
  .get(passport.authenticate("facebook-token"), (req, res) => {
    if (req.user) {
      let token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "applicaiton/json");
      res.json({
        success: true,
        token: token,
        status: "You successfully login",
      });
    }
  });

router
  .route("/signup")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOption, (req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.json({ err: err });
        } else {
          if (req.body.firstName) {
            user.firstName = req.body.firstName;
          }
          if (req.body.lastName) {
            user.lastName = req.body.lastName;
          }

          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json");
              res.json({ err: err });
            } else {
              passport.authenticate("local")(req, res, () => {
                res.statusCode = 200;
                res.setHeader("content-type", "application/json");
                res.json({ success: true, status: "Registration Successful" });
              });
            }
          });
        }
      }
    );
  });

router.post("/login", cors.corsWithOption, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: "Login Successful!", token: token });
    });
  })(req, res, next);
});

router.get("/checkJWTtoken", cors.corsWithOption, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

router
  .route("/logout")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOption, (req, res, next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("session-id");
      res.redirect("/");
    } else {
      let err = new Error("You are not logged in!");
      err.status = 401;
      next(err);
    }
  });

module.exports = router;

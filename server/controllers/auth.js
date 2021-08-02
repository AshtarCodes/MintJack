const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");


exports.postLogin = async (req, res, next) => {
  console.log(req.body.email, req.body.password)
  // try{
  //   const user = await User.find({'email': req.body.email})
  //   // console.log(user)
  //   res.json(user)
  //   }
  // catch(err){
  //     console.log(err)
  // }

  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      console.log('success')
      res.json(user)
      // res.redirect(req.session.returnTo);
    });
  })(req, res, next);

};

exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.postSignup = async (req, res, next) => {
  console.log(req.body)

  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    // return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
    
  try{


    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      totalMoney: 1000,
      timesBorrowed: 0,
      country: req.body.country

    });

    User.findOne(
        { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
        (err, existingUser) => {
          if (err) {
            return next(err);
          }
          if (existingUser) {
            req.flash("errors", {
              msg: "Account with that email address or username already exists.",
            });
            // return res.redirect("../signup");
          }
          user.save((err) => {
            if (err) {
              alert ('There was an error saving your user.')
              return next(err);
            }
          req.logIn(user, (err) => {
              if (err) {
                alert('There was a problem logging in.')
                return next(err);
              }
            });
          });
        }
      );
      res.json(user)
    }
    catch(err){
      console.log(err)
    }
};
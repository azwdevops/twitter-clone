const User = require("../models/userModel");

const bcrypt = require("bcrypt");

module.exports.renderRegisterForm = (req, res, next) => {
  res.status(200).render("register");
};
module.exports.register = async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password; // don't trim password since user may choose to have space in their password

  const payload = req.body;

  if (firstName && lastName && username && email && password) {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      res.status(200).render("register", payload);
    });
    if (user == null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      // no user was found
      User.create({
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      }).then((user) => {
        req.session.user = user;
        return res.redirect("/");
      });
    } else {
      // user found
      if (email == user.email) {
        payload.errorMessage = "Email already in use";
      } else {
        payload.errorMessage = "Username already in use";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Error, make sure all fields have valid values";
    res.status(200).render("register", payload);
  }
};
module.exports.renderLoginForm = (req, res, next) => {
  res.status(200).render("login");
};
module.exports.login = async (req, res, next) => {
  const payload = req.body;

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const user = await User.findOne({ username }).catch((err) => {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      return res.status(200).render("login", payload);
    });
    if (!user) {
      payload.errorMessage = "Invalid login credentials";
      return res.status(200).render("login", payload);
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log("####################");
    if (!validPassword) {
      payload.errorMessage = "Invalid login credentials";
      return res.status(200).render("login", payload);
    }
    // if all is okay, log the user in
    req.session.user = user;
    return res.redirect("/");
  } else {
    payload.errorMessage = "Username or email and password are required";
    return res.status(200).render("login", payload);
  }
};

module.exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};

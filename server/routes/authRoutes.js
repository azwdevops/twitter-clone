const express = require("express");
// const app = express();
const router = express.Router();
const {
  renderRegisterForm,
  register,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/authController");

// app.set("view engine", "pug");
// app.set("views", "views");

router.get("/login", renderLoginForm);
router.post("/login", login);

router.get("/register", renderRegisterForm);

router.post("/register", register);

router.get("/logout", logout);

module.exports = router;

require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const middleware = require("./middleware");
const authRoute = require("./routes/authRoutes");
const postsAPIRoutes = require("./routes/api/postRoutes");

// connect to the database
require("./dbConnect");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

// api routes
app.use("/api/posts", postsAPIRoutes);

// routes
app.use("", authRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user), // to be used on frontend
  };
  res.render("home", payload);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

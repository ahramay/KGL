const express = require("express");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const ejs = require("ejs");
const cors = require('cors');
const MongoDBStore = require("connect-mongodb-session")(session);
const stripe = require("stripe")(process.env.Stripe_Secret_key);

const store = new MongoDBStore({
  uri: process.env.DB,
  collection: "loginsessions",
});

const app = express();

app.use(express.static("public"));
// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// enable cors
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const { exceptionHandler } = require("./middlewares/errors");
app.use(exceptionHandler);

const routeRegisterer = require("./startup/routes");
routeRegisterer(app);

require("./startup/db")();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Your Server is up and running on PORT :: ${port}`);
});

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

// Requiring Models
const Hotel = require("./models/hotel"),
  Comment = require("./models/comment"),
  User = require("./models/user");

// Requiring Routes
const hotelRoutes = require("./routes/hotels"),
  commentRoutes = require("./routes/comments"),
  authRoutes = require("./routes/auth");

//EJS
app.set("view engine", "ejs");

// Body-Parser (now built-in with express)
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static("public"));

// Moment JS
app.locals.moment = require("moment");

// method-override
app.use(methodOverride("_method"));

// Flash
app.use(flash());

// Mongoose
mongoose.connect('mongodb://localhost/time', {useNewUrlParser:true,useUnifiedTopology: true });
mongoose.connection
.once('open',()=>console.log('coonected'))
.on('error', error =>{
    console.log('chutiya',error);
});

// Passport Config
app.use(
  require("express-session")({
    secret: "Don't store password as plain text!!!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passing currentUser on all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);
app.use(authRoutes);

app.listen(2000,function(){
  console.log('we are on');
});

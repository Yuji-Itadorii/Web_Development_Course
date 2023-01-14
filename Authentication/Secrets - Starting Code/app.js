//Constants ***************************************************

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

// App Uses ***********************************************

app.use(
  session({
    secret: "AbhayRawat.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.set("view engine", "ejs");

//Mongoose Connection *******************************************************

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// mongoose Schema **********************************************************

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

// mongosse Mondel **********************************************************

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// All Get Request **********************************************************

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.redirect("/login");
  }
});

app.get("/logout" , (req, res , next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
  });
  res.redirect("/");
  
});


// All Post Request **********************************************************


app.post("/register", (req, res) => {
  User.register({username : req.body.username} , req.body.password , ( err , user)=>{
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req , res , function(){
          res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", (req, res) => {

  const user = new User({
    username : req.body.username,
    password : req.body.password
  });

  req.login(user , (err)=>{
    if(err){
      console.log(err);
      res.redirect("/login");
    }
    else{
      passport.authenticate("local")(req , res , function(){
        res.redirect("/secrets");
      });
    }
  });

});




// App Listening ************************************************************

app.listen(port, () => {
  console.log("Starting at http://localhost:3000");
});

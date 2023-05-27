require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000 || process.env.PORT;
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.use(
  session({
    secret: process.env.SECRET,
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

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/MarketDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  address: String,
  role: String,
});

const manufacture_order = new mongoose.Schema({
  Oder_id: String,
  To: String,
  From: String,
  Quantity: Number,
  Address: String,
  Transporter: String,
  Price: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Morder = new mongoose.model("Morder", manufacture_order);

// passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("Registration");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/search_m", (req, res) => {
  const flag = req.body.option;
  if (flag == "Oder_id") {
    Morder.find({Oder_id : req.body.find_this}).then(result=>{
        if(result){
            res.render("Dashboard_m" , {All_objects : result});
        }
        else{
            res.send("Not found");
        }
    })
  } else if(flag == "To") {
    Morder.find({To : req.body.find_this}).then(result=>{
        if(result){
            res.render("Dashboard_m" , {All_objects : result});
        }
        else{
            res.send("Not found");
        }
    })
  }
  else if(flag == "From"){
    Morder.find({From : req.body.find_this}).then(result=>{
        if(result){
            res.render("Dashboard_m" , {All_objects : result});
        }
        else{
            res.send("Not found");
        }
    })
  }
  else{
    res.send("Not found");
  }

});

app.post("/search_t", (req, res) => {
    const flag = req.body.option;
    if (flag == "Oder_id") {
      Morder.find({Oder_id : req.body.find_this}).then(result=>{
          if(result){
              res.render("Dashboard_t" , {All_objects : result});
          }
          else{
              res.send("Not found");
          }
      })
    } else if(flag == "To") {
      Morder.find({To : req.body.find_this}).then(result=>{
          if(result){
              res.render("Dashboard_t" , {All_objects : result});
          }
          else{
              res.send("Not found");
          }
      })
    }
    else if(flag == "From"){
      Morder.find({From : req.body.find_this}).then(result=>{
          if(result){
              res.render("Dashboard_t" , {All_objects : result});
          }
          else{
              res.send("Not found");
          }
      })
    }
    else{
      res.send("Not found");
    }
  
  });

app.get("/fill_manufacture", (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ role: "transporter" }).then((result) => {
      if (result) {
        res.render("Manufacture_form", { List: result });
      } else {
        console.log("Not found" + result);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/fill_tranporters", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("Transporters_form");
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard_manufacture", (req, res) => {
  if (req.isAuthenticated()) {
    Morder.find().then((result) => {
      if (result) {
        res.render("Dashboard_m", { All_objects: result });
      } else {
        res.send("Error");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard_transport", (req, res) => {
  if (req.isAuthenticated()) {
    Morder.find().then((result) => {
      if (result) {
        res.render("Dashboard_t", { All_objects: result });
      } else {
        res.send(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", (req, res) => {
  const flag = req.body.option;
  let userRole = "";
  if (flag == "manufacture") {
    userRole = "manufacture";
  } else {
    userRole = "transporter";
  }

  User.register(
    new User({
      firstName: req.body.fname,
      lastName: req.body.lname,
      username: req.body.email,
      password: req.body.password,
      address: req.body.phone,
      role: userRole,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          if (userRole == "manufacture") {
            res.redirect("/dashboard_manufacture");
          } else if (userRole == "transporter") {
            res.redirect("/dashboard_transport");
          } else {
            res.send("User not found!!");
          }
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.email,
    password: req.body.password,
  });

  const flag = req.body.option;
  let userRole = "";
  if (flag == "manufacture") {
    userRole = "manufacture";
  } else {
    userRole = "transporter";
  }

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function () {
        if (userRole == "manufacture") {
          res.redirect("/dashboard_manufacture");
        } else if (userRole == "transporter") {
          res.redirect("/dashboard_transport");
        } else {
          res.send("User not found!!");
        }
      });
    }
  });
});

app.post("/fill_manufacture", (req, res) => {
  const newOrder = new Morder({
    Oder_id: req.body.order_id,
    To: req.body.to,
    From: req.body.from,
    Quantity: req.body.quantity,
    Address: req.body.address,
    Transporter: req.body.transporter,
    Price: "--",
  });

  newOrder.save().then((err) => {
    if (!err) {
      console.log(err);
      res.send(err);
    } else {
      res.redirect("/dashboard_manufacture");
      console.log("Successfully Added Product !");
    }
  });
});

app.route("/fill_tranporters/").post((req, res) => {
  const order_id = req.body.order_id;
  const price_value = req.body.price;

  console.log(order_id + " " + price_value);

  Morder.findOne({ Oder_id: order_id }).then((result) => {
    if (result) {
      // console.log(result);
      result.price = price_value;
      result.save().then();
      res.redirect("/dashboard_transport");
    } else {
      res.send("Failed" + result);
    }
  });
});

app.listen(port, () => {
  console.log("Starting http://localhost:3000");
});

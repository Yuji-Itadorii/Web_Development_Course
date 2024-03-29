//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//mongoose

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  post: {
    type: String,
    require: true,
  },
});

const Post = mongoose.model("Post", blogSchema);

const posts = [];

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      res.render("home", { homeContent: homeStartingContent, newPost: posts });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutText: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactText: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;
  
  Post.findOne({ _id : requestedId} , (err , post)=>{
    if(!err){
      res.render("post", { title: post.title, content: post.post });
    }
  });
});

app.post("/compose", (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    post: req.body.content,
  });

  newPost.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Listening to http://localhost:${port}`);
});

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticle) => {
      if (err) {
        res.send("Article not found!!");
      } else {
        res.send(foundArticle);
      }
    });
  })
  .post((req, res) => {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully Added article !!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Sucessfully Deleted all articles !!");
      } else {
        res.send(err);
      }
    });
  });

  ////////////////////////////////////Requesting a specific Article/////////////////////////////////////////

  app.route('/articles/:articleTitle')
     .get((req , res)=>{
        Article.findOne( {title : req.params.articleTitle}, (err , foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("No article found!!");
            }
        });

     })

     .put((req,res)=>{
        Article.updateOne({title : req.params.articleTitle} ,
                        { $set :  { title : req.body.title , content : req.body.content} }, 
                          {overwrite : true},
                          (err)=>{
                            if(!err){
                                res.send("Sucessfully Updated !!");
                            }
                            else{
                                res.send("Failed !!");
                            }
                          });
     })

     .patch((req , res)=>{
        Article.updateOne({title : req.params.articleTitle} ,
            { $set :  req.body }, 
              (err)=>{
                if(!err){
                    res.send("Sucessfully Updated !!");
                }
                else{
                    res.send("Failed !!");
                }
              });

     })

     .delete((req, res)=>{
        Article.deleteOne(
            {title : req.params.articleTitle},
            (err) => {
            if (!err) {
              res.send("Sucessfully Deleted the article !!");
            } else {
              res.send(err);
            }
          });

     });



app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(port, () => {
  console.log(`Starting on http://localhost:${port}`);
});

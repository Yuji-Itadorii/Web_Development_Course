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

mongoose.connect("mongodb://localhost:27017/productDB", { useNewUrlParser: true });

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    description : String,
    price : String,
});

const Product = mongoose.model("Product", productSchema);

app.route("/product")
  .get((req, res) => { 
    Product.find().then((foundProduct, err) => {
      if (err) {
        res.send("Product not found");
      } else {
        res.send(foundProduct);
      }
    });
  })
  .post((req, res) => {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newProduct = new Product({
      id: req.body.id,
      name: req.body.name,
      description : req.body.description,
      price : req.body.price,
    });

    newProduct.save().then((err) => {
      if (!err) {
        res.send("Successfully Added Product !!");
      } else {
        res.send(err);
      }
    });
  });

  ////////////////////////////////////Requesting a specific Product/////////////////////////////////////////

  app.route('/Products/:ProductID')
     .get((req , res)=>{
        Product.findOne().then( {id : req.params.ProductID}, (foundProduct, err)=>{
            if(foundProduct){
                res.send(foundProduct);
            }
            else{
                res.send("No Product found!!");
            }
        });

     })

     .put((req,res)=>{
        Product.updateOne().then({id : req.params.ProductID} ,
                        { $set :  { price : req.body.price} }, 
                          {overwrite : true},
                          (err)=>{
                            if(!err){
                                res.send("Sucessfully Updated !!");
                            }
                            else{
                                res.send("Failed !!");
                            }
                          });
     });



app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(port, () => {
  console.log(`Starting on http://localhost:${port}`);
});

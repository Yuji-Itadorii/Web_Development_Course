const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const day = require(path.join(__dirname , "date.js"));


var items = [];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.get('/' , (req , res)=>{

    res.render("list" , {key : day , newItem : items});
});

app.post('/' , (req ,res)=>{
    let item = req.body.item;
    items.push(item);
    res.redirect('/');
});

app.listen(port , ()=>{
    console.log(`Starting http://localhost:${port}`);
});
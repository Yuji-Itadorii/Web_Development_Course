const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
const port = 3000;

app.get('/' , (req , res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post('/' , (req , res)=>{
    let number1 = parseInt(req.body.num1); 
    let number2 = parseInt(req.body.num2);
    let result = number1+number2;
    res.send("The addition of two number is :- "+ result);
})


app.listen(port , ()=>{
    console.log(`Started the port:- ${port}. . . . `);
})
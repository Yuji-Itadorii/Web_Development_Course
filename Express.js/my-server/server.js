const express = require('express');
const app = express();
const port  =  process.env.PORT || 3000;

var arr = [
    {id: 1 , name:"Abhay"},
    {id: 2 , name:"Developer"}
];

//Simple ************************************************

app.get( '/' , (request , response) =>{
    response.send("<h1>Hello World !!</h1>");
});

// for diffrent pages************************************

app.get('/contact' , (req , res)=>{
    res.send('Conatct me at <a href="mailto:to@gmail.com">Click Me</a>');
});

app.get('/about' , (req ,res)=>{
    res.send('Hello My name is <em>Abhay rawat</em>.');
});

//Sending a parameter ***********************************

app.get('/course' , (req , res)=>{
    res.send(arr);
})
app.get('/course/:id' , (req , res)=>{
    const course = arr.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("<h1>This course is not available</h1>");
    }
    else{
        res.send(course);
    }
});

//Post method ********************************************

// app.post();

app.listen(port , ()=>{
    console.log(`Listening the port :- http://localhost:${port} . . . .` );
})
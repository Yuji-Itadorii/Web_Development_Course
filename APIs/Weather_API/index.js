const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const https = require('node:https');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
const port = 3000 || process.env.PORT ;

app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , 'index.html'));
});

app.post('/' , (req , res)=>{
    const city = req.body.cityName;
    const id = req.body.appID;
    const unit = req.body.unit;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}&units=${unit}`;
    https.get(url , (response)=>{
        response.on('data' , (data)=>{
            const weatherData = JSON.parse(data);
            var tempature = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.write(`<h1><img src="${imgUrl}"></h1>`);
            res.write("<h1>The temperatur in "+city+" is "+tempature+" degree Celcius</h1>");
            const des = weatherData.weather[0].description;
            res.write(des);
            res.send();
        });
    });
});

app.listen( port , ()=>{
    console.log(`Starting http://localhost:${port}  ....`);
});

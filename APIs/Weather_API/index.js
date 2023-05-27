const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const https = require('node:https');
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('368bed03d1214ec585ebaa42ff2ec9a3');
app.use(bodyParser.urlencoded({extended : true}));
const port = 3000 || process.env.PORT ;

app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , 'index.html'));
});

app.post('/' , (req , res)=>{
    const city = "London";
    const id = "cbf83c3b4a317a6157a34b09e21591a1";
    const unit = "metric";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}&units=${unit}`;
    https.get(url , (response)=>{
        response.on('data' , (data)=>{
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            res.send();
        });
    });

    const messa = "Hello";
    const url1 = `https://api.monkedev.com/fun/chat?msg=${messa}` ;
    https.get(url1 , (response)=>{
        response.on('data' , (data)=>{
            const joke = JSON.parse(data);
            console.log(joke);
            res.send();
        });
    });

    // newsapi.v2.sources({
    //     category: 'technology',
    //     language: 'en',
    //     country: 'us'
    //   }).then(response => {
    //     console.log(response);
    //     /*
    //       {
    //         status: "ok",
    //         sources: [...]
    //       }
    //     */
    //   });

    // const url2 = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=368bed03d1214ec585ebaa42ff2ec9a3' ;
    // https.get(url2 , (response)=>{
    //     response.on('data' , (data)=>{
    //         const news = JSON.parse(data);
    //         console.log(news);
    //         res.send();
    //     });
    // });
});

app.listen( port , ()=>{
    console.log(`Starting http://localhost:${port}  ....`);
});

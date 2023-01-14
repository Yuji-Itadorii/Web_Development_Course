const http = require('http');

const server = http.createServer(function (req , res){
    if(req.url === '/'){
        res.write("Hello costermer");
        res.end();
    }
    if(req.url === '/api/course'){
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
});

// Listerner

// server.on("connection" , (socket)=>{
//     console.log('New Connention ...')
// })


// raiser

server.listen(3000);
console.log('listerning server 3000...');
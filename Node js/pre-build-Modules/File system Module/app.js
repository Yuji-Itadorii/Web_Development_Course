const fs = require('fs');

// let read_directory = fs.readdirSync('./');
// console.log(read_directory);

let read_directory = fs.readdir('./' , function(err , file){
    if(err){
        console.log("error :-"+ err);
    }
    else{
        console.log("Results :- " , file);
    }
});
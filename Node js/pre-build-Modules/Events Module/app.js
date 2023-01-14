//Note :- EventEmitter is a class

const EventEmitter = require('events');

const emitter  = new EventEmitter();


// An raised event Listerner 

emitter.on("messageLoger" , function(arg){
    console.log("Listener Called !!!");
    console.log(arg.id);
    console.log(arg.url);
    console.log(arg.name);
});


//An event raiser

emitter.emit('messageLoger' , {id : 1 , name : 'Abhay' , url : 'htttps:///'});
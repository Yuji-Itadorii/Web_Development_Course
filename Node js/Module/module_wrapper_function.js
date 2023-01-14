(function(exports , require , module , __filename , __dirname){

    function log(message){
        //any function 
        console.log(message);
    }
    
    //Important    
    // module.exports.wrapper_log = log;
    
    //OR

    exports.wrapper_log = log;
    

})
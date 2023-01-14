

    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today  = new Date();
    let day = today.toLocaleDateString("en-US" , options) ;

module.exports = day;
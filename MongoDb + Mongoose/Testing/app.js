const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB" , { useNewUrlParser: true });

const fruitSchema = new mongoose.Schema({
    name : String,
    rating : {
        type : Number,
        min : 1 ,
        max : 10
    },
    review : String
});

const Fruit = mongoose.model("Fruit" , fruitSchema);

// const fruit = new Fruit(
//     {
//         name : "Apple",
//         rating : 1,
//         review : "Pretty Awsesome !!"
//     }
// );
// const orange = new Fruit(
//     {
//         name : "orange",
//         rating : 10,
//         review : "Pretty !!"
//     }
// );
// const banana = new Fruit(
//     {
//         name : "Banana",
//         rating : 3,
//         review : "Awsesome !!"
//     }
// );

Fruit.find((err , fruit)=>{
    if(err){
        console.log("Error");
    }
    else{
        mongoose.connection.close();
        fruit.forEach((obj)=>{
                console.log(obj.name);
        });
    }
})
// fruit.save();
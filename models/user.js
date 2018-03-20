
const mongoose                 = require("mongoose"),
     bcrypt                      =require("bcryptjs");

const userSchema = new mongoose.Schema({
    username:String,
    fname: String,
    lname: String,
    phone:String,
    email:String,
    age:String,
    city:String,
    license:String,
    usertype   : String,
    verified : Boolean, //this field works as flag for driving license approval
    bookedcar : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "car"

    }],
    blocked : Boolean ,
    password:String// this field gives facility to admin to block a user
});

// const userSchema = new mongoose.Schema({
//     username : String,
//     password : String
// });


module.exports = mongoose.model("User", userSchema);


module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
    }
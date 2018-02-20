
const mongoose                 = require("mongoose"),
      passportLocalMongoose    = require("passport-local-mongoose");

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
    blocked : Boolean  // this field gives facility to admin to block a user
});

// const userSchema = new mongoose.Schema({
//     username : String,
//     password : String
// });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

const mongoose  = require("mongoose");


const carSchema = new mongoose.Schema({
    price   : String,
    rate    : String,
    city    : String,
    name    : String,
    number  : String,
    image   : String,
    available : Boolean,
    category : String
});


module.exports = mongoose.model("car",carSchema);
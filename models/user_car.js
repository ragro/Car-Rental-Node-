const mongoose = require("mongoose");

const usercar = new  mongoose.Schema({
    userid:[String],
    carid:[String]
});

module.exports = mongoose.model("usercar",usercar);
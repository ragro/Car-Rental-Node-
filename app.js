
const   express       = require("express"),
        app           = express(),
        bodyParser    = require("body-parser"),
        cors          = require("cors"),
        mongoose      = require("mongoose"),
        passport      = require("passport"),
        User          = require("./models/user"), 
        Car           = require("./models/car"),
        JwtStrategy   = require('passport-jwt').Strategy,
        ExtractJwt    = require('passport-jwt').ExtractJwt,
        jwt           = require('jsonwebtoken');
  
mongoose.connect("mongodb://rohitraghav:14cs75@ds143778.mlab.com:43778/mericar");



app.use(cors());
app.use(bodyParser.json());

//passport configuration

app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);
// method of passport-local for checking username and password as authenticate method of passportlocal 
    // takes username and password from request and checks it with username and hashed version of password
    // in database 




const userRoutes           = require("./routes/user"),
      adminRoutes          = require("./routes/admin"),
      carRoutes            = require("./routes/car");

app.use("/user",userRoutes);
app.use("/admin",adminRoutes);
app.use("/car",carRoutes);

//====================================================================
//Routes
//====================================================================


app.listen(process.env.PORT||8081, function(){
    console.log("Server Connected");
});


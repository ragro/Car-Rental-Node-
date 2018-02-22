
const   express       = require("express"),
        app           = express(),
        bodyParser    = require("body-parser"),
        flash         = require("connect-flash"),
        LocalStrategy = require("passport-local"),
        mongoose      = require("mongoose"),
        methodOverride= require("method-override"),
        passport      = require("passport"),
        User          = require("./models/user"), 
        Car           = require("./models/car");
  
// mongoose.connect("mongodb://rohitraghav:14cs75@ds143778.mlab.com:43778/mericar");
mongoose.connect("mongodb://localhost/mericar");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded( { extended : true } ) );
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//passport configuration
app.use(require("express-session")({
    secret: "Let's hire a car",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()) );  // this line makes pasaport to use authenticate
    // method of passport-local for checking username and password as authenticate method of passportlocal 
    // takes username and password from request and checks it with username and hashed version of password
    // in database 


    app.use(flash()); //configuring flash-connect package

    app.use(function(req, res, next){
        res.locals.currentUser    =  req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

const userRoutes           = require("./routes/user"),
      adminRoutes          = require("./routes/admin"),
      carRoutes            = require("./routes/car");

app.use("/user",userRoutes);
app.use("/admin",adminRoutes);
app.use("/car",carRoutes);

//====================================================================
//Routes
//====================================================================
    app.get("/",function(req, res){
        res.render("index");
    });


    //   ================================
    //   Routes for Admin Authentication
    //   ================================

//       app.get("/login", function(req, res){
//         res.render("admin/login")
//   });
  

//   app.post("/login",passport.authenticate("local",{
        
//         successRedirect :"/dashboard", //it is path of route not a file
//         failureRedirect : "/login"
//     }),function(req, res){});
    
//   app.get("/register", function(req, res){
//         res.render("admin/register");
//   });

//   app.post("/register", function(req, res){
//         var newAdmin = new admin({
//               username : req.body.username
//         });

//         admin.register(newAdmin, req.body.password, function(err, user){
//               if(err){
//                   console.log(err.message);
//                   return res.render("admin/register");
//               }
  
//               passport.authenticate("local")(req, res, function(){  // this method logs in user 
//                       return res.redirect("/dashboard");
//               });
//       });

//   });

//   app.get("/dashboard", function(req, res){
//              res.render("admin/dashboard");
//   });
 //===========================
 //===========================   
 //Routes for car addition
    
    // app.get("/addcar", function(req, res){
    //      res.render("car/carform");   
    // });

    // app.get("/showcar", function(req, res){
    //     Car.find(function(err, foundCar){
    //         if(err){
    //             return res.redirect("/");
    //         }  
    //         else{
    //             console.log(foundCar);
    //             res.render("car/show",{car:foundCar});
    //         }
    //     });
    // });

    // app.post("/addcar", function(req, res){
    //     var newCar = new Car({
    //             name   : req.body.name,
    //             image  : req.body.image,
    //             price  : req.body.price,
    //             number : req.body.number,
    //             city   : req.body.city
    //     });

    //     Car.create(newCar, function(err, addedCar){
    //             if(err){
    //                 console.log(err.message);
    //                 return res.redirect("/addcar");
    //             }else{
    //                 return res.redirect("/addcar");
    //             }
    //     });
    // });

//Starting Server

app.listen(process.env.PORT||3003, function(){
    console.log("Server Connected");
});


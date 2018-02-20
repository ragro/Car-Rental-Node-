
const express    = require("express"),
      passport   = require("passport"),
      router     = express.Router(),
      User       = require("../models/user"),
      car        = require("../models/car"),
      middleware = require("../middleware/middleware");
//=================================
//Routes for User Authentication
//=================================


router.get("/", function(req, res){
    res.render("user/userindex");
});

//route for login form
router.get("/login", function(req, res){
    res.render("user/login");
});

//route for login form handling
router.post("/login", passport.authenticate("local",{
    successRedirect :"/user/dashboard",
    failureRedirect : "/user/login"
}),function(req, res){});



//route for register form
router.get("/register",function(req, res){
       res.render("user/register");        
});

//route to handle register form
router.post("/register", function(req, res){
    var newUser = new User({
        username : req.body.username,
        fname    : req.body.fname,
        lname    : req.body.lname,
        phone    : req.body.phone,
        email    : req.body.email,
        age      : req.body.age,
        city     : req.body.city,
        license  : req.body.license,
        usertype     : "user",
        verified : false,
        blocked : false
    });    

    User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err.message);
                return res.render("user/register");
            }

            passport.authenticate("local")(req, res, function(){  // this method logs in user 
                    res.redirect("/user/dashboard");
            });
    });
});

//route for dashboard
router.get("/dashboard",middleware.isLoggedIn,function(req,res){
    res.render("user/dashboard");
});

//route for logout
router.get("/logout",middleware.isLoggedIn, function(req, res){
    req.flash("success","Logged you Out");
    req.logout();
    res.redirect("/");
});

//route to show all users
router.get("/showUsers", function(req, res){
    User.find(function(err, foundUsers){
        if(err){
            res.flash("error", err.message);
            return res.redirect("back");
        }else{
            res.render("admin/showUser", {users: foundUsers});
        }
    });
});


//================================================
//Middlewares
//================================================

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//        return next();
//     }
//     res.redirect("/user/login");
// };
module.exports = router;
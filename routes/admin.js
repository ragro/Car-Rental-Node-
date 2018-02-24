

const express = require("express"),
      passport = require("passport"),
      router  = express.Router(),
      middleware = require("../middleware/middleware"),
      LocalStrategy = require("passport-local"),
      User      =  require("../models/user"); 

      
    //   passport.serializeUser(admin.serializeUser());
    //   passport.deserializeUser(admin.deserializeUser());
    //   passport.use(new LocalStrategy(admin.authenticate()) );


  router.get("/login",middleware.isalreadyLoggedin,function(req, res){
      res.render("admin/login");
  });
  
  //route for login form handling
  router.post("/login", middleware.isalreadyLoggedin, passport.authenticate("local",{
      successRedirect :"/admin/dashboard",
      failureRedirect : "/admin/login"
  }),function(req, res){});
  
  
  
//   //route for register form
//   router.get("/register",function(req, res){
//          res.render("admin/register");        
//   });
  
//   //route to handle register form
//   router.post("/register", function(req, res){
//       var newAdmin = new User({
//           username : req.body.username,
//           usertype     : "admin"
//       });    
  
//       User.register(newAdmin, req.body.password, function(err, user){
//               if(err){
//                   console.log(err.message);
//                   return res.render("admin/register");
//               }
  
//               passport.authenticate("local")(req, res, function(){  // this method logs in user 
//                       res.redirect("/admin/dashboard");
//               });
//       });
//   });
  
  //route for dashboard
  router.get("/dashboard", middleware.isAdmin,function(req,res){
      res.render("admin/dashboard");
  });
  
  //route for logout
  router.get("/logout",middleware.isLoggedIn, function(req, res){
    
    req.flash("success","Logged you Out");
      req.logout();
      res.redirect("/");
  });
    

  //route to show all users
router.get("/showUsers",middleware.isLoggedIn, function(req, res){
    User.find(function(err, foundUsers){
        if(err){
            res.flash("error", err.message);
            return res.redirect("back");
        }else{
            res.render("admin/showUser", {users: foundUsers});
        }
    });
});

  //route to show user needed to verify
  router.get("/verifyUser", middleware.isLoggedIn,middleware.isAdmin, function(req, res){
        User.find( function(err, foundUser){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }else{
                res.render("admin/verify", { users : foundUser })
            }
        });
  });
  

  //route to verify user's Driving license
  router.get("/verify/:userid",middleware.isLoggedIn, middleware.isAdmin,function(req, res){

        User.findById(req.params.userid, function(err, found){
            if(!found){
                req.flash("error",err.message);
                res.redirect("back");
            }else{
                found.verified = true;  //changes verified field to true
                found.save( function(err){ // saves in database
                    if(err){
                        req.flash("error", err.message);
                        res.redirect("back");
                    }else{
                        User.find(function(err, allUser){  // finds all user from database and send to verify file
                            res.render("admin/verify",{ users : allUser } );
                        });
                    }
                });
            }
        });        
  });


  // ROUTE TO BLOCK A USER, this route fetches user from db using id then changes block field to true
  // then it calls save function then it finds again all users from database
  // and attaches all users using a variable with renderes page  
  router.get("/block/:userid", middleware.isLoggedIn,middleware.isAdmin, function(req, res){

        User.findById(req.params.userid, function(err, foundUser){
            if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
            }else{
                foundUser.blocked = !(foundUser.blocked);
                console.log(foundUser);
                foundUser.save(function(err){
                    if(err){
                        req.flash("error",err.message);
                        res.redirect("back");
                    }else{
                            User.find(function(err,allUser){
                                res.render("admin/showUser",{users:allUser});
                            });
                    }                    
                });      
            }            
        });
  });

  //================================================
  //Middlewares
  //================================================
  
//   function isLoggedIn(req, res, next){
//       if(req.isAuthenticated()){
//          return next();
//       }
//       res.redirect("/admin/login");
//   };
  module.exports = router;

      //================================
      // Routes for Admin Authentication
      //================================

      // router.get("/login", function(req, res){
      //       res.render("admin/login")
      // });
      

      // router.post("/login", passport.authenticate("local",{
      //       successRedirect :"/admin/dashboard", //it is path of route not a file
      //       failureRedirect : "/admin/login"
      // }),function(req, res){});
        
      // router.get("/register", function(req, res){
      //       res.render("admin/register");
      // });

      // router.post("/register", function(req, res){
      //       var newAdmin = new admin({
      //             username : req.body.username
      //       });

      //       admin.register(newAdmin, req.body.password, function(err, user){
      //             if(err){
      //                 console.log(err.message);
      //                 return res.render("admin/register");
      //             }
      
      //             passport.authenticate("local")(req, res, function(){  // this method logs in user 
      //                     return res.redirect("/admin/dashboard");
      //             });
      //     });

      // });

      // router.get("/dashboard", function(req, res){
      //            res.render("admin/dashboard");
      // });

      // // router.get("/addcar", function(req, res){
      // //       res.send("Add car");
      // // });

      

      // module.exports = router;
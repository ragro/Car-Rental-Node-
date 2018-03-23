

const express = require("express"),
      passport = require("passport"),
      router  = express.Router(),
      middleware = require("../middleware/middleware"),
      User      =  require("../models/user"),
      bcrypt      =require("bcryptjs"),
      jwt         =require("jsonwebtoken");

  
    
  
    router.get("/showUsers", function(req, res){
        User.find(function(err, foundUsers){
            if(err){
                res.flash("error", err.message);
                console.log(err.message);
            }else{
                return res.json(foundUsers);
            }
        });
    });

  //route to show user needed to verify
  router.get("/verifyUser", function(req, res){
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
//   router.get("/verify/:userid",function(req, res){

//         User.findById(req.params.userid, function(err, found){
//             if(!found){
//                 req.flash("error",err.message);
//                 res.redirect("back");
//             }else{
//                 found.verified = true;  //changes verified field to true
//                 found.save( function(err){ // saves in database
//                     if(err){
//                         req.flash("error", err.message);
//                         res.redirect("back");
//                     }else{
//                         User.find(function(err, allUser){  // finds all user from database and send to verify file
//                             res.render("admin/verify",{ users : allUser } );
//                         });
//                     }
//                 });
//             }
//         });        
//   });



  //route to verify user's Driving license
//   router.get("/verify/:userid",function(req, res){

//         User.findById(req.params.userid, function(err, found){
//             if(!found){
//                 req.flash("error",err.message);
//                 res.redirect("back");
//             }else{
//                 found.verified = true;  //changes verified field to true
//                 found.save( function(err){ // saves in database
//                     if(err){
//                         req.flash("error", err.message);
//                         res.redirect("back");
//                     }else{
//                         User.find(function(err, allUser){  // finds all user from database and send to verify file
//                             res.render("admin/verify",{ users : allUser } );
//                         });
//                     }
//                 });
//             }
//         });        
//   });

router.get("/verify/:userid",function(req, res){

            User.findById(req.params.userid, function(err, found){
                if(!found){
                        console.log(err.message);
                        return res.json({success: false});
                }else{
                    found.verified = true;  //changes verified field to true
                    found.save( function(err){ // saves in database
                        if(err){
                            console.log(err.message);
                            return res.json({success : false});
                        }else{
                            User.find(function(err, allUser){  // finds all user from database and send to verify file
                                console.log(err.message);
                                return res.json({success : true});
                            });
                        }
                    });
                }
            });        
        });


  // ROUTE TO BLOCK A USER, this route fetches user from db using id then changes block field to true
  // then it calls save function then it finds again all users from database
  // and attaches all users using a variable with renderes page  
  router.get("/block/:userid", function(req, res){

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

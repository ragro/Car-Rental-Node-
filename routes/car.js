const express    =  require("express"),
      router     = express.Router(),
      Car        = require("../models/car"),
      middleware = require("../middleware/middleware"),
      User       = require("../models/user"),
      usercar    = require("../models/user_car");

      //=========================
      // Routes to handle Car
      //=========================

      router.get("/addcar",middleware.isAdmin, function(req, res){
            res.render("car/addCar");   
       });
   
       router.post("/findcar", middleware.isLoggedIn, function(req, res){
            var category = req.body.filter.category;
            var city  = req.body.filter.city;
            console.log(category);
            console.log(city);
            Car.find({city: city, category: category}, function(err,foundCar){
                    if(err)
                    {   
                        console.log(err.message);
                       }else{
                        res.render("car/show", {car: foundCar});
                       }   
            });
            // console.log();

       });

       router.get("/showcar", middleware.isLoggedIn, function(req, res){
           Car.find(function(err, foundCar){
               if(err){
                   return res.redirect("/");
               }  
               else{
                //    console.log(foundCar);
                   res.render("car/show",{car:foundCar});
               }
           });
       });
   
       router.post("/addcar", middleware.isAdmin, function(req, res){
           var newCar = new Car({
                   name   : req.body.name,
                   image  : req.body.image,
                   rate  : req.body.rate,
                   number : req.body.number,
                   city   : req.body.city,
                   available : true,
                   category : req.body.category,
                   price : 0 
            });
   
           Car.create(newCar, function(err, addedCar){
                   if(err){
                       console.log(err.message);
                       return res.redirect("/car/addcar");
                   }else{
                       return res.redirect("/car/addcar");
                   }
           });
       });
       
       router.get("/edit/:car_id", middleware.isAdmin,function(req, res){
                    Car.findById(req.params.car_id ,function(err, foundCar){
                        res.render("car/editCar", { car : foundCar });
                    });
       });

       router.put("/:car_id",middleware.isAdmin,function(req, res){
            Car.findByIdAndUpdate(req.params.car_id,req.body.car, function(err, car){
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }else{
                    req.flash("success", "Car successfully updated");
                    res.redirect("/car/showcar");
                }
            });     
       });

       //route for giving form for booking car
router.get("/book/:carid", function(req, res){
    Car.findById(req.params.carid, function(err, foundCar){
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }else{
            res.render("car/bookcar",{car : foundCar});
        }
    });
    
});

//route to give checklist
router.get("/book/:carid/:userid", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.userid, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }else{
            
            Car.findById(req.params.carid, function(err, foundCar){
                
                user.bookedcar = foundCar;
                user.save();
                console.log(user.bookedcar);
                res.render("car/checklist",{userdetail:user, car : foundCar});
            });

        }
    });
});

router.get("/bookcontinue/:carid/:userid", middleware.isLoggedIn, function(req, res){
    Car.findById(req.params.carid, function(err, foundCar){
            if(err){
                req.flash("error", err.message);
                return res.redirect("car/show");
            }else{
                res.render("car/payment",{ car:foundCar, userid:req.params.userid });
            }
    });
});


router.post("/payment/:carid/:userid", function(req, res){
    var detail = req.body.pay;
    
    if( (detail.cardnumber.length == 16 )&& ( detail.cvv.length == 3 ) ){
        User.findById(req.params.userid, function(err, foundUser){  //it saves car detail in booked car
            if(err){                                               // field user
                console.log(err.message);
            }else{
                Car.findById(req.params.carid, function(err, foundCar){
                    if(err){
                        req.flash("success","Your car has booked");
                        res.redirect("/car/showcar")
                    }
                    else{
                        foundCar.available = false;
                        foundCar.save();
                        var newBooker = {userid : foundUser._id, carid : foundCar._id};
                        usercar.create(newBooker, function(err, newdata){
                                if(err){

                                }else{
                                    console.log(newdata);
                                }
                        });
                        res.render("car/finalpage",{car : foundCar});
                    }                
                });
            }
        });
    
    }else{
        req.flash("error","Please Provide valid Card Number and Cvv number");
        res.redirect("back");
    }
    // if( (detail.cardnumber.length < 16) || (detail[cvv].length <3) ){
    //     res.flash("error", "Please give valid card number or cvv number");
    //     res.redirect("back");
    // }else{
    //         Car.findById(req.params.carid, function(err, foundcar){
    //             if(err){
    //                 res.flash("success","Your car has booked");
    //                 res.redirect("/car/showcar")
    //             }
    //             else{
    //                 res.render("finalpage",{car : foundcar});
    //             }                
    //     });
    // }

});

      module.exports = router;
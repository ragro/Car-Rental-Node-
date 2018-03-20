var express      = require("express"),
    router       = express.Router(),
    User         = require("../models/user"),
    passport     = require("passport");
    

var middleware = { };

middleware.auth = passport.authenticate('jwt', {session:false});

middleware.isLoggedIn = function(req, res, next){
    
    {
			
        if(req.user)
        {    
        //req.user1=req.user;
           return next();	
        
        }
        else
        {

            res.json({
                success:false,
                msg:"You need to login first !"
            });
        }
    }


}

middleware.isalreadyLoggedin = function(req, res, next){
    if( !(req.isAuthenticated()) ){
        return next();
    }else{
        req.flash("error","You tried to login again so you logged out for this");
        req.logout();
        
        return res.redirect("back");
    }
}
middleware.isAdmin = function(req, res, next){
    if(req.user.usertype == "admin"){
        next();
    }
    else{
        req.flash("error", "Sorry , You don't have access to this facility");
        return res.redirect("back");
    }
}


module.exports = middleware;
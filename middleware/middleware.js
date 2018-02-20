var middleware = { };

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("back");
}

middleware.isalreadyLoggedin = function(req, res, next){
    if( !(req.isAuthenticated()) ){
        return next();
    }else{
        req.flash("error","You can't login to another accound while logginf into one account")
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
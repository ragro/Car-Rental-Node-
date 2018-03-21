
var express    = require("express"),
      passport   = require("passport"),
      router     = express.Router(),
      User       = require("../models/user"),
      car        = require("../models/car"),
      middleware = require("../middleware/middleware"),
      bcrypt      =require("bcryptjs"),
	  jwt         =require("jsonwebtoken");
	  
//=================================
//Routes for User Authentication
//=================================

router.post('/login',(req,res,next)=>{
	const username =req.body.username;
	const password =req.body.password;
    
	User.findOne({username:username},(err,user)=>{
		if(err) 
			{
			res.json({success:false, msg:"Somthing went wrong"});

				throw err;
			}
		if(!user)
		{
			return res.json({success:false, msg:"User not found !"});
		}
		User.comparePassword(password,user.password,(err,isMatch)=>{
		if(err) {
			throw err;
			return res.json({success:false, msg:"Somthing went wrong"});
            
		}

		if(isMatch)
		{
			const token=jwt.sign({data: user},'Hello world',{
				expiresIn:604800  // 1 Week
			});
			return res.json({

				success:true,
				msg:"Successfully login",
				token:`Bearer ${token}`,
				user:{
					username:user.username,
					userid : user._id,
                    fname: user.fname,
                    lname: user.lname,
                    phone: user.phone,
                    email: user.email,
                    age  : user.age, 
                    city : user.city,
                    license: user.license,
                    usertype   : user.usertype,
                    verified : user.verified, //this field works as flag for driving license approval
                    bookedcar : user.bookedcar,
                    blocked : user.blocked  // this field gives facility to admin to block a user
                }

			});	
		}

		else
		{
			return res.json({success:false,msg:"Wrong password"});
		}


		});
	});

});

//route for registration

router.post("/register",function(req,res)
	{

		
		var newUser=new User(req.body);
		var password=req.body.password;


             bcrypt.genSalt(10,(err,salt)=>{
             	bcrypt.hash(password,salt,(err,hash)=>{
             		if(err) throw err;
             		newUser.password=hash;

					 newUser.save((err,user)=>{
						
						if(err)
						return res.json({success:false,msg:"This username is already registered !"});
						 
						if(user)
					    return res.json({success:true,msg:"You are Registered"});
						 
					 });
             	});
             });
		
	
	});


router.get("/logout",function(req,res)
	{
		req.logout();
		console.log("User Logged Out");
		res.json({success:true,msg:"Successfully Logged Out"})
	 //    req.flash("success", "Successfully Logged Out");		
		// res.redirect("/articles");
	});



module.exports = router;
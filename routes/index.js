var express 	= require('express');
var router 		= express.Router();

var passport 	= require('passport');

var LostPet 	= require('../models/lostPet.js');
var User 		= require('../models/user.js');


// ROOT ROUTE
router.get('/', function(req, res){

	LostPet.find({}).sort({_id:-1}).limit(3).exec(function(err, foundLostPet){
		if(err){
			console.log(err);
		} else {
			// console.log('LIMIT', foundLostPet);
			res.render('index.ejs', { lostPet: foundLostPet });
		}
	});
});

// =====================
// AUTHENTICATION ROUTES
// =====================

// REGISTER ROUTE

router.get('/register', checkAlreadyLoggedIn, function(req, res){
	res.render('register.ejs');
});

// REGISTER POST ROUTE
router.post('/register', checkAlreadyLoggedIn, function(req, res){
	// body-parser is already parsing the body and it is interpreted by passport-local-mongoose
	
	var newUser = new User({ username: req.body.username });

	User.register(
		newUser,
		req.body.password,
		function(err, user){
			if(err){
				
				req.flash('danger', err.message);
				res.redirect('back');
				console.log(err);
			}  else {

				passport.authenticate('local')(req, res, function(){

					req.flash("success", "Welcome to LostPetFinderLA " + newUser.username);  //or req.user.username

					res.redirect('/');
				});
			}
		}
	);
});

// LOGIN ROUTE
router.get('/login', checkAlreadyLoggedIn, function(req, res){
	res.render('login.ejs');
});

// LOGIN POST ROUTE
router.post('/login', 
	// passport.authenticate is middleware.  it is taking 'username' && 'password' from req.body
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',

		successFlash: "Log in successful",
		failureFlash: "true"
	})
);

// LOGOUT ROUTE
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', "You have successfully logged out!");
	res.redirect('/');
});

// 404 route
router.get('*', function(req, res){
	res.send("404");
});

function checkAlreadyLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		req.flash('danger', "You are already logged in");
		res.redirect('back');
	} else {
		next();
	}
}



module.exports = router;
var express 		= require('express');
var router 			= express.Router();

var LostPet 		= require('../models/lostPet.js');
var middlewareObj 	= require('../middleware/index.js');


// ALL LOSTPETS ROUTE 
router.get('/lostpets', function(req, res){
	LostPet.find({}).sort({_id:-1}).exec(function(err, lostPet){
		if(err){
			console.log('/LOSTPETS', err);
		} else {
			res.render('lostpet/lostpets.ejs', { lostPet: lostPet });
		}
	});
});


// LOSTPETS POST ROUTE CREATE
router.post('/lostpets', middlewareObj.isLoggedIn, function(req, res){

	var name = req.body.name;
	
	var image = req.body.image;
	if(image === ''){
		image = '../images/sherlock-bones.jpg';
	}

	var desc = req.body.desc;
	if(desc === ''){
		desc = 'I havent added a description of my lost pet.  But I miss them very much!!! And I am so happy to have this website to help me find them';
	}

	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var lostPetObj = { name: name, image: image, desc: desc, author: author};
	
	LostPet.create(lostPetObj, function(err, createdLostPet){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});


// NEW ROUTE 
router.get('/new', middlewareObj.isLoggedIn, function(req, res){
	res.render('lostpet/new.ejs');
});


// SHOW ROUTE
router.get('/lostpets/:id', function(req, res){

	LostPet.findById(req.params.id).populate('comments').exec(function(err, lostPet){
		if(err || !lostPet){
			req.flash('danger', "LostPet not found");
			res.redirect('back');
			console.log(err);
		} else {
			// console.log('/SHOW LOSTPET', lostPet);
			res.render('lostpet/show.ejs', { lostPet: lostPet });
		}
	});
});


// EDIT ROUTE
router.get('/lostpets/:id/edit', middlewareObj.checkLostPetOwnership, function(req, res){
	
	LostPet.findById(req.params.id, function(err, foundLostPet){
		if(err){
			console.log(err);
		} else {
			res.render('lostpet/edit.ejs', {lostPet: foundLostPet});
		}
	});
});

// EDIT PUT ROUTE UPDATE
router.put('/lostpets/:id', middlewareObj.checkLostPetOwnership, function(req, res){
	LostPet.findByIdAndUpdate(req.params.id, req.body.lostPet, function(err, updatedLostPet){
		if(err){
			console.log(err);
		} else {
			res.redirect('/lostpets/' + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete('/lostpets/:id', middlewareObj.checkLostPetOwnership, function(req, res){
	LostPet.findByIdAndRemove(req.params.id, function(err, deletedLostPet){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

// function isLoggedIn(req, res, next){

// 	// .isAuthenticated() come from passport 
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	console.log("YOU MUST BE LOGGED IN TO DO THAT!!!");
// 	res.redirect('/login');
// }

// function checkLostPetOwnership(req, res, next){
// 	if(req.isAuthenticated()){

// 		LostPet.findById(req.params.id, function(err, foundLostPet){
// 			if(err){
// 				console.log(err);
// 			} else {

// 				if(foundLostPet.author.id.equals(req.user._id)){
// 					next();

// 				} else {
// 					console.log("YOU DO NOT HAVE PERMISSION TO DO THAT!!!");
// 					res.redirect('back');
// 				}
// 			}
// 		});
// 	} else {
// 		console.log('YOU MUST BE LOGGED IN TO DO THAT');
// 		res.redirect('/login');
// 	}
// }

module.exports = router;

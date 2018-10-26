var LostPet = require('../models/lostPet.js');
var Comment = require('../models/comment.js');

// MIDDLEWARE

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	}

	req.flash('danger', "YOU MUST BE LOGGED IN TO DO THAT!!!");

	console.log("YOU MUST BE LOGGED IN TO DO THAT!!!");
	res.redirect('/login');	
};


middlewareObj.checkLostPetOwnership = function(req, res, next){
	if(req.isAuthenticated()){

		LostPet.findById(req.params.id, function(err, foundLostPet){
			if(err || !foundLostPet){
				req.flash('danger', "Lost Pet not found");
				res.redirect('back');
				console.log(err);
			} else {

				if(foundLostPet.author.id.equals(req.user._id)){
					next();
				} else {

					req.flash('danger', "YOU DO NOT HAVE PERMISSION TO DO THAT!!!");

					console.log("YOU DO NOT HAVE PERMISSION TO DO THAT!!!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('danger', "YOU MUST BE LOGGED IN TO DO THAT!!!");

		console.log('YOU MUST BE LOGGED IN TO DO THAT');
		res.redirect('/login');
	}	
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){

		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash('danger', "Comment not found");
				res.redirect('back');
				console.log(err);
			} else {

				if(foundComment.author.id.equals(req.user.id)){
					next();
				} else {
					req.flash('danger', "YOU DO NOT HAVE PERMISSION TO DO THAT!!!");
					console.log("YOU DO NOT HAVE PERSMISSION TO DO THAT!!!");
					res.redirect('back');
				}
			}
		});
	} else {

		req.flash('danger', "YOU MUST BE LOGGED IN TO DO THAT!!!");

		console.log("YOU MUST BE LOGGED IN TO DO THAT!!!");
		res.redirect('/login');
	}
};



module.exports = middlewareObj;
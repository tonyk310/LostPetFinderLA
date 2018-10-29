var express 		= require('express');
var router 			= express.Router();

var LostPet 		= require('../models/lostPet.js');
var Comment 		= require('../models/comment.js');
var middlewareObj 	= require('../middleware/index.js');


// NEW COMMENT
router.get('/lostpets/:id/comments/new', middlewareObj.isLoggedIn, function(req, res){
	LostPet.findById(req.params.id, function(err, foundLostPet){
		if(err || !foundLostPet){
			req.flash('danger', "LostPet not found in DB");
			res.redirect('/');
			console.log(err);
		} else {
			res.render('comments/new.ejs', { lostPet: foundLostPet });
		}
	});
});



// COMMENT CREATE POST ROUTE
router.post('/lostpets/:id/comments', middlewareObj.isLoggedIn, function(req, res){

	var commentObj = {
		text: req.body.comment.text,
		author: {
			username: req.user.username,
			id: req.user._id
		}
	};

	LostPet.findById(req.params.id, function(err, foundLostPet){
		if(err){
			console.log(err);
		} else {
			// Comment.create(req.body.comment, function(err, createdComment){
			Comment.create(commentObj, function(err, createdComment){
				if(err){
					console.log(err);
				} else {
					// this push is a mongoose method
					foundLostPet.comments.push(createdComment);

					foundLostPet.save();

					req.flash('success', "Comment succsessfully created!");
					res.redirect('/lostpets/' + req.params.id);
				}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get('/lostpets/:id/comments/:comment_id/edit', middlewareObj.checkCommentOwnership, function(req, res){
	
	// console.log("req.params.comment_id::",req.params.comment_id);

	// Comment.findById(req.params.comment_id, function(err, foundComment){
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		// console.log("COMMENT EDIT = foundComment::", foundComment);
	// 		res.render('comments/edit.ejs', { comment: foundComment, lostPet: req.params.id });
	// 	}
	// });

	LostPet.findById(req.params.id, function(err, foundLostPet){
		if(err || !foundLostPet){
			console.log(err);
			req.flash('danger', "LostPet not found in DB");
			res.redirect('back');
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					console.log(err);
					req.flash('danger', "Comment not found in DB");
					res.redirect('back');
				} else {
					res.render('comments/edit.ejs', {comment: foundComment , lostPet: foundLostPet});
				}
			});
		}
	});
});

// COMMENT UPDATE ROUTE
router.put('/lostpets/:id/comments/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){

	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
		} else {
			// console.log("COMMENT UPDATE ROUTE:", updatedComment);
			req.flash('success', "Comment succsessfully updated!");
			res.redirect('/lostpets/' + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete('/lostpets/:id/comments/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		} else {
			req.flash('success', "Comment Deleted");
			res.redirect('/lostpets/' + req.params.id);
		}
	});
});


// // MIDDLEWARE
// function isLoggedIn(req, res, next){

// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	console.log("YOU MUST BE LOGGED IN TO DO THAT!!!");
// 	res.redirect('/login');
// }


// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){

// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if(err){
// 				console.log(err);
// 			} else {

// 				// console.log("CHECKCOMMENTOWNERSHIP FOUNDCOMMENT::", foundComment);

// 				if(foundComment.author.id.equals(req.user.id)){
// 					next();
// 				} else {
// 					console.log("YOU DO NOT HAVE PERSMISSION TO DO THAT!!!");
// 					res.redirect('back');
// 				}
// 			}
// 		});
// 	} else {
// 		console.log("YOU MUST BE LOGGED IN TO DO THAT!!!");
// 		res.redirect('/login');
// 	}
// }

module.exports = router;
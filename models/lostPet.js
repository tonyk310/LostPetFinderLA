var mongoose = require('mongoose');

var lostPetSchema = new mongoose.Schema({
	name: String, //{required??}
	// Note: Mongoose only applies a default if the value of the path is strictly undefined.
	image: { type: String, default: './images/sherlock-bones.jpg'},
	desc: { type: String, default: 'I havent added a description of my lost pet.  But I miss them very much!!!' },
	date: { type: Date, default: Date.now },
	
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],

	author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
});

// Attatched the shcema to the model.
var LostPet = mongoose.model('LostPet', lostPetSchema);

module.exports = LostPet;
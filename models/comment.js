var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	text: String,
	date: { type: Date, default: Date.now },

	author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
	
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
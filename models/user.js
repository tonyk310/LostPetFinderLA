var mongoose 				= require('mongoose');
var passportLocalMongoose 	= require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

// before we export the 'User model' we are using 'passportLocalMongoose'
// to add losts of different methods to the schema for authentication
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);
module.exports = User;
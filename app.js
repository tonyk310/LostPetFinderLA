var express 				= require('express');
var bodyParser 				= require('body-parser');
var mongoose 				= require('mongoose');

var passport				= require('passport');
var LocalStrategy			= require('passport-local');
var passportLocalMongoose	= require('passport-local-mongoose');
var expressSession			= require('express-session');

var Comment 				= require('./models/comment.js');
var LostPet 				= require('./models/lostPet.js');
var User 					= require('./models/user.js');

var methodOverride 			= require('method-override');

var lostPetsRoutes 			= require('./routes/lostPets.js');
var commentsRoutes 			= require('./routes/comments.js');
var indexRoutes 			= require('./routes/index.js');

var flash 					= require('connect-flash');

var app 					= express();

// CONFIG

// Mongoose CONFIG

// console.log(process.env.MLAB_DATABASE_URL);

// this connects app.js to mongoDB

// mongoose.connect("mongodb://localhost:27017/deploy2", { useNewUrlParser: true });
// mongoose.connect("mongodb://lostpetfinderla:password1@ds255347.mlab.com:55347/lostpetfinderla", { useNewUrlParser: true });
mongoose.connect(process.env.MLAB_DATABASE_URL || "mongodb://localhost:27017/deploy2", { useNewUrlParser: true });


// this changes the depreication
mongoose.set("useFindAndModify", false);

// Express CONFIG

// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express.
app.use( express.static(__dirname + "/public") );

// set app.use to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// tell express to use method-override
app.use(methodOverride('_method'));
// tell express to use flash throughout the app
app.use(flash());



// PASSPORT CONFIGURATION

// EXPRESS-SESSION CONFIG

// app.use();
// app.use(expressSesssion());
// app.use(expressSesssion({}));
// app.use(expressSession({ secret: 'this is the secret', resave: false, saveUninitialized: false }));
app.use(expressSession({
	secret: 'this is the secret',
	resave: false,
	saveUninitialized: false
}));


// PASSPORT CONFIG

// required passport lines
// tell express to use passport
app.use(passport.initialize());
//tell passport to use sessions
app.use(passport.session());
// tell passport to use the local-strategy... 
// and that new localStrategy is User.authenticate() and .authenticate comes from passport-local-mongoose.  User is the User model
passport.use(new LocalStrategy(User.authenticate()));
//tell passport to serializeUser & User.serializeUser() comes from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// tell express to use the middleware
// this has to go after passport because... passport creates the method .user
app.use(currentUser);
function currentUser(req, res, next){
	// whatever we put inside of res.locals is available to all pages
	res.locals.currentUser = req.user;
	next();
}

app.use(resLocals);
function resLocals(req, res, next){
	res.locals.flashSuccess = req.flash('success');
	res.locals.flashDanger = req.flash('danger');
	next();
}

app.use(lostPetsRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);



var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function(){
	// console.log("LostPetFinderLA Server Started on DB: " + process.env.MLAB_DATABASE_URL);
	console.log("Server Started on port: " + port);
});
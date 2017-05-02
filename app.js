var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var sitevisitor = require('./models/siteVisitor.js');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'hbs');

	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

//configure mongodb
/*
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
	MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
	    if (err) {
		throw err;
	    } else {
		console.log("successfully connected to the database");
	    }

	    var collection = db.collection('test_emails');      
	    collection.insert({a:2}, function(err, docs) {
		collection.count(function(err, count) {
		    console.log(format("count = %s", count));
		    // db.close(); - this should be the last argument
		});
	    });

	    //Locate all the entries using find
	    collection.find().toArray(function(err, results){
		console.dir(results);
		// Let's close the db
	    	//db.close();
		});
	});
*/
var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};
mongoose.connect('mongodb://127.0.0.1:27017/test', opts);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));
var Schema = mongoose.Schema;
var BetaUserSchema = new Schema({
	email: String,
	name: String,
	suggestion: String,
});
var BetaUser = mongoose.model('BetaUser', BetaUserSchema); 
var firstUser =  new BetaUser({email:'alexander.mcnulty92@gmail.com',name:'alex',suggestion:'none'});
firstUser.save(function(err){
	if(err) return handleError(err);
});


//Routes, the logical guts of our application
//app.use sniffs out the appropriate route the users has requested, the first argument.
//the second argument, declared above, links the file containning additional logic for the specifed route
app.use('/', index);
app.use('/users', users);

//handle the landing page - visitor subscriptions
app.post('/', function(req,res){
	VisitorUser = new BetaUser({
		email: req.body.email, 
		name: req.body.name,
		suggestion: req.body.suggestion,
	});
	VisitorUser.save(function(err){
		if(err){
			console.error(err.stack);
			return res.redirect(303, '/');
		}
		return res.redirect(303, '/');
	});
	console.log('shitting myself');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

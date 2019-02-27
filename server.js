const express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var hbs = require( 'express-handlebars' );
const mysql = require('mysql'); 
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var md5 = require('md5');
var session = require('express-session');
var passport = require('passport');
var mySQLStore = require('express-mysql-session')(session);
var localStrategy = require('passport-local');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const config = require('./config/config.js');


app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
} ) );


var options = {
	host: config.databaseOptions.host,
	port: config.databaseOptions.port,
	user: config.databaseOptions.user,
	password: config.databaseOptions.password,
	database:config.databaseOptions.database,
	ssl: config.databaseOptions.ssl
};

var sessionStore = new mySQLStore(options);

app.use(session({
	secret:'weasels',
	resave:false,
	saveUninitialized:false,
	store: sessionStore
	//  cookie:{secure:true}
}))


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});
 

app.use(express.static('public'));


app.set( 'view engine', 'hbs' );

users = [];
connections = [];


server.listen(process.env.PORT || 3000);
console.log('Server running...');

const connection = mysql.createConnection({
	host: config.databaseOptions.host,
	port: config.databaseOptions.port,
	user: config.databaseOptions.user,
	password: config.databaseOptions.password,
	database:config.databaseOptions.database,
	ssl: config.databaseOptions.ssl
});

connection.connect();

//testing connnection 
connection.query('SELECT * FROM Users', function(err, rows, fields) {
	if (err) throw err;
	console.log("DB is connected");
}); 



passport.use(new localStrategy(
	function(username, password, done) {
		//const username = req.body.username;
		//const passwordEntered = req.body.password;
		connection.query('SELECT Password, UserID FROM Users WHERE Username = ?', [username], function(err,results,fields) {
			console.log('Username: '+username);
			console.log('Password: '+results[0].Password);
			console.log('User ID: '+results[0].UserID);

			if (err) {done(err)};

			if (results.length === 0) {
				done(null,false);
			} else {

				if (md5(password) === results[0].Password) {
					var id = results[0].UserID;
					return done(null,id);
				} else {
					return done(null,false);
				}
			}

		})
	}
));


// ,md5(passwordEntered)


// function(req, res){
// 	 		if(error) throw error;
  
// 	  res.redirect('profile');
// 	});

// };

//-----------------------------------------------------------------------------
//	Index
//-----------------------------------------------------------------------------

app.get('/', function(req, res){
	res.render('index');
});

//-----------------------------------------------------------------------------
//	Login
//-----------------------------------------------------------------------------

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', passport.authenticate(
	'local', {
		successRedirect:'profile',
		failureRedirect:'login'
	})

);


app.get('/logout', function(req,res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});


//-----------------------------------------------------------------------------
//	Chat
//-----------------------------------------------------------------------------

app.get('/chat', function(req, res){
	res.render('chat');
});


//-----------------------------------------------------------------------------
//	registration
// -----------------------------------------------------------------------------

app.get('/register', function(req, res, next) {
	//res.send('register');
	res.render('register', { title: 'Register' });
});
  
app.post('/register', function(req, res) {

	const username = req.body.username;
	const lname = req.body.lname;
	const fname = req.body.fname;
	const DOB = req.body.dob;
	const email = req.body.email;
	const password = md5(req.body.password);
  
	
	connection.query('INSERT INTO Users (Username,Password,Email,FirstName,LastName,DOB) values (?,?,?,?,?,?)', [username,password,email,fname,lname,DOB],function(error,results,fields) {
		if(error) throw error;

		connection.query('SELECT LAST_INSERT_ID() as user_id', function(error,results,fields) {
			if(error) throw error; 
			const user_id = results[0];
			console.log(results[0]);
			req.login(user_id, function(err) {
				res.redirect('/profile');
			});
			// res.render('profile');
		});
	}); 
});


passport.serializeUser(function(user_id,done){
	done(null, user_id);
});
passport.deserializeUser(function(user_id,done){
	done(null, user_id);
});

//-----------------------------------------------------------------------------
// 	Profile
//-----------------------------------------------------------------------------

app.get('/profile', authenticationMiddleware(), function(req, res, next){
	
	var id = req.session.passport.user;
	console.log(id);
	
	var query = 'SELECT * FROM Users Where UserID = ' + id;
	var results ='';
	connection.query(query, function(error, results, fields) {
		if(error) throw error;
		results = results;
	});
	
	res.render('profile', {
		username:results[1],
		password:results[2],
		email:results[6],
		firstname:results[7],
		lastname:results[8],
		dob:results[9]
	});
	
	
});

app.get('/profileUpdate', function(req, res){
	res.render('profileUpdate');
});


//-----------------------------------------------------------------------------
//	Functions
//-----------------------------------------------------------------------------

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
	    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport.user)}`);
	    if (req.isAuthenticated()) return next();
	    res.redirect('login')
	}
}

io.sockets.on('connection', authenticationMiddleware(), function(socket){

	
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	
	// Send Message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});
	
	// New User
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});

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
		connection.query('select Password from  Users where Username = ?', [username], function(err,results,fields) {
			 console.log(username);
			 console.log(password);
			
			if (err) {done(err)};

			if (results.length === 0) {
				done(null,false);
			} else {

				if (md5(password) === results[0].Password) {
					return done(null, 'success string');

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

app.get('/', function(req, res){
	res.render('index');
});



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






app.get('/chat', function(req, res){
	res.render('chat');
});




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

app.get('/profile', authenticationMiddleware(), function(req, res){

	res.render('profile', {title:'Profile'});
});

app.get('/profileUpdate', function(req, res){
	res.render('profileUpdate');
});


function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

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

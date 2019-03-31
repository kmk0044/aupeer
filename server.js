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
var formidable = require('formidable');
var expressValidator = require('express-validator');
var flash = require('express-flash-messages');
var fileUpload = require('express-fileupload');
var nodemailer = require("nodemailer");
var randToken = require('rand-token');
var async = require('async');
var validator = require('validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(expressValidator({
	customValidators: {
			isImage: function(value, filename) {
	
					var extension = (path.extname(filename)).toLowerCase();
					switch (extension) {
							case '.jpg':
									return '.jpg';
							case '.jpeg':
									return '.jpeg';
							case  '.png':
									return '.png';
							default:
									return false;
					}
			}
	}}));
const config = require('./config/config.js');
const { check } = require('express-validator/check');


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
	resave:true,
	saveUninitialized:false,
	store: sessionStore//, 
  //cookie:{expires: (25 * 86400 * 1000)}
}))


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
	
	res.locals.isAuthenticated = req.isAuthenticated();

	if (req.isAuthenticated()) {
			//this helps protect header links for certian tabs
		var userID = req.session.passport.user; 

		connection.query("select AccountFlag from Users where UserID =" + userID ,  function(err, results, fields) {
			if (err) {
					console.log('hit select userid query in ERR');
			}
			console.log('hit user role  statement ');
			console.log('User Role: '+results[0].AccountFlag);
			var accountID = results[0].AccountFlag;
			if (accountID == 0) {
				res.locals.isMentee = true;
			} 
			if(accountID == 3){
				res.locals.Admin = true;
			} 
			if (accountID == 1 || accountID == 2) {
				res.locals.Mentor = true;
			}
		});
	}
	next();
});
 


app.use(express.static('public'));

app.use(express.static(__dirname + 'public')); //Serves resources from public folder



//Serves all the request which includes /images in the url from Images folder
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set( 'view engine', 'hbs' );

users = [];
connections = [];
clients = {};

server.listen(process.env.PORT || 9080);
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

		connection.query('SELECT Password, UserID, Verified FROM Users WHERE Username = ?', [username], function(err,results,fields) {
		//Debugging tools
			// 	console.log('Username: '+username);
			//  console.log('Password: '+results[0].Password);
			// 	console.log('User ID: '+results[0].UserID);

			if (err) {
				return done(null, false ,{
					message: 'Invalid Username, try creating an account instead.'
				});
			}

			if (results.length === 0) {
				return done(null,false ,{
					message: 'Invalid Username or Password.'
				});
			} else {
				if (results[0].Verified == 1){

					if (md5(password) === results[0].Password) {
						var id = results[0].UserID;
						var role = results[0].AccountFlag;
						return done(null,id,role);
					} else {
						return done(null,false, {
							message: 'Invalid Username or Password.'
						});
					}
				}else {
					return done(null,false, {
						message: 'Your account is not verified, please verify your account before logging in.'
					});

				}	
			}

		})
	}
));




//-----------------------------------------------------------------------------
//	Index
//-----------------------------------------------------------------------------

app.get('/', function( req, res) {
	res.render('index');
});

app.get('/resources', authenticationMiddleware(),  function( req, res ) {

	res.render('resources');
});

//-----------------------------------------------------------------------------
//	Login
//-----------------------------------------------------------------------------

app.get('/login', function(req, res){
	const flashMessages = res.locals.getMessages();
	
	//debugging tools 
	//console.log('flash', flashMessages);

	//send error messages if they exist
	if(flashMessages.error) {
		res.render('login',{
			showErrors:true, 
			errors:flashMessages.error
		});
	} else {
		res.render('login');
	}
});

app.post('/login', passport.authenticate('local', { 
	successRedirect: 'profile', //valid username and password - log user in
	failureRedirect: 'login',  /* invalid username and password 
															  - redirect user to login 
													 		  and display error message
													   */
	failureFlash: true //allows error messages to be sent through to login screen
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

app.get('/chat', authenticationMiddleware(),function(req, res){

	res.render('chat', {
		id:req.session.passport.user

	});
});



//-----------------------------------------------------------------------------
//	Register
//-----------------------------------------------------------------------------

app.get('/register', function(req, res, next) {
	//res.send('register');
	res.render('register', { title: 'Register' });
});
  
app.post('/register', function(req, res) {
console.log(req.body.userRole);

req.checkBody('fname','First Name cannot be empty.').notEmpty();
req.checkBody('lname','Last Name cannot be empty.').notEmpty();
req.checkBody('dob','Date of Birth cannot be empty.').notEmpty();

if (req.body.userRole !== 'alumniMentor'){
	req.checkBody('username','Username must be your Auburn UserID.').len(7);
} else {
	req.checkBody('username','Username must between 4 and 15 characters.').len(4,15);
}

if (req.body.userRole !== 'alumniMentor'){
	req.checkBody('email', 'Email must be your Auburn email address.').contains('auburn');

} else {
	req.checkBody('email', 'Email is not valid.').isEmail();
}

req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
req.checkBody('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
req.checkBody('passwordConfirm', 'Passwords do not match, please try again.').equals(req.body.password);

//var usrPhoto = req.files.programPhoto;
////console.log(req.files.userPhoto);

//TODO: add flash err messages
//upload user profile picture
console.log(req.files.userPhoto);
if (req.files.userPhoto.length == 0) {
	res.redirect('register');
}
//TODO: catch err here. 

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
let userPhoto = req.files.userPhoto;

// Use the mv() method to place the file somewhere on your server
userPhoto.mv(__dirname + '/uploads/' + userPhoto.name, function(err) {
	if (err)
	res.redirect('register');

	//res.send('File uploaded!');
});




const err = req.validationErrors(req);

	if (err) {
		console.log(JSON.stringify(err));
		res.render('register', {
			errors: err
		});
	} else {
	//ToDO make email unique
            
			const username = req.body.username;
			const lname = req.body.lname;
			const fname = req.body.fname;
			const DOB = req.body.dob;
			const email = req.body.email;
			const password = md5(req.body.password);
			const userPhoto = req.files.userPhoto.name;
		  

			if (req.body.userRole == 'mentee'){
				var userPermissions = 0;
			} else if (req.body.userRole == 'mentor'){
				var userPermissions = 1;
			} else if (req.body.userRole == 'alumniMentor'){
				 var userPermissions = 2;
			} else if (req.body.userRole == 'admin'){
				 var userPermissions = 3;
			} else {
				var userPermissions = 500;
			}
			
            var verificationToken = randToken.generate(32);

            //TODO: put in config file
            var client = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'aupeerMail',
                    pass: sendgridcreds.env.SENDGRID_API_KEY
                }
            });
          
            var verficationEmail = {
                from: 'kate@katemariekramer.com',
                to: email,
                subject: 'Auburn Mentoring- Please Confirm Your Email',
                text: 'Please visit https://auburnPeerMentoringSD2019.mybluemix.net/verify?id=' + verificationToken +' to complete your account registration.',
                html: '<p>Please visit <a> https://auburnPeerMentoringSD2019.mybluemix.net/verify?id=' + verificationToken +'<a> to complete your account registration. <p>',
                
            };

            client.sendMail(verficationEmail, function(err, info){
            if (err){
            console.log(err);
                }
            else {
            console.log('Message sent: ' + info.response);
                }
            });
            //todo: set user permissions based on userRole. 3-26
			connection.query('INSERT INTO Users (Username,Password,Email,FirstName,LastName,DOB,ProfilePic, AccountFlag, Hash) values (?,?,?,?,?,?,?,?,?)', [username,password,email,fname,lname,DOB,userPhoto,userPermissions,verificationToken],function(error,results,fields) {
				if(error) throw error;

				connection.query('SELECT LAST_INSERT_ID() ', function(error,results,fields) {
					if(error) throw error; 
					const user_id = results[0];
          //todo: flash message about checking email for verification
          res.render('checkEmail');
				});
			}); 
	}
});

passport.serializeUser(function(user_id,done){
	done(null, user_id);
});
passport.deserializeUser(function(user_id,done){
	done(null, user_id);
});

//-----------------------------------------------------------------------
// Verify Email and send user to login
//-----------------------------------------------------------------------

app.get('/verify',function(req,res){

	console.log(req.query.id);
	var tokenIn = req.query.id;

	console.log('token in: '+tokenIn);
    connection.query("select UserID from Users where Hash ='" + tokenIn + "'", function(err, results, fields) {
        if (err) {
            console.log('hit select userid query in ERR');
        }
		console.log('hit select userid query');
		console.log('results0: '+results[0].UserID);
        
        if(err) throw err; 
        const user_id = results[0].UserID;
        connection.query('Update Users set Verified = 1 where UserID = ?', [user_id], function(err, results, fields ){
            if (err) throw err; 
            req.login(user_id, function(error) {	
                res.redirect('login');
            });
        });
    });

});

//-----------------------------------------------------------------------------
// 	Profile/Updating Profile
//-----------------------------------------------------------------------------

// Passes relevant curret user's relevant data to hbs files base on their UserID
app.get('/profile', authenticationMiddleware(), function(req, res, next){
	var id = req.session.passport.user;
	getProfile(id, req,function(err,data) {
	//	if(err) throw err;
		console.log('Directing to profile,' + data.Username + '\'s data loaded.');
		res.render('profile', {
			username:data.Username,
			password:data.Password,
			email:data.Email,
			firstname:data.FirstName,
			lastname:data.LastName,
			dob:data.DOB, 
			profilePic: data.ProfilePic
		});
	});
});


app.get('/profileUpdate', function(req, res){
	var id = req.session.passport.user;
	getProfile(id, req,function(err,data) {
		if(err) throw err;
		console.log('Directing to profileUpdate, ' + data.Username + '\'s data loaded');		
		res.render('profileUpdate', {
			username:data.Username,
			password:data.Password,
			email:data.Email,
			firstname:data.FirstName,
			lastname:data.LastName,
			dob:data.DOB
		});
	});
});

// Gets User information from User Table based on a given UserID
function getProfile(id, req, callback) {
	var query_str = 'SELECT * FROM Users Where UserID = ' + id;

	var array = [];
	connection.query(query_str, function(err, rows, fields) {
		if(err) callback(err,null);
		array.push(JSON.stringify(rows[0].Username));
		callback(null, rows[0])
	});
}

// Should be called after clicking 'UPDATE' on profileUpdate.hbs
app.post('/', function(req, res) {
	var id = req.session.passport.user;
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var dob = req.body.dob;
	var oldpassword = md5(req.body.oldpassword);
	var password1 = md5(req.body.password1);
	var password2 = md5(req.body.password2);

	updateProfile(username, firstname, lastname, email, dob, oldpassword, password1, password2, id, req);
	res.redirect('profile');
});

function updateProfile(username, firstname, lastname, email, dob, oldpassword, password1, password2, id, req) {	
	getProfile(id, req, function(err,data) {
		if (oldpassword === '' && password2 === '' && password1 === '') {
			console.log('Not Changing Password');
		} else {
			console.log('Password change attempted.');
			if(err) throw err;
			if(oldpassword !== data.Password) {
				console.log('Old Password entered was incorrect. Redirected.')
				return;
			} else if (oldpassword === '' || password2 === '' || password1 === '') { // Field was left empty.
				console.log('A password field was left empty. Redirected.')
				return;
			} else if(password1 !== password2) { // Passwords are not the same.
				console.log('Password confirmation failed. Redirected.');
				return;
			} else if(password1 === oldpassword) { // Old password is the same as the new one.
				console.log('New password is same as old password.');
				return;
			} else {
				var password_query = 'UPDATE Users SET Password = ' + JSON.stringify(password1) + ' WHERE UserID = ' + id;
				connection.query(password_query, function(err,rows,fields) {if(err) {throw err;}});
				console.log('Password changed successfully.');
			}
		}

	getProfile(id, req, function(err,data) {
		var query = 'SELECT Username, Email FROM Users WHERE UserID != ?';
		connection.query(query, [id], function(err,rows,fields) {
			if(err) {throw err;}
			if(!validator.isEmail(email)) { // is email valid?
				console.log('Email \'' +email+ '\' is invalid!');
				return;
			}
			for (var i = 0; i < rows.length; i++) { // does email/username already exist?
				if(rows[i].Username === username) {
					console.log('Username already exists!');
					return;
				} else if (rows[i].Email === email) {
					console.log('Email already exists!');
					return;
				}
			}
			var update_query = 'UPDATE Users SET Username ='+JSON.stringify(username) +', FirstName = '+JSON.stringify(firstname)+', LastName ='+JSON.stringify(lastname)+', Email = '+JSON.stringify(email)+', DOB = '+JSON.stringify(dob)+ ' WHERE UserID = '+id;
			connection.query(update_query, function(err, rows, fields) {
				if(err) {throw err;}
				console.log('Profile updated successful');
			});
	});


			console.log('Calling on updateProfile!');
		});
	});
}

//-----------------------------------------------------------------------------
//	Functions
//-----------------------------------------------------------------------------

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    console.log(`Current UserID: ${JSON.stringify(req.session.passport.user)}`);
	    if (req.isAuthenticated()) return next();
	    res.redirect('login')
	}
}

//-----------------------------------------------------------------------------
//	Programs
//-----------------------------------------------------------------------------

app.get('/programs',function(req, res) {
	// if signed in, get programs 
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {
		var userID = req.session.passport.user;
		getPrograms(userID, req, function(err, data) {
			if(err) throw err;
			if (data) {
				console.log(data);
				res.render('programsWithUserInfo', {
					program: data.ProgramName,
					website: data.Website,
					image_path: data.ProgramImage
				});
			} 
			else {
				res.render('programs', {title: 'Programs'});
			}
		});
	} else {
		res.render('programs', {title: 'Programs'});
	}
});

function getPrograms(id, req, callback) {
	var query_str = 'SELECT ProgramName, Website, ProgramImage FROM Programs, Memberships WHERE Memberships.UserId = ' + id;
	var array = [];
	connection.query(query_str, function(err, rows, fields) {
		if (err) callback(err, null);
		array.push(JSON.stringify(rows[0]));

		callback(null, rows[0]);
	})
}



function getUserRole(id, req, callback) {
	var query_str = 'SELECT AccountFlag FROM Users WHERE UserId = ' + id;
	var array = [];
	connection.query(query_str, function(err, rows, fields) {
		if (err) callback(err, null);
		array.push(JSON.stringify(rows[0]));

		callback(null, rows[0]);
	})
}

app.post('/programs', function(req, res) {
	var prgmName, prgmInfo, prgmWebsite, prgmPicture;

	var form = new formidable.IncomingForm();
	form.parse(req);

	form.on('field', function(name, value) {
		if (name == "programName") {
			console.log("name: ", value);
			prgmName = value;
		} else if (name == "programPreview") {
			console.log("info: ", value);
			prgmInfo = value;
		} else if (name == "programSite"){
			console.log("website: ", value);
			prgmWebsite = value;
		}
	})

	form.on('fileBegin', function(name, file) {
		file.path = __dirname + '/uploads/programImages' + file.name;
	});

	form.on('file', function(name, file) {
		console.log('Uploaded ' + file.name);
		prgmPicture = file;
	});

	form.on('end', function() {
		res.send("Form received!");
	});

	connection.query('INSERT INTO Programs (ProgramName,Description,Image,Website) values (?,?,?,?)', [prgmName, prgmInfo, prgmPicture, prgmWebsite], function(error, results, fields) {
		if (error) throw error;

		connection.query('SELECT LAST_INSERT_ID() as program_id', function(error, results, fields) {
			if (error) throw error;
			const program_id = results[0];
			console.log(program_id);

		});
	});
});

//----------------------------------------------------------------------------
// idividual program page
//----------------------------------------------------------------------------
app.get('/programName', function(req,res) {

	var id = 2;
	var query_str = 'SELECT * FROM Programs WHERE ProgramID = '+ id;

	connection.query(query_str, function(err, rows, fields) {
		var ProgName = rows[0].ProgramName;
		var ProgDescrip = rows[0].Description;
		var ProgWeb = rows[0].Website;
		var ProgImage = rows[0].ProgramImage;
		res.render('programInfo', {title:ProgName, 
								layout: 'programInfoLayout',
								progName: ProgName, 
								description: ProgDescrip,
								website: ProgWeb,
								imagePath: ProgImage
							});

	});

});




//-----------------------------------------------------------------------------
//	Survey
//-----------------------------------------------------------------------------

app.get('/survey', authenticationMiddleware(), function(req, res){

	res.render('survey', {title:'Survey'});
});
app.post('/survey', authenticationMiddleware(), function(req, res){
	var id = req.session.passport.user;
	const answer1 = req.body.A1;
	// console.log('A1:' +  req.body.A1)
	const answer2 = req.body.A2;
	const answer3 = req.body.A3;
	const answer4 = req.body.A4;
	const answer5 = req.body.A5;
	const answer6 = req.body.A6;
	const answer7 = req.body.A7;
	const answer8 = req.body.A8;
	const answer9 = req.body.A9;
	// const answer10 = req.body.A10.value;
	// // console.log('a10: ' + answer10);
	// const answer11 = req.body.A11;
	// const answer12 = req.body.A12;
	
	const answer10 = " ";
	const answer11 = " ";
	const answer12 = " ";
	const answer13 = req.body.A13;
	const answer14 = req.body.A14;
	const answer15 = req.body.A15;

	connection.query('INSERT INTO UserSurveyResults VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, answer1,answer2, answer3, answer4, answer5, answer6, answer7, answer8,answer9, answer10, answer11, answer12, answer13, answer14, answer15 ], function(error, results, fields) {
		if (error) throw error;
		console.log('survey results saved.');
	}
		
	);
	//total questions we are going to check 1, 2, 9

	
	var menteeOrMentor = answer6;
	var mentee = 'Mentee';
	var mentor = 'Mentor';
	var counter = 0;
 	

	if (menteeOrMentor === mentor) {
		console.log("Selected Mentor, Do match only with mentees");
		var queryForMentor = connection.query('SELECT * FROM UserSurveyResults WHERE Q6 LIKE ? AND UserID <> ?', [mentee, id]);
		 
		 	queryForMentor.on('error', function(err) {
    		throw err;
			});
 
			queryForMentor.on('fields', function(fields) {
    		//console.log(fields);
			});
 
			queryForMentor.on('result', function(row) {
			var counter = 0;
			connection.pause();
			
			console.log("Checking next row");
    		
    		if(row.Q1 === answer1) {
    			console.log("Q1 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}

    		if(row.Q2 === answer2) {
    			console.log("Q2 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}

    		if(row.Q9 === answer9) {
    			console.log("Q9 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}


    		var percentageMatched = Math.floor((counter/3) * 100);
    		Math.round(percentageMatched);

    		connection.query('SELECT FirstName FROM Users WHERE UserID = ?', [row.UserID] , function(error, fields, rows) {
    			
    		if (percentageMatched >= 60) {
    		//connection.query('SELECT FirstName FROM Users WHERE UserID = ?', [row.UserID] , function(error, fields, rows) {
    		//console.log("UserId " + row.UserID + " matched " + counter + " out of 3");
    		console.log("You have a " + percentageMatched + "% match with User: " + fields[0].FirstName);
    			}
    		});

    		connection.resume();

    		counter = 0;
    		
    		});

		
    		//connection.end();
		  
	}

	else {
		console.log("Selected Mentee, Do match with mentors");

		var queryForMentee = connection.query('SELECT * FROM UserSurveyResults WHERE Q6 LIKE ? AND UserID <> ?', [mentor, id]);
    		queryForMentee.on('error', function(err) {
    			throw err;
			});
 
			queryForMentee.on('fields', function(fields) {
    		//console.log(fields);
			});
 
			queryForMentee.on('result', function(row) {
			var counter = 0;
			connection.pause();

			console.log("Checking next row");
    		
    		if(row.Q1 === answer1) {
    			console.log("Q1 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}

    		if(row.Q2 === answer2) {
    			console.log("Q2 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}

    		if(row.Q9 === answer9) {
    			console.log("Q9 Matched with: " + row.UserID);
    			counter = counter + 1;
    		}

    		var percentageMatched = Math.floor((counter/3) * 100);
    		Math.round(percentageMatched);
    		
    		connection.query('SELECT FirstName FROM Users WHERE UserID = ?', [row.UserID] , function(error, fields, rows) {
    		if (percentageMatched >= 60) {
    		//connection.query('SELECT FirstName FROM Users WHERE UserID = ?', [row.UserID] , function(error, fields, rows) {
    		//console.log("UserId " + row.UserID + " matched " + counter + " out of 3");
    		console.log("You have a " + percentageMatched + "% match with User: " + fields[0].FirstName);
    			}
    		});
    

    		connection.resume();

    		counter = 0;

    		});

		}

	

	
			//connection.end();
	

	res.render('survey_complete');

});



passport.serializeUser(function(user_id,done){
	done(null, user_id);
});
passport.deserializeUser(function(user_id,done){
	done(null, user_id);
});

//-----------------------------------------------------------------------------
// 	Analytics/Reports
//-----------------------------------------------------------------------------

// To add a new statistic, add a SQL connection query to getAnalytics() in same format
// Then, assign the desired results to a data['variable'] variable
// Finally, assign the data['variable'] to variable in apt.get('/report'...res.render(...)

app.get('/admin', authenticationMiddleware(), function(req, res, next) {
	console.log("Generating Statistics Report");
	var id = req.session.passport.user;
	var musrs = 'No Data', fusrs = 'No Data', ousrs = 'No Data';

	getAnalytics(id, req, function(err,data) {
		if(err) throw err;
		res.render('report', { 
			totalusers: data['totalusers'],
			maleusers: musrs,
			femaleusers: fusrs,
			otherusers: ousrs,
			sessionsonline: data['sessionsonline'],
			totalprograms: data['organizationscount'],
			programlist: data['programlist'],
			accountflagscount: data['accountflagscount']
		});
	});
});

function getAnalytics(id, req, callback) {
	var dict = {}

	connection.query('SELECT COUNT(*) AS totalcount FROM Users', function(err, turows){
	connection.query('SELECT COUNT(*) AS sessioncount FROM sessions', function(err, sorows){
	connection.query('SELECT COUNT(*) AS organizationscount FROM Programs', function(err, ocrows){
	connection.query('SELECT ProgramName AS programlist, Website AS websitelist FROM Programs', function(err, prgrows){
	connection.query('SELECT AccountFlag AS accountflagscount FROM Users', function(err, afrows){
	//connection.query('QUERY', function(err, nth-rows){
		if (err) callback(err,null);

		// Count of total # of users
		console.log('Total Users Registered:' + turows[0].totalcount);
		dict.totalusers = turows[0].totalcount;

		// Count of active sessions
		console.log('User Sessions Acitve: ' + sorows[0].sessioncount);
		dict.sessionsonline = sorows[0].sessioncount;

		// Count of total # of progams
		console.log('Total # Organizations: ' + ocrows[0].organizationscount);
		dict.organizationscount = ocrows[0].organizationscount;

		// Array of all programs
		var programlist = [];
		for(i=0;i<prgrows.length;i++) {
			programlist.push(prgrows[i].programlist);
			programlist.push(prgrows[i].websitelist);	
		};
		dict.programlist = programlist;
		console.log('Programs List: ' + dict.programlist);

		// Array of account flags
		var mentee = 0; var mentor = 0; var alumni = 0; var admin = 0;
		var accountflagscount = [mentee, mentor, alumni, admin];
		for(i=0;i<afrows.length;i++) {
			if(afrows[i].accountflagscount == 0) { // Mentee
				accountflagscount[0]++;
			} else if (afrows[i].accountflagscount == 1) { // Mentor
				accountflagscount[1]++;
			} else if (afrows[i].accountflagscount == 2) { // Alumni
				accountflagscount[2]++;
			} else if (afrows[i].accountflagscount == 3) { // Admin
				accountflagscount[3]++;
			}
		};
		dict.accountflagscount = accountflagscount;
		console.log('Account flags count: ' + dict.accountflagscount);

		callback(null, dict);	
	//});
	}); // Account Flags
	}); // Programs
	}); // programs count
	}); // Sessions online count
	});	// Total users count
}

app.get('/report', authenticationMiddleware(), function(req, res) {
	console.log("Displaying report generation option.");
	res.render('generateReport', {});
});



//-----------------------------------------------------------------------------
//	Functions
//-----------------------------------------------------------------------------
function isMentee(){

	return (req,res,next) => 
	{
		if(req.isAuthenticated())
		{
			var userID = req.session.passport.user; 

			connection.query("select AccountFlag from Users where UserID =" + userID ,  function(err, results, fields) {
				if(err) {
					res.redirect('/');
				}
				var accountID = results[0].AccountFlag;

				if (accountID == 0) {
				return next();
				}
				
				res.redirect('/');
			});
		}
		
		res.redirect('/');
	}

}

function isMentor(){
	return (req,res,next) => {
		if(req.isAuthenticated()) {
		var userID = req.session.passport.user; 

		connection.query("select AccountFlag from Users where UserID =" + userID ,  function(err, results, fields) {

			var accountID = results[0].AccountFlag;

			if (accountID == 1 || accountID == 2) {
			return next();
			}
			
			res.redirect('/');
		});
	}
	res.redirect('/');

	}

}

function isAdmin() {
	return (req,res,next) => {
		if(req.isAuthenticated()) {
			var userID = req.session.passport.user; 

			connection.query("select AccountFlag from Users where UserID =" + userID ,  function(err, results, fields) {

				var accountID = results[0].AccountFlag;

				if (accountID == 3) {
					return next();
				}
				
				res.redirect('/');
			});

		}
		res.redirect('/');
	}
}


function authenticationMiddleware () {  
	return (req, res, next) => {
		//	console.log(req.session.passport.user);
		
			if (req.isAuthenticated()) return next();
			
	    res.redirect('login');
	}
}


//was getting error using middleware with the function below


io.sockets.on('connection', function(socket){

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
	
	// Send PM
	socket.on('pm', function(data){
		console.log(data);
		io.to(clients[data.user].socket).emit('new pm', {msg: data.msg, user: socket.username});
	});
	
	// New User
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		clients[data] = {
			"socket": socket.id
		};
		updateUsernames();
	});
	
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});

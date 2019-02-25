// Config file
const mysql = require('mysql'); 
const fs = require('fs');

module.exports.databaseOptions = {
	host: "sl-us-south-1-portal.49.dblayer.com",
	port: 16859,
	user: "admin",
	password: "75f2fddcecb66b11dc80a2ff79a8a3e9fa506ef24824c9b3ca2d",
	database: "PeerMentoring",
	ssl: { 
		ca: fs.readFileSync(__dirname + '/cert.crt')
	}
};

//Copy and paste the commented code into the top of other js files
/*
const filesystem = require('fs');
const mysql = require('mysql'); 
const fs = require('fs');

var config = require("./config");
const connection = mysql.createConnection({
	host: config.databaseOptions.host,port: config.databaseOptions.port,user: config.databaseOptions.user,
	password: config.databaseOptions.password,ssl: config.databaseOptions.ssl
});
*/
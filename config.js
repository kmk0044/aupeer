// Config file
const mysql = require('mysql'); 
const fs = require('fs');

module.exports.databaseOptions = {
	host: "remotemysql.com",
	port: 3306,
	user: "BM8Tf82m8B",
	password: "brekI0KAx1",
	database: "BM8Tf82m8B",
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
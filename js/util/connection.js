var mongoose = require('mongoose'),
	dateFormat = require('dateformat'),
	logger = require('./log').get(module),
	Q = require('q');

var dbconnection = null;

mongoose.initDB = function (config) {
	//mongodb://NEW USERNAME:NEW PASSWORD@127.0.0.1:27017/game
	// Build the connection string 
	var dbURI = "mongodb://" + config.database.host + "/" + config.database.database;
	//var dbURI = "mongodb://" + config.database.user+":"+config.database.password+"@"+config.database.host + "/" + config.database.database; 
	dbconnection = mongoose.connect(dbURI);
	// CONNECTION EVENTS
	// When successfully connected
	mongoose.connection.on('connected', function () {
		if(!dbconnection) {
			dbconnection = mongoose.createConnection(dbURI);
		}
		logger.info('Database -> Pool created for MongoDB host: ' + config.database.host);
	}); 

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {  
	  logger.info('Database -> connection error: ' + err);
	  dbconnection = null;
	}); 

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {  
	  mongoose.connection.close();
	  logger.info('Database -> connection disconnected');
	  dbconnection = null;
	});

	// If the Node process ends, close the Mongoose connection 
	process.on('SIGINT', function() {  
	  mongoose.connection.close(function () { 
	    logger.info('Database -> Mongoose default connection disconnected through app termination'); 
	    process.exit(0); 
	  });
	});
};

mongoose.getDbConnection = function () {
	return dbconnection;
};

// exports section
module.exports = mongoose;
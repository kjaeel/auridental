var mysql = require('mysql'),
	dateFormat = require('dateformat'),
	logger = require('./log').get(module),
	Q = require('q');

exports.initDB = function (config) {

	if (!!this.pool) {
		return;
	}

	try {
		this.connection = null;
		this.pool = mysql.createPool({
			connectionLimit : 150,
			host : config.databaseMysql.host,
			user : config.databaseMysql.userName,
			database : config.databaseMysql.databaseName
		});
		logger.info('Database pool created for MySQL host: ' + config.databaseMysql.host);
	} catch (e) {
		logger.error('Error initializing database pool.', e);
	}

	return this.pool;
};

exports.query = function (sql, params) {
	
	var deferred = Q.defer();
	
	this.pool.getConnection(function (err, connection) {
		if (err) {
			logger.error(err);
			deferred.reject(new Error(err));
			return;
		}

		if (connection) {
			connection.query(sql, params, function (err, results) {

				connection.release();
				connection = null;
				
				if (err) {
					deferred.reject(new Error(err));
					return;
				} else {
					deferred.resolve(results);
				}
			});
		} else {
			deferred.reject(new Error("Connection not recieved !!!"));
		}
	    
	});

	return deferred.promise;
};

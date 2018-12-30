var cluster         = require('cluster');
process.setMaxListeners(0);

// if(cluster.isMaster) {
//     var numWorkers = require('os').cpus().length;

//     console.log('Master cluster setting up ' + numWorkers + ' workers...');

//     for(var i = 0; i < numWorkers; i++) {
//         cluster.fork();
//     }

//     cluster.on('online', function(worker) {
//         console.log('Worker ' + worker.process.pid + ' is online');
//     });

//     cluster.on('exit', function(worker, code, signal) {
//         console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
//         console.log('Starting a new worker');
//         cluster.fork();
//     });
// } else {

// }

	var express         = require('express');
	const EventEmitter  = require('events');
	var os              = require('os');
	var cpuCount        = os.cpus().length;

	/** Get runtime settings based on command-line arguments: dev, prod, etc. with defaults */
	var commandLineArgs = require('minimist')(process.argv.slice(2));
	var env             = commandLineArgs['env'] || 'dev';
	var forcePort       = commandLineArgs['forcePort'];
	var logLevel        = process.env.LOG_LEVEL || 'debug';

	var configV1        = require('./js/conf/config').set(env).get(1);

	var express         = require('express'),
		cfenv           = require('cfenv'),
		http            = require('http'),
		logger          = require('./js/util/log').init(configV1, module, logLevel),
		utils           = require('./js/util/utils'),
		db              = require('./js/util/connection');

	db.initDB(configV1);

	var office 		   = require('./js/routes/office');
	var incoming 	   = require('./js/routes/incoming');
	//var historic 	   = require('./js/routes/historic');
	var incomingModel = require('./js/models/incoming-model');

	//set cron job for status update
	var CronJob = require('cron').CronJob;
	new CronJob('0 0 */6 * * *', function() {
	//new CronJob('*/20 * * * * *', function() {
			console.log('You will see this message every 6 hours');
		incomingModel.updateIncomingStatus();
	}, null, true);

	var app            = express();
	var appEnv         = cfenv.getAppEnv();
	
	if (forcePort) {
		logger.warn('Port forced to ' + forcePort + '.');
	}
	var port = forcePort || appEnv.port || configV1.app.port;

	require('./js/conf/config').appInit(app, express, __dirname);

	if (!commandLineArgs['env']) {
		logger.warn('Environment switch not passed in - defaulting to `dev`.');
	} else {
		logger.info('Received environment switch for env: ' + commandLineArgs['env'] + '.');
	}
	
	app.use(express.static('public'))
	
	app.use(function (req, res, next) {
		var reqBody = null;

		try {
			reqBody = req.body || null;
		} catch (e) {
			logger.error("Request body parsing error.");
			utils.throwError(true, errorMessages.E1103, 400, errorMessages.E1103, null, res);
		} finally {
			req.reqBody = reqBody;

			if(req.headers && req.headers.authToken && req.headers.authToken!= 'null') {
				req.userData = jwt.getUserDataFromToken(req, res);
			}
		}
		
		next();
	});

	app.use(function (req, res, next) {
		var dbConnection = db.getDbConnection();
		if (dbConnection) {
			next();
		} else {
			logger.error("Database -> Database connection error.");
			utils.throwError(true, "Database connection error.", 500, errorMessages.E1104, null, res);
		}
	});

	/** REST endpoints - one per noun. */
	// Session
	app.use('/api/v1/office', office);
	app.use('/api/v1/incoming', incoming);
	//app.use('/api/v1/historic', historic);

	var server = http.createServer(app).listen(port, function () {
		logger.info('HTTP/Express server listening on port ' + port + '.');
	});
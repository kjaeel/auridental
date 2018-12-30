module.exports = {
	app : {
		version : 1,
		env : 'staging',
		port : 6004 
	},
	// database : {
	// 	host : '<host>',
	// 	user : 'voot',
	// 	password : 'voot123',
	// 	database : 'voot'
	// },
	database : {
		host : ['172.31.0.200'],
		password : 'voot$redis@123'
	},
	databaseMysql : {
		host : 'localhost',
		userName : 'root',
		password : '',
		databaseName : 'voot-heartbeat-service'
		
	},
	mixpanel : {
		token : 'bea78ceb7ab75d563e9747ec0849a5b3'
	},
	log : {
		enabled : true,
		outputs : {
			console : {
				enabled : true
			},
			file : {
				enabled : true,
				fileName : 'voot-api-',
				dirName : './logs',
				fileMaxSize : 10 * 1024 * 1024,
				maxFiles : 10
			}
		}
	},
	const : {
		SKIPPABLE_PATH_PARTS : 4
	}
};

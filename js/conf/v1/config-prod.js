module.exports = {
	app : {
		version : 1,
		env : 'prod',
		port : 6004 
	},
	// database : {
	// 	host : '<host>',
	// 	user : 'voot',
	// 	password : 'voot123',
	// 	database : 'voot'
	// },
	database : {
		host : ['hb-1-001.mbzq1s.0001.apse1.cache.amazonaws.com'],
		password : 'voot$redis@123'
	},
	databaseMysql : {
		host : 'localhost',
		userName : 'root',
		password : '',
		databaseName : 'voot-heartbeat-service'
		
	},
	mixpanel : {
		token : 'ba091e94aaa3555a84b19f2ac5ed8a26'
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

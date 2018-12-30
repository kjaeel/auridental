module.exports = {
	app : {
		version : 1,
		env : 'dev',
		port : 6004 
	},
	// database : {
	// 	host : '<host>',
	// 	user : 'applause',
	// 	password : 'applause123',
	// 	database : 'applause'
	// },
	database : {
		host : '127.0.0.1',
		user : '',
		password : '',
		database : 'auridental'
	},
	log : {
		enabled : true,
		outputs : {
			console : {
				enabled : true
			},
			file : {
				enabled : true,
				fileName : 'apls-api-',
				dirName : './logs',
				fileMaxSize : 10 * 1024 * 1024,
				maxFiles : 10
			}
		}
	},
	const : {
        CLOUD_BUCKET : "<cloud_bucket>"
	}
};

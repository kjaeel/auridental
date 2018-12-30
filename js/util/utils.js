var dateFormat = require('dateformat');
var logger = require('./log');

var configConst = {};
var crypto = require('crypto')
  , key = 'abcdefghijklmnop'
  , iv = 'fdsfds85435nfdfs';

exports.messageFactory = function () {
	return {
		code : 0,
		errorMessage : '',
		displayMessage : '',
		data : []
	};
};

exports.jsonWriter = function (message, statusCode, res) {
	if(!res) {
		var res = this.res;
	}
	var messageJSON = JSON.stringify(message);

	try {
		res.set("Connection", "close");
		res.contentType('json');
	} catch (e) {
		logger.error('Token -> JSONWRITER', e);
	}

	if (statusCode) {
		//console.timeEnd(res.req.originalUrl);
		try {
			res.status(statusCode).end(messageJSON);
		} catch (e) {
			res.end(messageJSON);
		}
	} else {
		res.end(messageJSON);
	}

	message.data = [];
	message.error = 0;
};

exports.setResponse = function (res) {
	this.res = res;
};

exports.getResponse = function () {
	return this.res;
};

exports.setRequest = function (req) {
	this.req = req;
};

exports.getRequest = function () {
	return this.req;
};

exports.throwError = function (code, errorMessage, statusCode, displayMessage, data, res) {
	var message = exports.messageFactory();
	message.code = code;
	message.errorMessage = errorMessage;
	message.displayMessage = displayMessage;
	message.data = data;
	exports.jsonWriter(message, 200, res);
};

exports.parseJSON = function (jsonString) {
	try {
		var obj = JSON.parse(jsonString);
		if (obj && (typeof obj === 'object')) {
			return obj;
		}
	}
	catch (e) {
	}
};

exports.formatDate = function (date) {
	if (date instanceof Date) {
		return dateFormat(date, 'dd mmmm yyyy');
	} else {
		return null;
	}
};

exports.escapeSingleQuotes = function (string, escapeChar) {
	escapeChar = escapeChar || '\\';
	return string ? string.replace(/'/g, escapeChar + "'") : null;
};

exports.setConstants = function (configConst) {
	this.configConst = configConst;
};

exports.getConstants = function () {
	return {
		cacheTTL : "24",//hours
		veDelete : "1",
		vuThresholdVal : "10"
	};
};

exports.getServerPath = function (req) {
	try{
		var host = req.get('host');
    	var protocol = req.protocol;
    	return protocol + '://' + host;
	} catch(e) {
		return null;
	}
}

exports.jwt_secret = "1ZRiukvqIucljaEGvUDGujuVLUsNGK7v0deAlQe4lRvwsLjYnDG7WLPIw05gfxf";

exports.encryptAES = function(text) {
 var cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
 var crypted = cipher.update(text, 'utf-8', 'hex');
 crypted += cipher.final('hex');
 return crypted;
}

exports.decryptAES = function(text) {
 decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
 var decrypted = decipher.update(text, 'hex', 'utf-8');
 decrypted += decipher.final('utf-8');
 return decrypted;
}
// import npm packages
var Q = require('q');
// import files
var logger = require('../util/log').get(module);
//services
// models
var userModel = require('../models/user-model');

// POST User operation to register / save user
var saveUser = function (userDetails) {
	var deferred = Q.defer();
	console.log("insput data-->",userDetails);
	if (validateUserDetails(userDetails)) {
		console.log("User details validated:", userDetails);

		userModel.saveUser(userDetails)
		.then(function success(result) {
			deferred.resolve(result);
		}, function failure(err) {
			logger.debug("user Registration -> user details save failure: " + err);
			deferred.reject(err);
		});

	} else {
		var err = new Error("user Registration -> user details validation failed !!!");
		logger.debug(err);
		deferred.reject(err);
	}

	return deferred.promise;
};

// Validating user details send in requests
var validateUserDetails = function (userDetails) {
	if (!userDetails
		|| !userDetails.userName 
		|| !userDetails.password
		) {
		return(false);
	} else {
		return(true);
	}
};

var getUser = function (userDetails) {
	var deferred = Q.defer();

	userModel.getUser(userDetails)
	.then(function (result){
		deferred.resolve(result);
	}, function (err){
		deferred.reject(err);
	});

	return deferred.promise;
};

var login = function (userDetails) {
	var deferred = Q.defer();

	userModel.userLogin(userDetails)
	.then(function (result){
		
		deferred.resolve(result);
	}, function (err){
		deferred.reject(err);
	});

	return deferred.promise;
};
// POST User operation to update user
var updateUser = function (userDetails) {
	var deferred = Q.defer();
	userModel.updateUser(userDetails)
	.then(function success(result) {
		deferred.resolve(result);
	}, function failure(err) {
		logger.debug("user Update -> user details update failure: " + err);
		deferred.reject(err);
	});
	return deferred.promise;
};

// exports section 
exports.saveUser = saveUser;
exports.getUser = getUser;
exports.login = login;
exports.updateUser = updateUser;

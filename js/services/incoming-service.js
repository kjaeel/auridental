// import npm packages
var Q = require('q');
// import files
var logger = require('../util/log').get(module);
//services
// models
var incomingModel = require('../models/incoming-model');

// POST User operation to register / save user
var addIncoming = function (userDetails) {
	var deferred = Q.defer();
	console.log("insput data-->",userDetails);
	if (validateIncomingDetails(userDetails)) {
		console.log("incoming details validated:", userDetails);
		incomingModel.addIncoming(userDetails)
		.then(function success(result) {
			deferred.resolve(result);
		}, function failure(err) {
			logger.debug("addIncoming Registration -> addIncoming details save failure: " + err);
			deferred.reject(err);
		});

	} else {
		var err = new Error("addIncoming Registration -> addIncoming details validation failed !!!");
		logger.debug(err);
		deferred.reject(err);
	}

	return deferred.promise;
};

// Validating user details send in requests
var validateIncomingDetails = function (userDetails) {
	if (!userDetails
		|| !userDetails.caseNumber 
		|| !userDetails.pat
		|| !userDetails.user_id	
		|| (!userDetails.status)) {
		return(false);
	} else {
		return(true);
	}
};

var getIncoming = function (userDetails) {
	var deferred = Q.defer();

	incomingModel.getIncoming(userDetails)
	.then(function (result){
		deferred.resolve(result);
	}, function (err){
		deferred.reject(err);
	});

	return deferred.promise;
};
//
// POST User operation to update user
var updateIncoming = function (userDetails) {
	var deferred = Q.defer();
	incomingModel.updateIncoming(userDetails)
	.then(function success(result) {
		deferred.resolve(result);
	}, function failure(err) {
		logger.debug("updateIncoming Update -> updateIncoming details update failure: " + err);
		deferred.reject(err);
	});
	return deferred.promise;
};


var getDelivered = function (userDetails) {
	var deferred = Q.defer();

	incomingModel.getDelivered(userDetails)
	.then(function (result){
		deferred.resolve(result);
	}, function (err){
		deferred.reject(err);
	});

	return deferred.promise;
};
// exports section 
exports.addIncoming = addIncoming;
exports.getIncoming = getIncoming;
exports.updateIncoming = updateIncoming;
exports.getDelivered = getDelivered;

/**
 * Case Number
Tooth Number
Doctor Name
Status
user_id (fk)
created_at
updated_at
 */

 // Express router
var router           = require('express').Router();
var Q                = require('q');
// services and other utilities
var logger           = require('../util/log').get(module);
var utils            = require('../util/utils');
var error            = require('../util/error-message').error;
var display          = require('../util/display-message').display;
var incomingService      = require('../services/incoming-service');
var verifyToken 	 = require('../util/verify-token');
var jwt    			 = require('jsonwebtoken');

// POST API - For user
router.post(['/addIncoming'], function (req, res) {

	var message = utils.messageFactory();

	var incomingDetails = req.body || null;	// user details data in POST Request body

	incomingService.addIncoming(incomingDetails)
	.then(function success(result) {
		if(!result){
			message.displayMessage = display.D0009; 
			message.data = {};	
			utils.jsonWriter(message, 200, res);
		} 
		else{
			message.displayMessage = display.D0021; 
			message.data = {result};
			utils.jsonWriter(message, 200, res);
		} 
	}, function failure (err) {
		if (err.code) {
			logger.error("like -> add inconing error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("like -> add inconing error : " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

router.post(['/updateIncoming'],function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.body || null;	// user details data in POST Request body
	console.log("input req :",userDetails);
	incomingService.updateIncoming(userDetails)
	.then(function success(result) {
		message.displayMessage = display.D0002;
		message.data = result;
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("user -> updation error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("user -> updation error : " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

router.get(['/getIncoming'],function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.query || null;	// user details data in POST Request body
	incomingService.getIncoming(userDetails)
	.then(function success(result) {
		message.data = result;
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("user -> getUser error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("user -> getUser error : " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

router.get(['/getDelivered'],function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.query || null;	// user details data in POST Request body
	console.log(userDetails);
	incomingService.getDelivered(userDetails)
	.then(function success(result) {
		message.data = result;
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("user -> getUser error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("user -> getUser error : " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

// exports section
module.exports = router;
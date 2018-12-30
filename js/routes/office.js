// Express router
var router           = require('express').Router();
var Q                = require('q');
// services and other utilities
var logger           = require('../util/log').get(module);
var utils            = require('../util/utils');
var error            = require('../util/error-message').error;
var display          = require('../util/display-message').display;
var userService      = require('../services/user-service');
var verifyToken 	 = require('../util/verify-token');
var jwt    			 = require('jsonwebtoken');

// POST API - For user
router.post(['/register'], function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.body || null;	// user details data in POST Request body

	userService.saveUser(userDetails)
	.then(function success(result) {
		if(!result){
			message.displayMessage = display.D0022; 
			message.data = {};	
			utils.jsonWriter(message, 200, res);
		} 
		else{
			message.displayMessage = display.D0019; 
			message.data = {result};
			utils.jsonWriter(message, 200, res);
		} 
	}, function failure (err) {
		if (err.code) {
			logger.error("like -> registration error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("like -> registration error : " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

router.post(['/login'], function (req, res) {

	var message = utils.messageFactory();
	var password;
	var userDetails = req.body || null;	// user details data in POST Request body
	if (!userDetails.password) {
        logger.error("user -> registration error : " + "Parameter password required or incorrect");
		utils.throwError(999, 'Parameter password required or incorrect', 200, error.E0002, null, res);
    }else{
        password = req.body.password;
    }
    
    if(userDetails.userName){
        var userName = req.body.userName;
        var data = {
            userName : userName,
            password: password
        };
    }else if(userDetails.email){
         var email = req.body.email;
         var data = {
            email : email,
            password: password
        };
    } else{
	        logger.error("user -> login error : " + "Parameter phone or email required or incorrect");
        	utils.throwError(999, 'Parameter phone or email required or incorrect', 200, error.E0002, null, res);
    }
	userService.login(data)
	.then(function success(result) {
		try{
			var dateObj = new Date();
	        var expires = dateObj.getTime() + 86400*1000; // expire after 24 hour
	        var sercet = utils.jwt_secret;
	        var token = jwt.sign(JSON.stringify(result),sercet);
		}catch(e){
			console.log("exception :",e);
		}
		message.displayMessage = display.D0007;
		message.data = {user : result};
		res.setHeader('authToken',token);
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("user -> login error : " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0001, null, res);
		} else {
			logger.error("user -> login error : " + err);
			utils.throwError(999, display.D0008, 200, error.E0001, null, res);
		}
	});
});

router.post(['/updateUser'],verifyToken,function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.reqBody || null;	// user details data in POST Request body

	userService.updateUser(userDetails)
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

router.get(['/getUser'],function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.query || null;	// user details data in POST Request body
	userService.getUser(userDetails)
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

router.post(['/likedItems'],verifyToken,function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.reqBody || null;	// user details data in POST Request body
	if (!userDetails.id) {
        logger.error("user -> likedItems error : " + "Parameter id required or incorrect");
		utils.throwError(999, 'Parameter id required or incorrect', 200, error.E0002, null, res);
    }
	userService.likedItems(userDetails)
	.then(function success(result) {
		message.displayMessage = display.D0002;
		message.data = {};
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

router.post(['/forgotPassword'], function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.reqBody || null;	// user details data in POST Request body

	userService.forgotPassword(userDetails)
	.then(function success(result) {
		if(!result){
			message.displayMessage = "Failure sending otp."; 
			message.data = {};	
		} 
		else{
			message.displayMessage = display.D0017; 
			message.data = result;	
		} 
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("Forgot password -> error sending opt: " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("Forgot password -> error sending opt: " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

router.post(['/resetPassword'], function (req, res) {

	var message = utils.messageFactory();

	var userDetails = req.reqBody || null;	// user details data in POST Request body

	userService.resetPassword(userDetails)
	.then(function success(result) {
		if(!result){
			message.displayMessage = "Failure resetting password."; 
			message.data = {};	
		} 
		else{
			message.displayMessage = display.D0018; 
			message.data = result;	
		} 
		utils.jsonWriter(message, 200, res);
	}, function failure (err) {
		if (err.code) {
			logger.error("Reset password -> error setting password: " + err.message);
			utils.throwError(err.code, err.message, 200, error.E0002, null, res);
		} else {
			logger.error("Reset password -> error setting password: " + err);
			utils.throwError(999, err.message, 200, error.E0002, null, res);
		};
	});
});

// exports section
module.exports = router;
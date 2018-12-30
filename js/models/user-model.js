var Q = require('q');
// DB Drivers / packages
//var mongoose = require('mongoose');
var mongoose = require('../util/connection');
var logger = require('../util/log').get(module);
var utils = require('../util/utils');
var moment = require('moment');

var Schema = mongoose.Schema;
mongoose.Promise = Q.Promise;

const escapeStringRegexp = require('escape-string-regexp');

// create a schema
var userSchema = new Schema({
  updatedAt : {type : Date ,default : new Date()},
  createdAt : {type : Date },
  officeName: {type: String, trim: true},
  phoneNo: { type: String},
  email : { type :String },
  userName : { type :String },
  password : {type : String },
  address : {type : String },
  userType :{type: String, default : "office"}
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
//Transform
userSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// model creation for user schema
var User = mongoose.model('office', userSchema);

// save user details
var saveUser = function (userDetails) {
  var deferred = Q.defer();
  var query = User.find();
  var mobile = null, email = null, password = null;
  if(userDetails && userDetails.userName) {
    query.where('userName').eq(userDetails.userName);
  }
  //if(userDetails.phoneNo) mobile = utils.encryptAES(userDetails.phoneNo);
  //if(userDetails.password) password = utils.encryptAES(userDetails.password);
  query.exec()
  .then(function (result) {
    if(result && !result.length){
      
      var userDetailsObj = {
      // required parameters
        createdAt : new Date(),
        officeName: userDetails.firstName,
        phoneNo: userDetails.phoneNo,
        email : userDetails.email,
        userName : userDetails.userName,
        password : userDetails.password,
        address :userDetails.address
      };

      var userObj = new User(userDetailsObj);

      userObj.save(function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          delete userObj._doc.createdAt;
          delete userObj._doc.updatedAt;
          delete userObj._doc.password;
          delete userObj._doc.__v;
          deferred.resolve(userObj);
        }
      }); 
    }else{
      deferred.resolve(false);
    }
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

var getUser = function(userDetails) {
    var deferred = Q.defer();
    var query = User.find();
    query.where('userType').eq("office");//{ userType: { $eq: "office" } }
    if(userDetails && userDetails.email) {
      var email = userDetails.email;
      query.where('user').eq(email);
    }

    if(userDetails && userDetails.userId) {
      query.where('_id').eq(userDetails.userId);
    }
  query.exec()
  .then(function (result) {
    for (var i = 0; i < result.length; i++) {
          delete result[i]._doc.createdAt;
          delete result[i]._doc.updatedAt;
          delete result[i]._doc.password;
          delete result[i]._doc.__v;    
    };
    deferred.resolve(result);
  }, function (err) {
    deferred.reject(err);
  });
return deferred.promise;
}

// update user details
var updateUser = function (userDetails) {
 var deferred = Q.defer();
 var id = userDetails.id;
 console.log("delete id :",delete userDetails.id);
 var hex = /[0-9A-Fa-f]{6}/g;
 id = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
 User.findOneAndUpdate({'_id' : id },{$set : userDetails}, {new: true}, function(err, result) {
    if (err) {
      deferred.reject(err);
    } else {
      delete result._doc.createdAt;
      delete result._doc.updatedAt;
      delete result._doc.password;
      delete result._doc.__v;
      deferred.resolve(result);
    }
  }); 
   return deferred.promise;
};

var userLogin = function(userDetails){
   var deferred = Q.defer();
   User.findOne(userDetails).exec(function(err, user){
        if(err){
            deferred.reject(err);
            return;
         }
        if(!user){
            deferred.reject(false);
            return;
        }else{
            delete user._doc.createdAt;
            delete user._doc.updatedAt;
            delete user._doc.password;
            delete user._doc.__v;
            var id = user._id;
            delete user._id;
            user["id"] = id;
            deferred.resolve(user);
        }
    });
  return deferred.promise;
}


function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

var resetPassword = function (resetPasswordDetails) {
  var deferred = Q.defer();
  User.update({'_id' : resetPasswordDetails.userId},{ $set: {password: resetPasswordDetails.password}}, function(err, result) {
     if (err) {
       deferred.reject(err);
     } else {
       deferred.resolve(result);
     }
   }); 
    return deferred.promise;
 };

// exports section
exports.saveUser = saveUser;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.userLogin = userLogin;
exports.resetPassword = resetPassword;
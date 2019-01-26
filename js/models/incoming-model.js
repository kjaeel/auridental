var Q = require('q');
// DB Drivers / packages
//var mongoose = require('mongoose');
var mongoose = require('../util/connection');
var logger = require('../util/log').get(module);
var utils = require('../util/utils');
var moment = require('moment');
var forEachAsync = require('forEachAsync').forEachAsync;
var Schema = mongoose.Schema;
mongoose.Promise = Q.Promise;

const escapeStringRegexp = require('escape-string-regexp');

// create a schema
var incomingSchema = new Schema({
  updatedAt : {type : Date ,default : new Date()},
  createdAt : {type : Date },
  caseNumber: {type: String, trim: true},
  pat: { type: String, index: true}, 
  status : { type :String },
  user_id : {
    type: Schema.ObjectId,
    ref: 'office'
  }
  
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
//Transform
incomingSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};
incomingSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// model creation for user schema
var Incoming = mongoose.model('incoming', incomingSchema);

// save user details
var addIncoming = function (userDetails) {
  var deferred = Q.defer();
  var query = Incoming.find();
  if(userDetails && userDetails.caseNumber) {
    query.where('caseNumber').eq(userDetails.caseNumber);
  }
  var id = userDetails.user_id;
  console.log("delete id :",delete userDetails.id);
  var hex = /[0-9A-Fa-f]{6}/g;
  id = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
  //if(userDetails.phoneNo) mobile = utils.encryptAES(userDetails.phoneNo);
  //if(userDetails.password) password = utils.encryptAES(userDetails.password);
  query.exec()
  .then(function (result) {
    if(result && !result.length){
      
      var incomingDetailObj = {
      // required parameters
        createdAt : new Date(),
        caseNumber: userDetails.caseNumber,
        pat:  userDetails.pat,      
        status : userDetails.status,      
        user_id : id
      };

      var incomingObj = new Incoming(incomingDetailObj);

      incomingObj.save(function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          delete incomingObj._doc.updatedAt;
          delete incomingObj._doc.__v;
          deferred.resolve(incomingObj);
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

var getIncoming = function(userDetails) {
    var deferred = Q.defer();
    var query = Incoming.find(userDetails);
    // if(userDetails && userDetails.user_id) {
    //   var user_id = userDetails.user_id;
    //   query.where('user_id').eq(user_id);
    // }

    // if(userDetails && userDetails.caseNumber) {
    //   query.where("caseNumber").eq(userDetails.caseNumber);
    // }

    // if(userDetails && userDetails.patientName) {
    //   query.where("patientName").eq(userDetails.patientName);
    // }   

    // if(userDetails && userDetails.caseNumber) {
    //   query.where("doctorName").eq(userDetails.doctorName);
    // }
  query.exec()
  .then(function (result) {
    for (var i = 0; i < result.length; i++) {
          delete result[i]._doc.updatedAt;
          delete result[i]._doc.__v;    
    };
    deferred.resolve(result);
  }, function (err) {
    deferred.reject(err);
  });
return deferred.promise;
}

// update user details
var updateIncoming = function (userDetails) {
 var deferred = Q.defer();
 var id = userDetails.id;
 console.log("delete id :",delete userDetails.id);
 var hex = /[0-9A-Fa-f]{6}/g;
 id = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
 Incoming.findOneAndUpdate({'_id' : id },{$set : userDetails}, {new: true}, function(err, result) {
    if (err) {
      deferred.reject(err);
    } else {
      console.log(result);
      if(result){
        deferred.resolve(result);
      }else{
        deferred.reject("record not found.")
      }
    }
  }); 
   return deferred.promise;
};

// update user details
var updateIncomingStatus = function () {
  var deferred = Q.defer();
  var query = Incoming.find();
  query.where('status').eq("Process Finished");
  var d = new Date();
  console.log("current date :",d);
  d.setDate(d.getDate()-1);
  console.log("before 24 hours :",d);
  query.where('updatedAt').lte(new Date(d));
  query.exec()
  .then(function (result) {
    for (var i = 0; i < result.length; i++) {
          //delete result[i]._doc.updatedAt;
          delete result[i]._doc.__v;    
    };
      // waits for one request to finish before beginning the next
    forEachAsync(result, function (next, element, index, result) {
      var id = element.id;
      console.log("delete id :",delete element.id);
      var hex = /[0-9A-Fa-f]{6}/g;
      id = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
      Incoming.findOneAndUpdate({'_id' : id },{$set : {status : "Delivered"}}, {new: true}, function(err, result) {
         if (err) {
           console.log(err);
           next();
           //deferred.reject(err);
         } else {
           console.log(result);
           next();
         }
       });  
    }).then(function () {
      console.log('All requests have finished');
      deferred.resolve(result);
    });
  }, function (err) {
    deferred.reject(err);
  }); 
    return deferred.promise;
 };

var getDelivered = function(userDetails) {
  var deferred = Q.defer();
  var query = Incoming.find();
  query.where('status').eq("Delivered");
  if(userDetails.user_id){
    query.where('user_id').eq(userDetails.user_id);
  }
  // var d = new Date();
  // console.log("current date :",d);
  // d.setDate(d.getDate()-1);
  // console.log("before 24 hours :",d);
  // query.where('updatedAt').lte(new Date(d));
  query.exec()
  .then(function (result) {
    for (var i = 0; i < result.length; i++) {
          //delete result[i]._doc.updatedAt;
          delete result[i]._doc.__v;    
    };
    deferred.resolve(result);
  }, function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

// exports section
exports.addIncoming = addIncoming;
exports.getIncoming = getIncoming;
exports.updateIncoming = updateIncoming;
exports.getDelivered = getDelivered;
exports.updateIncomingStatus = updateIncomingStatus;

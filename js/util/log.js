var winston = require('winston');

exports.init = function (config, callingModule, logLevel) {
 var transports = [];
 var printTimetsamp = false;
 var colorize = false;
 if(config && config.const && config.const.VERSION == 'develop') {
    printTimetsamp = true;
    colorize = true;
 }
 this.config = config;
 this.logLevel = logLevel;

 if (config.log.enabled) {
  if (config.log.outputs.console.enabled) {
   transports.push(new (winston.transports.Console)({
    timestamp : printTimetsamp,
    level: logLevel,
    colorize : colorize,
    prettyPrint : true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    //json: true,
    label: getLabel(callingModule)
   }));
  }

  if (config.log.outputs.file.enabled) {
   transports.push(new (winston.transports.File)({
    timestamp : true,
    level: 'debug',
    filename : './logs/debug.log',
    maxsize : config.log.outputs.file.fileMaxSize,
    maxFiles : config.log.outputs.file.maxFiles,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    //json : true,
    label: getLabel(callingModule)
   }));
  }
 }

 var logger = new (winston.Logger)({
  transports : transports, 
  exceptionHandlers: [
        //new (winston.transports.Console)({ json: true, timestamp: true }),
        new winston.transports.File({ filename: './logs/exceptions.log', json: true })
      ],
    exitOnError: false
});

 return logger;
};

exports.get = function (callingModule) {
  var transports = [];
  var printTimetsamp = false;
  var colorize = false;
  if(this.config && this.config.const && this.config.const.VERSION == 'develop') {
    printTimetsamp = true;
    colorize = true;
  }
 if (this.config.log.enabled) {
  if (this.config.log.outputs.console.enabled) {
   transports.push(new (winston.transports.Console)({
    timestamp : printTimetsamp,
    level: this.logLevel,
    colorize : colorize,
    prettyPrint : true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    //json: true,
    label: getLabel(callingModule)
   }));
  }

  if (this.config.log.outputs.file.enabled) {
   transports.push(new (winston.transports.File)({
    timestamp : true,
    level: 'debug',
    filename : './logs/debug.log',
    maxsize : this.config.log.outputs.file.fileMaxSize,
    maxFiles : this.config.log.outputs.file.maxFiles,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    //json : true,
    label: getLabel(callingModule)
   }));
  }
 }

 var logger = new (winston.Logger)({
  transports : transports, 
  exceptionHandlers: [
        //new (winston.transports.Console)({ json: true, timestamp: true }),
        new winston.transports.File({ filename: './logs/exceptions.log', json: true })
      ],
    exitOnError: false
});
  //set label according to each file module
  // logger1.transports.console.label = getLabel(callingModule);
  // logger1.transports.file.label = getLabel(callingModule);

  return logger;
};

var getLabel = function(callingModule) {
    var filename = callingModule.filename.replace(/^.*[\\\/]/, '');
    return filename;
};
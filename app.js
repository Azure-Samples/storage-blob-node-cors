
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var storage = require('azure-storage');
var config = require('./config.js');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8080, function () {
    createContainer(function(error) {
        if(error) throw error;
        
        console.log('Container created successfully');
        
        setCors(function(error) {
            if(error) throw error;

            console.log('Cors rule set successfully');
            console.log('Example app listening on port 8080!');
        });
    })
});

module.exports = app;

function setCors(callback) {
    
    var cn = config.connectionString;
    var blobService = storage.createBlobService(cn);
    var tableService = storage.createTableService(cn);
    
    blobService.getServiceProperties(function (error, properties) {
        if (error) return callback(error);
        
        properties.Cors = {
            CorsRule: [{
                    AllowedOrigins: ['*'],
                    AllowedMethods: ['POST', 'GET', 'HEAD', 'PUT'],
                    AllowedHeaders: ['*'],
                    ExposedHeaders: ['*'],
                    MaxAgeInSeconds: 3600
                }]
        };
        
        blobService.setServiceProperties(properties, function (error) {
            if(error) return callback(error);
            
            tableService.getServiceProperties(function (error, properties) {
                if(error) return callback(error);
                
                properties.Cors = {
                    CorsRule: [{
                        AllowedOrigins: ['*'],
                        AllowedMethods: ['POST', 'GET', 'HEAD', 'PUT'],
                        AllowedHeaders: ['*'],
                        ExposedHeaders: ['*'],
                        MaxAgeInSeconds: 3600
                    }]
                };
                
                tableService.setServiceProperties(properties, function (error) {
                    return callback(error);
                });
            })
        });
    });
    
}

function createContainer(callback) {
    var cn = config.connectionString;
    var blobService = storage.createBlobService(cn);

    var options = { publicAccessLevel: 'container' };
    blobService.createContainerIfNotExists(config.containerName, options, function(error) {
        return callback(error);
    });
}
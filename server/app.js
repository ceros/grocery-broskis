/**************************************************************************************************
 *      Peer Review -- API Backend Server
 *
 * Provides the API backend for the Peer Review website.  Implements a RESTful API.  Runs as a
 * stateless node server, with state pushed out to either a Redis instance or a MySQL database.
 *
 **************************************************************************************************/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

// Initialize the database connection with settings from our environment configuration.
console.log('Connecting to the database...');
var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME 
});
connection.connect();


// Load express.
var app = express();


// Setup a view engine, we'll use Handlebars (http://handlebarsjs.com/)
//
// @TODO Since this is just a RESTful API server, we don't actually need any views.  However,
// express crashes when you don't set some sort of view engine.  I didn't feel like debugging it
// so it's here.
//
// And actually looking a little more closely, that crash might be because we render an error view
// down below in the error handler.  I'll sort it out later.
console.log('Loading the view engine...');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


console.log('Using a logger...');
// Use a development logger.
app.use(logger('dev'));


console.log('Loading middle ware...');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const static_path = path.join(__dirname, '../dist');
app.use(express.static(static_path));

console.log('Serving static content from ' + static_path + '.');


// Get the api router, pre-wired up to the controllers.
const router = require('./router')(connection);


// Load our router at the ``/api/v0/`` route.  This allows us to version our api. If,
// in the future, we want to release an updated version of the api, we can load it at
// ``/api/v1/`` and so on, with out impacting the old versions of the router.
console.log('Loading the router...');
app.use('/api/0.0.0/', router);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
console.log('Loading Error handler...');
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    // Log the error.
    console.log(err);


    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;

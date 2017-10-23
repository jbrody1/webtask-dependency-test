'use strict';
var utils = require('./utils');
var logger = utils.logger;
var promise = require('promise');
var extend = require('extend');

/* express stuff */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.listen(4000);

var handle = function(path, handler) {
	var wrapper = function(req, res) {
		return promise.resolve()
		// normalize get/post parameters
		.then(function() {
			req.params = req.method === 'GET' ? req.query : extend(req.query, req.body);
			return handler(req, res);
		})
		// return success response
		.then(function() {
			logger.debug('request complete', res.headersSent);
			return res.end();
		})
		// return error response
		.catch(function(err) {
			logger.debug('request failed');
			if (!res.headersSent) res.status(500).send(err);
			return utils.logError(err);
		});
	};
	app.get(path, wrapper);
	app.post(path, wrapper);
}

var test = function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/xml' });
	res.write(twiml.toString());
};

handle('/test', test);

module.exports = app;


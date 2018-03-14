var express = require('express');
var router = express.Router();
var debug = require('debug')('App');

module.exports = function(dataAccess) {

	router.get('/', function(req, res, next) {
		return res.send({
			msg: 'Welcome to the API!'
		});
	});

	router.get('/sources', function(req, res, next) {
		dataAccess.findSources().done(function(doc) {
			return res.json(doc);
		}, function(err) {
			console.log(err);
			return res.status(500).send({ msg: err });
		});
	});
	router.get('/sources/:id', function(req, res, next) {
		dataAccess.findSource(req.params.id).done(function(doc) {
			return res.json(doc);
		}, function(err) {
			console.log(err);
			return res.status(500).send({ msg: err });
		});
	});
	router.post('/sources', function(req, res, next) {
		dataAccess.insertNewSource(req.body).done(function() {
			return res.send({
				msg: 'Source inserted successfully.',
				source: req.body
			});
		});
	});

	router.post('/drafts/sre', function (req, res, next) {
		// TODO
	});

	return router;
};

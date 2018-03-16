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

	router.get('/drafts/:stage', function(req, res, next) {
		switch(req.params.stage) {
			case 'sre':
				dataAccess.findDraft('5aa9449e190391d445004d8e').done(function(doc) {
					return res.json(doc);
				}, function(err) {
					console.log(err);
					return res.status(500).send({ msg: err });
				});
				break;
			default:
				return res.send({
					msg: 'No valid stage!',
					invalid_stage: req.params.stage
				});
		}
		
	});
	router.post('/drafts/:stage', function (req, res, next) {
		switch(req.params.stage) {
			case 'sre':
				dataAccess.updateDraft('5aa9449e190391d445004d8e', req.body);
				return res.send({
					msg: 'Updated sre-draft.',
					draft: req.body
				});
				break;
			default:
				return res.send({
					msg: 'No valid stage to update!',
					invalid_stage: req.params.stage,
					draft: req.body
				});
		}
	});

	router.post('/sres', function(req, res, next) {
		dataAccess.insertNewSre(req.body).done(function() {
			return res.send({
				msg: 'Sre inserted successfully.',
				source: req.body
			});
		});
	});

	return router;
};

var express = require('express');
var router = express.Router();
var debug = require('debug')('App');

module.exports = function(dataAccess) {
	var draft_id_map = {
		'sre': '5aa9449e190391d445004d8e'
	}

	router.get('/', function(req, res, next) {
		return res.send({
			msg: 'Welcome to the API!'
		});
	});

	router.get('/:stage', function(req, res, next) {
		dataAccess.findAllIn(req.params.stage).done(function(doc) {
			return res.json(doc);
		}, function(err) {
			console.log(err);
			return res.status(500).send({ msg: err });
		});
	});

	router.get('/:stage/:id', function(req, res, next) {
		var trueId = req.params.id in draft_id_map ? draft_id_map[req.params.id] : req.params.id;
		dataAccess.findDocIn(req.params.stage, trueId).done(function(doc) {
			return res.json(doc);
		}, function(err) {
			console.log(err);
			return res.status(500).send({ msg: err });
		});
	});

	router.post('/:stage', function(req, res, next) {
		dataAccess.insertDocInto(req.params.stage, req.body).done(function() {
			return res.send({
				msg: 'Inserted into '+req.params.stage+' successfully.',
				source: req.body
			});
		});
	});

	router.post('/drafts/:id', function (req, res, next) {
		var o_id = draft_id_map[req.params.id];
		dataAccess.replaceDocIn('drafts', draft_id_map[req.params.id], req.body);
		return res.send({
			msg: 'Updated draft for '+req.params.id+'.',
			draft: req.body
		});
	});

	return router;
};

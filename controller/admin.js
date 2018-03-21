var express = require('express');
var router = express.Router();
var debug = require('debug')('App');

module.exports = function(dataAccess) {
	var draft_id_map = {
		'sre': '5aa9449e190391d445004d8e',
		'q0': '5ab24b6d6439bf3d2dd095ff',
		'q1': '5ab24b756439bf3d2dd09600',
		'q2': '5ab24b786439bf3d2dd09601',
		'q3': '5ab24b7a6439bf3d2dd09602',
		'q4': '5ab24bc36439bf3d2dd09603',
		'process': '5ab24eb96439bf3d2dd09604',
		'result': '5ab24eb96439bf3d2dd09605'
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

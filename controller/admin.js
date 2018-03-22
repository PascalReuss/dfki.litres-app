var express = require('express');
var router = express.Router();
var debug = require('debug')('App');

module.exports = function(dataAccess) {

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
		dataAccess.findDocIn(req.params.stage, req.params.id).done(function(doc) {
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

	router.post('/:stage/:id', function (req, res, next) {
		dataAccess.replaceDocIn(req.params.stage, req.params.id, req.body);
		return res.send({
			msg: 'Updated ['+req.params.stage+']-doc of id ['+req.params.id+'].',
			doc: req.body
		});
	});

	return router;
};

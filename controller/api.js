var express = require('express');
var router = express.Router();
var debug = require('debug')('App');

module.exports = function(dataAccess) {

	// router.get('/', function(req, res, next) {
	// 	// note: needs an empty document in collection info initially ... (in an 'init-litResearch' function, this would need to be created)
	// 	dataAccess.findAllIn('info').done(function(doc) {
	// 		return res.json(doc[0])
	// 	});
	// });

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
			// update ts in info
			dataAccess.findAllIn('info').done(function(doc) {
				var newInfo = doc[0];
				newInfo['latest-Update'] = Date.now();
				dataAccess.replaceDocIn('info', newInfo['_id'], newInfo);
			});
			return res.send({
				msg: 'Inserted into '+req.params.stage+' successfully.',
				source: req.body
			});
		});
	});

	router.post('/:stage/:id', function (req, res, next) {
		dataAccess.replaceDocIn(req.params.stage, req.params.id, req.body).done(function() {
			// update ts in info
			dataAccess.findAllIn('info').done(function(doc) {
				var newInfo = doc[0];
				newInfo['latest-Update'] = Date.now();
				dataAccess.replaceDocIn('info', newInfo['_id'], newInfo);
			});
			return res.send({
				msg: 'Updated ['+req.params.stage+']-doc of id ['+req.params.id+'].',
				doc: req.body
			});
		});
	});

	return router;
};

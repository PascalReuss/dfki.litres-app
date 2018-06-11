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

	var updateTsInInfo = function(litResId) {
		dataAccess.findDocIn('info',litResId).done(function(newInfo) {
			newInfo['latest-Update'] = Date.now();
			dataAccess.replaceDocIn('info', newInfo['_id'], newInfo);
		});
	};
	
	router.post('/:stage', function(req, res, next) {
		dataAccess.insertDocInto(req.params.stage, req.body).done(function() {
			if (req.params.stage === 'sources') {
				updateTsInInfo(req.body['litRes'][0]);
			} else if (req.params.stage !== 'info') {
				updateTsInInfo(req.body['litRes']);
			}
			return res.send({
				msg: 'Inserted into '+req.params.stage+' successfully.',
				source: req.body
			});
		});
	});

	router.post('/:stage/:id', function (req, res, next) {
		dataAccess.replaceDocIn(req.params.stage, req.params.id, req.body).done(function() {
			if (req.params.stage !== 'info') {
				updateTsInInfo(req.body['litRes']);
			}
			return res.send({
				msg: 'Updated ['+req.params.stage+']-doc of id ['+req.params.id+'].',
				doc: req.body
			});
		});
	});

	return router;
};

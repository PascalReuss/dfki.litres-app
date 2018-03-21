var express = require('express');
var router = express.Router();

module.exports = function(dataAccess) {

    router.get('/', function(req, res) {
        return res.render('admin_panel/index', {
            _title_: 'Admin'
        });
    });

    router.get('/sre', function(req, res) {
        dataAccess.findAllIn('sources').done(function(sources) {
            return res.render('admin_panel/sre', {
                _title_: 'Admin - SRE',
                sources: sources
            });
        }, function(err) {
            console.log(err);
            return res.status(500).send({ msg: err });
        });
    });

    // router.get('query', function(req, res) {
    // });

    router.get('/query/:slotId', function(req, res) {
        dataAccess.findAllIn('sources').done(function(sources) {
            return res.render('admin_panel/query', {
                _title_: 'Admin - Query',
                sources: sources,
                querySlot: req.params.slotId
            });
        });
    });

    return router;
};

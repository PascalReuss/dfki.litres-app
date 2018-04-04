var express = require('express');
var router = express.Router();

module.exports = function(dataAccess) {

    router.get('/', function(req, res) {
        dataAccess.findAllIn('sres').done(function(sres) {
            dataAccess.findAllIn('queries').done(function(queries) {
                dataAccess.findAllIn('processes').done(function(processes) {
                    dataAccess.findAllIn('results').done(function(results) {
                        return res.render('admin/index', {
                            title: 'Admin',
                            sres: sres,
                            queries: queries,
                            processes: processes,
                            results: results
                        });
                    });
                });
            });
        });
    });

    router.get('/:stage', function(req, res) {
        var draftDoc = {
            'status': 'draft'
        };
        if (req.query.prev_ptr !== undefined)
            draftDoc['prev_ptr'] = req.query.prev_ptr;

        console.log(draftDoc);

        dataAccess.insertDocInto(req.params.stage, draftDoc).done(function(doc) {
            var obj = doc.ops[0];
            return res.redirect('/admin/'+req.params.stage+'/'+obj._id);
        }, function(err) {
            console.log(err);
            return res.status(500).send({ msg: err });
        });
    });

    router.get('/:stage/:id', function(req, res) {
        // TODO: check for if item has status="done", if so then reject
        dataAccess.findAllIn('sources').done(function(sources) {
            return res.render('admin/'+req.params.stage, {
                title: 'Admin - '+req.params.stage,
                sources: sources
            });
        });
    });

    return router;
};

var express = require('express');
var router = express.Router();

module.exports = function(dataAccess) {

    // router.get('/:litRes/', function(req, res) {
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

    // router.get('/:litRes/:stage', function(req, res) {
    router.get('/:stage', function(req, res) {
        var draftDoc = {
            'status': 'draft'
        };
        if (req.query.prev_ptr !== undefined)
            draftDoc['prev_ptr'] = req.query.prev_ptr;

        dataAccess.insertDocInto(req.params.stage, draftDoc).done(function(doc) {
            var obj = doc.ops[0];
            return res.redirect('/admin/'+req.params.stage+'/'+obj._id);
        }, function(err) {
            console.log(err);
            return res.status(500).send({ msg: err });
        });
    });

    // router.get('/:litRes/:stage/:id', function(req, res) {
    router.get('/:stage/:id', function(req, res) {
        dataAccess.findAllIn('sources').done(function(sources) {
            if (req.params.stage === 'processes') {     // if process-item, then provide only sources used in previous query instead of all sources
                dataAccess.findDocIn('processes',req.params.id).done(function(procItem) {
                    dataAccess.findDocIn('queries', procItem.prev_ptr).done(function(queryItem) {
                        var filteredSources = sources.filter(function(elem) {
                            return queryItem.srcs.includes(elem._id.toString());
                        });
                        console.log(filteredSources);
                        return res.render('admin/'+req.params.stage, {
                            title: 'Admin - '+req.params.stage,
                            sources: filteredSources
                        });        
                    });
                });
            } else {
                return res.render('admin/'+req.params.stage, {
                    title: 'Admin - '+req.params.stage,
                    sources: sources
                });
            }
        });
    });

    return router;
};

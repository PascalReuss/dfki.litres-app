var express = require('express');
var router  = express.Router();

module.exports = function(dataAccess) {

    router.get('/sources', function(req, res) {
        dataAccess.findAllIn('sources').done(function(srcs) {
            res.render('visu/sources', {
                title: 'All Sources',
                sources: srcs
            });
        });
    });

    router.get('/:litRes', function(req, res) {
        dataAccess.findDocIn('info', req.params.litRes).done(function(litRes) {
            dataAccess.findAllWhere('sources',{litRes:req.params.litRes}).done(function(srcs) {
                dataAccess.findAllWhere('sres',{litRes:req.params.litRes}).done(function(sres) {
                    dataAccess.findAllWhere('queries',{litRes:req.params.litRes}).done(function(queries) {
                        dataAccess.findAllWhere('processes',{litRes:req.params.litRes}).done(function(processes) {
                            dataAccess.findAllWhere('results',{litRes:req.params.litRes}).done(function(results) {
                                return res.render('visu/index', {
                                    title: 'Progress Overview',
                                    litRes: litRes,
                                    sources: srcs,
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
        });
    });
  
    router.get('/:litRes/sources', function(req, res) {
        dataAccess.findAllWhere('sources',{litRes:req.params.litRes}).done(function(srcs) {
            res.render('visu/sources', {
                title: 'Sources Catalogue',
                sources: srcs
            });
        });
    });

  return router;
};

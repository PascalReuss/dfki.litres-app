var express = require('express');
var router  = express.Router();

module.exports = function(dataAccess) {

    router.get('/', function(req, res) {
        dataAccess.findAllIn('sources').done(function(srcs) {
            dataAccess.findAllIn('sres').done(function(sres) {
                dataAccess.findAllIn('queries').done(function(queries) {
                    dataAccess.findAllIn('processes').done(function(processes) {
                        dataAccess.findAllIn('results').done(function(results) {
                            return res.render('visu/index', {
                                title: 'Visualization',
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
  
    router.get('/sources', function(req, res) {
        dataAccess.findAllIn('sources').done(function(srcs) {
            res.render('visu/sources', {
                _title_: 'Sources',
                sources: srcs
            });
        });
    });

  return router;
};

var express = require('express');
var router  = express.Router();

module.exports = function(dataAccess) {

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

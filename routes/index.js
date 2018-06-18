var express = require('express');
var router  = express.Router();

module.exports = function(dataAccess) {

  router.get('/', function(req, res) {
    dataAccess.findAllIn('info').done(function(doc) {
      res.render('index', {
        info: doc
      });
    });
  });
  
  return router;
};

var express = require('express');
var router  = express.Router();

module.exports = function(dataAccess) {

  router.get('/', function(req, res) {
    dataAccess.findAllIn('info').done(function(doc) {
      res.render('index', {
        _title_: 'Boilerplate Bootstrap-NodeJS-Express App',
        info: doc[0]
      });
    });
  });
  
  return router;
};

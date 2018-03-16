var express = require('express');
var router = express.Router();

module.exports = function(dataAccess) {

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
  
  return router;
};

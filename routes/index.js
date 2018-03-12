var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    _title_: 'Boilerplate Bootstrap-NodeJS-Express App',
    users: []
  });
});

router.get('/sre', function(req, res) {
  // TODO: load latest SRE and prefill fields (? ... this would make SREs not have a unique ts)
  res.render('sre', {});
});

module.exports = router;

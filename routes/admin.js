var express = require('express');
var router  = express.Router();

router.get('/sre', function(req, res) {
  // TODO: load latest SRE and prefill fields (? ... this would make SREs not have a unique ts)
  res.render('admin_panel/sre', {
    _title_: 'Admin - SRE'
	});
});

module.exports = router;

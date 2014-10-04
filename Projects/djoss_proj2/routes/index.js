var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index/index', { title: 'Welcome to Fritter' });
});

module.exports = router;

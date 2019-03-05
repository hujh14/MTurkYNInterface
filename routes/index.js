var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET interface page. */
router.get('/interface', function(req, res, next) {
  res.render('interface', { title: 'Interface' });
});

module.exports = router;

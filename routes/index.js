var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kate is Awesome' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'registration' });
});

module.exports = router;

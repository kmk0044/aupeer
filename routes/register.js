var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('register');
  res.render('register', { title: 'Register' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.DOB);
  console.log(req.body.email);
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.confirm_password );
  
  const db = require('../db.js');

  res.render('register', { title: 'Registeration Complete' });
});

module.exports = router;

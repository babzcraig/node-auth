var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    activeClass: 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    activeClass: 'Login'
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* Member's page */
router.get('/', ensureAuthenticated , function(req, res, next) {
  res.render('index', { activeClass: 'Members' });
});

function ensureAuthenticated(req, res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash('sucess', 'Please sign in to proceed');
  res.redirect('/users/login');
}

module.exports = router;

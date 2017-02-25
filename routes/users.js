var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: '../uploads/' })

var User = require('../models/user');

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

router.post('/register', upload.single('profileImage'),  function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  // Check for image fields
  if(req.file) {
    console.log('uploading file...');
    var profileImageOriginalName = req.file.originalname;
    var profileImageName = req.file.filename;
    var profileImageMime = req.file.mimetype;
    var profileImagePath = req.file.path;
    var profileImageSize = req.file.size;
  } else {
    // Set default image
    var profileImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email  is not valid email').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();
  if (errors) {

    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUser = new User({
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      profileImage: profileImageName
    });

    // Create User
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);  
    });
    // Success Message
    req.flash('success', 'You are now registered and may log in!');
    res.location('/');
    res.redirect('/');
  }
});




module.exports = router;

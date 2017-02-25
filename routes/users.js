var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../uploads/' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

  //Test bcrypt when open
  // var password = bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //                   if (err) throw err;
  //                   console.log('password',hash)
  //                   return hash
  //                 });
  // var password2 = bcrypt.hash(req.body.password2, saltRounds, function(err, hash) {
  //                   if (err) throw err;
  //                   console.log('password2',hash)
  //                 });


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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Unknown user');
        return done(null, false, {message: 'Unknown User'})
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) {return done(err)}
        if(isMatch) {
          return done(null, user);
        } else {
          console.log('invalid password');
          return done(null, false, {message: 'Invalid Password'});
        }
      });
    })
  }
));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}),
function(req, res, next) {
  console.log('Authentication successful');
  req.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/users/login')
});


module.exports = router;

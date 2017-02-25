var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('reading from mongo!')
});

//User Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  var isMatch = false;
  if (candidatePassword === hash) {
    isMatch = true
  }
  callback(null, isMatch)
}

module.exports.createUser = function(newUser, callback) {
  newUser.save(callback)
};

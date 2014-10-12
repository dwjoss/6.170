var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    following: [String]
});

var tweetSchema = mongoose.Schema({
    originalAuthor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String
});

var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);

exports.User = User;
exports.Tweet = Tweet;

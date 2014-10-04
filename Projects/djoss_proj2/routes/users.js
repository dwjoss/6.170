var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var db = req.db;
  var students = db.get('people');
  
  students.find({}, function(e, docs){
    res.render('users/index', { title: 'Users', 'individuals': docs });
  });
});

router.get('/new', function(req, res) {
    res.render('users/new', { title: 'Register' });
});

router.get('/existing', function(req, res) {
    var db = req.db;
    var tweets = db.get('tweets');
    
    tweets.find({}, function(e, docs){
        res.render('users/existing', { title: 'Fritter', username: req.session.username, 'tweets': docs });
    });
});

router.post('/create', function(req, res, next) {
    var db = req.db;
    var users = db.get('people');
    
    if (req.body.password === req.body.confirm_password) {
        users.insert({"username": req.body.username, "password": req.body.password}, function(err, docs){
            if (err){
                res.send("There was a problem");
            }
            else {
                req.session.username = req.body.username;
                res.redirect("/users/existing");
            }
        });
    }
    else {
        res.send("Passwords do not match");
    }
});

router.post('/login', function(req, res, next) {
    var db = req.db
    var users = db.get('people');
    
    users.findOne({"username": req.body.username, "password": req.body.password}, function(err, docs) {
        if (docs) {    
            req.session.username = req.body.username;
            res.redirect("/users/existing");
        }
        else {
            res.send("Incorrect username or password");
        }
    });
});

router.post('/logout', function(req, res, next) {
    req.session.username = null;
    
    req.session.destroy(function(err) {
        if (err) {
            res.send(err);
        }
    });
    res.redirect("/");
});

router.post('/addtweet', function(req, res, next) {
    var db = req.db;
    var tweets = db.get('tweets');

    if (req.session.username) {
        tweets.insert({"username": req.session.username, 'tweet': req.body.tweet_content});
        res.redirect("/users/existing");
        console.log(tweets);
    }
    else {
        res.redirect("/");
    }
});

router.post('/edittweet', function(req, res, next) {
    var db = req.db;
    var tweets = db.get('tweets');

    if (req.session.username) {
        tweets.update({"_id": req.body.tweetID}, {"username": req.session.username, 'tweet': req.body.edit});
        res.redirect("/users/existing");
    }
    else {
        res.redirect("/");
    }
});

router.post('/deletetweet', function(req, res, next) {
    var db = req.db;
    var tweets = db.get('tweets');

    if (req.session.username) {
        tweets.remove({'_id': req.body.tweetID});
        res.redirect("/users/existing");
    }
    else {
        res.redirect("/");
    }
});
module.exports = router;

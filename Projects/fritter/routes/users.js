var express = require('express');
var router = express.Router();
var data = require('../data/model');

router.get('/', function(req, res) {
    var db = req.db;

    data.User.find({}, function(err, people_doc) {
        if (!req.session.username) {
            res.redirect('/');
        }
        if (err) {
            res.send("Error finding users" + err);
        }
        else {
            data.Tweet.find({}, function(err, tweets) {
                data.Tweet.populate(tweets, {path: 'author originalAuthor'}, function(err, tweets_doc) {
                    if (err) {
                        res.send("There was a problem populating the author field of the tweet" + err);
                    }
                    else {
                        data.User.findOne({"username": req.session.username}, function(err, currentUser) {
                            if (currentUser) {
                                res.render('users/', { title: 'Fritter', 'username': req.session.username, 'following': currentUser.following, 
                                'individuals': people_doc, 'tweets': tweets_doc });
                            }
                        });
                    }
                });
            });
        }
    });
});

router.get('/new', function(req, res) {
    var db = req.db;
    
    if (req.session.username) {
        res.redirect('/users/');
    }
    else {
        res.render('users/new', { title: 'Register' });
    }
});

router.post('/create', function(req, res, next) {
    var db = req.db;
    
    if (req.body.password === req.body.confirm_password) {
        var newUser = new data.User({username: req.body.username, password: req.body.password, following: []});
        
        newUser.save(function(err) {
            if (err) {
                res.send("There was a problem" + err);
            }
            else {
                req.session.username = req.body.username;
                res.redirect("/users/");
            }
        });
    }
    else {
        res.send("Passwords do not match");
    }
});

router.post('/login', function(req, res, next) {
    var db = req.db;
    
    data.User.findOne({username: req.body.username, password: req.body.password}, function(err, docs) {
        if (docs) {    
            req.session.username = req.body.username;
            res.redirect("/users/");
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
    
    if (req.session.username) {
        data.User.findOne({username: req.session.username}, function(err, docs) {
            var newTweet = new data.Tweet({originalAuthor: docs._id, author: docs._id, content: req.body.tweet_content});
            
            newTweet.save(function(err) {
                if (err) {
                    res.send("There was an error saving the new tweet" + err);
                }
            });             

            res.redirect("/users/");
        });
    }
    else {
        res.redirect("/");
    }
});

router.post('/edittweet', function(req, res, next) {
    var db = req.db;
    
    if (req.session.username) {
        data.Tweet.update({"_id": req.body.tweetID},  {content: req.body.edit}, function(err, docs) {
            if (err) {
                res.send(err);
            }
        });
        
        res.redirect("/users/");
    }
    else {
        res.redirect("/");
    }
});

router.post('/deletetweet', function(req, res, next) {
    var db = req.db;
    
    if (req.session.username) {
        data.Tweet.remove({'_id': req.body.tweetID}, function(err, docs) {
            if (err) {
                res.send(err);
            }
        });
        
        res.redirect("/users/");
    }
    else {
        res.redirect("/");
    }
});

router.post('/retweet', function(req, res, next) {
    var db = req.db;
    
    if (req.session.username) {
        data.User.findOne({username: req.session.username}, function(err, current) {
            if (err) {
                res.send(err);
            }
            else {
                data.Tweet.findOne({"_id": req.body.tweetID}, function(err, tweet) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log(tweet);
                        data.User.findOne({"_id": tweet.originalAuthor}, function(err, docs) {
                            var newTweet = new data.Tweet({originalAuthor: docs._id, author: current._id, content: "(retweet from " + docs.username + ")" 
                            + tweet.content});
                
                            newTweet.save(function(err) {
                                if (err) {
                                    res.send("There was an error saving the new tweet" + err);
                                }
                            });
                        });
                    }
                });
            }
        
        });
        res.redirect("/users/");
    }
    else {
        res.redirect("/");
    }
});

router.post('/follow', function(req, res, next) {
    var db = req.db;
    
    if (req.session.username) {
       data.User.findOne({"username": req.session.username}, function(err, docs) {
           if (err) {
               res.send(err);
           }
           else {
               if (docs.following.indexOf(req.body.userID) === -1) {
                   docs.following.push(req.body.userID);
               }
               data.User.update({"username": req.session.username}, {following: docs.following}, function(err, docs) {
                   if (err) {
                       res.send(err);
                   }
               });
           }
       });
       
       res.redirect("/users/");
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;

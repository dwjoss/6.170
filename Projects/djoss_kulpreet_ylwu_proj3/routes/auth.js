/*
General logic for handling user authentication

AJAX requests are asynchronous to ensure that they run in the order shown

Author: Kulpreet
*/

var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt'); // Used for hashing passwords
var model = require('../data/model');
var router = express.Router();

/* POST User Login Info -> Handle Authentication With Passport -> User Object || 401 if login not successful || 500 if server error
   INPUT PARAMS: email, password
*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      model.User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { res.status(500).json({ error: 'There was an error logging you in.' }); }
        if (!user) {
          return res.status(401).json({ error: 'Incorrect username.' });
        }
        if (!user.validPassword(req.body.password)) {
          return res.status(401).json({ error: 'Incorrect password.' });
        }
	    req.logIn(user, function(err) {
	      if (err) { res.status(500).json({ error: 'There was an error creating the user session.' }); }
	      return res.json(user);
	    });
      });  
  })(req, res, next);
});

/* GET Logout Request -> Logout Session -> Redirect to Root 
   INPUT PARAMS: none
*/
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/* POST User Info -> Store in DB -> Login Session -> return User Object || 500 if Mongo Fails to Create User 
   INPUT PARAMS: name, email, password
*/
router.post('/create', function(req, res) {
	var password = bcrypt.hashSync(req.body.password, 10);
	var newUser = new model.User({ 	name: req.body.name, email: req.body.email, password: password });
	newUser.save(function(err, user) {
		if (err) {
			res.status(500).json({ error: 'There was an error creating the user.' });
		} else {
			var newRoom = new model.Room({_id: user._id});
			newRoom.save(function(err, room) {
				if (err) {
					res.status(500).json({ error: 'There was an error creating the user.' });
				} else {
					model.User.update({ _id: user._id },{ room : room }, function (err) {
						if (err) {
							res.status(500).json({ error: 'There was an error creating the room.' });
						}
						else {
							req.login(user, function(err) {
							  if (err) { return res.status(500).json({ error: 'There was an error creating the user session.' }); }
							  return res.json(user);
							});
						}
					});
				}
			});
		}	
	});
});

module.exports = router;

/*
REST API for YouTube Jukebox
All server and database interaction described below

Authors: Kulpreet, Dylan, Jason
*/

var express = require('express');
var passport = require('passport');
var model = require('../data/model');
var router = express.Router();

/*
   Parse the room id out of the url
*/
router.param('room', function(req, res, next, roomId) {
  model.Room.findOne({
    _id: roomId
  }, function(err, room) {
    if (room) {
      req.room = room;
      next();
    } else {
      return res.status(404).json({error: 'The room requested was not found.'});
    }
  });
});

/*
List YouTube results from search query
POST /search
Request parameters:
    query: (String) query string to be sent to youtube
Response:
    success(200): returns a list of YouTube json objects 
    error(500);  returns error message: “Unable to fetch results from YouTube.”
*/
router.post('/search', function(req, res) {
	var search = require('youtube-search');
	var opts = {
	  maxResults: 10,
	  startIndex: 1
	};
	search(req.body.query, opts, function(err, results) {
	  if(err) return res.status(500).json({message:'Unable to fetch results from YouTube.'});
	  res.json({"search-results":results});
	});
});


/* 
Get list of listeners of a room
GET  /rooms/:roomId/users
No request parameters
Response:
    success(200): returns the list of listeners in the room
    error(404): returns error message: 'The room requested was not found.'
*/
router.get('/rooms/:room/users',function(req,res){
    res.json({'listeners':req.room.listeners});
});


/*
Add a user to a room
POST /rooms/:roomId/users
Request parameters:
    name: name of the user to add to the room
Response:
    success(200): returns a list of listeners in the room
    error(500) returns error message: “There was an error joining the room.”
    error(404): returns error message: 'The room requested was not found.'
*/
router.post('/rooms/:room/users', function(req, res) {
	res.cookie('userName', req.body.name);
    model.Room.findByIdAndUpdate(
        req.room._id,
        {$push: {listeners: req.body.name}},
        function(err, room) {
            if (err) {
                return res.status(500).json({error: 'There was an error joining the room.'});
            }
            if (!room) {
                console.log("room not found");
                return res.status(404).json({error: 'The room requested was not found.'});
            }
            req.io.broadcast('users', {room: room._id, listeners: room.listeners});
            res.json({success: true});
        }
    );
});

/* 
Delete a user from a room
DELETE /rooms/:roomId/users/:name
No request parameters
Response:
    success(200): returns a message: [User] just left room [roomId]
    error(500) returns error message: “There was an error leaving the room.”
    error(404): returns error message: 'The room requested was not found.'
*/
router.delete('/rooms/:room/users/:name', function(req, res) {
    var name = req.params.name;
    model.Room.findByIdAndUpdate(
        req.room._id,  
        {$pull: {listeners: name}},
        function(err, room) {
            if (err) {
                return res.status(500).json({error: 'There was an error leaving the room.'});
            }
            if (!room) {
                return res.status(404).json({error: 'The room requested was not found.'});
            }
            req.io.broadcast('users', {room: room._id, listeners: room.listeners});
            return res.status(200).json({success: true});
        }
    );
});

/* 
Get list of songs from the queue of a room
GET  /rooms/:room/queue/songs
No request parameters
Response:
    success(200): returns the list of songs in the queue
    error(404): returns error message: 'The room requested was not found.'
*/
router.get('/rooms/:room/queue/songs', function(req, res) {
	res.json({"queue": req.room.queue});
});

/* 
Add a song to the queue of a room
POST '/rooms/:room/queue/songs'
Request parameters:
    song: song JSON
Response:
    success(200): returns the list of songs in the queue
    error(404): returns error message: 'The room requested was not found.'
    error(500): returns error message: 'There was an error adding song to the queue.'
*/
router.post('/rooms/:room/queue/songs', function(req, res) {
    console.log(req.body.song);
	model.Room.findByIdAndUpdate(
		req.room._id,
		{$push: {queue: JSON.parse(req.body.song)}},
		function(err,room){
			if (err) {
                return res.status(500).json({error: 'There was an error addding song to the queue.'});
            }
            if (!room) {
                return res.status(404).json({error: 'The room requested was not found.'});
            }
			req.io.broadcast('addsong', {room: room._id, song: req.body.song});
            res.json({success: true});
		}
	);
	
});

/* 
Pop off the first song from the queue of a room
DELETE '/rooms/:room/queue/songs'
No request parameters
Response:
    success(200): returns the list of remaining songs in the room
    error(404): returns error message: 'The room requested was not found.'
    error(500): returns error message: 'There was an error popping song off the queue.'
*/

router.delete('/rooms/:room/queue/songs', function(req, res) {
	if (req.user) {
        model.Room.findByIdAndUpdate(
            req.room._id,
            {$pull: {queue: req.room.queue[0]}},
            function(err,room){
	            if (err) {
	                return res.status(500).json({error: 'There was an error poping song off the queue.'});
	            }
	            if (!room) {
	                return res.status(404).json({error: 'The room requested was not found.'});
	            }
				req.io.broadcast('popsong', {room: room._id});
	            res.json({success:true});
            }
        ); 
    } else {
	   res.status(401);
	}
});

module.exports = router;

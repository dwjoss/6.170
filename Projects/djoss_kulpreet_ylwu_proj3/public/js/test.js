/*
AJAX Tests for YouTube Jukebox API

Authors: Dylan, Jason
*/

var testSearchResults;

$(document).ready(function() {
	// Testing Room Creation

	// create dummy user account
	var room;

	$.ajax({
	    type: 'POST',
	    url: '/auth/create',
	    async: false,
	    data: { 
	        email: "host@gmail.com", 
	        name: "host", 
	        password: "password" 
	    },
	    success: function(data){
	        room = data._id;
	        console.log('Tested POST auth/create');
	        console.log('Host created room ' + room);
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});


	// Testing API Methods

	// search for YouTube videos that match the query 'MIT'
	$.ajax({
	    type: 'POST',
	    url: '/api/search',
	    async: false,
	    data: { 
	        'query': 'MIT', 
	    },
	    success: function(response){
	        console.log('Tested POST api/search');
	        testSearchResults = response["search-results"];
	        
            for (var i = 0; i < testSearchResults.length; i++) {
                console.log(testSearchResults[i]);
            }
        
        }
	});

	// listener Dylan joins the room
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + room + '/users',
	    async: false,
	    data: {
	        'name': 'Dylan'
	    },
	    success: function(msg) {
	        console.log('Tested POST api/rooms/:room/users');
	        console.log('Dylan joined');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// listener Jason joins the room
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + room + '/users',
	    async: false,
	    data: {
	        'name': 'Jason'
	    },
	    success: function(msg) {
	        console.log('Tested POST api/rooms/:room/users');
	        console.log('Jason joined');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	$.ajax({
	    type: 'GET',
	    url: '/api/rooms/' + room + '/users',
	    async: false,
	    success: function(response) {
	        console.log('Tested GET api/rooms/:room/users');
	        var userString = "";
			$.each(response.listeners, function( index, user ) {
				userString = userString + user + ", ";
			});
			userString = userString.substring(0, userString.length - 2);
			console.log(userString + ' have joined the room')
	        
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});



	// someone adds a song "Turn Down For What" in the queue
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + room + '/queue/songs',
	    async: false,
	    data: {
	        'song': JSON.stringify(testSearchResults[0]),
	    },
	    success: function(msg) {
	        console.log('Tested POST api/queue/add');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// someone adds a song "Get Low" in the queue
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + room + '/queue/songs',
	    async: false,
	    data: {
	        'song': JSON.stringify(testSearchResults[1])
	    },
	    success: function(response) {
	        console.log('Tested POST api/queue/add');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// someone requests to see the list of songs in the queue
	$.ajax({
	    type: 'GET',
	    url: '/api/rooms/' + room + '/queue/songs',
	    async: false,
	    success: function(response) {
	        console.log('Tested GET api/rooms/:room/queue/songs');
	        console.log(response.queue);
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// the first song was popped from the list
	$.ajax({
	    type: 'DELETE',
	    url: '/api/rooms/' + room + '/queue/songs',
	    async: false,
	    success: function(response) {
	        console.log('Tested DELETE api/rooms/:room/queue/songs');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// listener Dylan leaves the room
	$.ajax({
	    type: 'DELETE',
	    url: '/api/rooms/' + room +'/users/Dylan',
	    async: false,
	    success: function(response) {
	        console.log('Tested DELETE api/rooms/:room/users/:name');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// Host logs out
	$.ajax({
	    type: 'GET',
	    url: '/auth/logout',
	    async: false,
	    success: function(msg) {
	        console.log('Tested POST auth/logout');
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});

	// Host logs back in
	$.ajax({
	    type: 'POST',
	    url: '/auth/login',
	    async: false,
	    data: {
	        'email': 'host@gmail.com',
	        'password': 'password'
	    },
	    success: function(msg) {
	        console.log('Tested POST auth/login');
	        console.log(msg);
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});
	
});

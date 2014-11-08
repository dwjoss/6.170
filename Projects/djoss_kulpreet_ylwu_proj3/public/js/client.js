/*
	Authors: Kulpreet, Dylan, Jason
*/

var isHost;
var roomID;
var listeners;
var ytplayer; // the YouTube player object
var searchResults;

Handlebars.registerPartial('search-results', Handlebars.templates['search-results']);
Handlebars.registerPartial('search-result', Handlebars.templates['search-result']);
Handlebars.registerPartial('queue-songs', Handlebars.templates['queue-songs']);
Handlebars.registerPartial('queue-song', Handlebars.templates['queue-song']);

// helper for displaying relevant video metadata in search-result.handlebars
Handlebars.registerHelper("getMetadataString", function(viewCount, duration) {
	return viewCount + " views | " + utils.parseTime(duration);
});

$(document).ready(function() {
	roomID = window.location.pathname.split('/')[2];
	
	$('#link input[type=text]').val(window.location);

	if ($('#status').text() === 'host'){
		isHost = true;
	} else {
		isHost = false;
		logInParticipant();
	}
	
	io = io.connect();

	$('#youtube-search').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
	
	$('#youtube-search').bind("enterKey",function(e) {
		var query = $(this).val();
		$.ajax({
		    type: 'POST',
		    url: '/api/search',
		    data: { 
		        'query': query, 
		    },
		    success: function(results){
		    	console.log("search");
		    	console.log(results);
		    	searchResults = results['search-results'];
				loadSearchResults(results);
		    }
		})
	});

	loadSongQueue(true);
	updateListenerList();
	
	// Listen for the new user event.
	io.on('users', function(data) {
		if (data.room === roomID) {
			updateListenerList();
		}
	})
	
	// Listen for the new song event.
	io.on('addsong', function(data) {
		if (data.room === roomID) {
	    	loadSongQueue(false);
		}
	})
	
	// Listen for song pop events.
	io.on('popsong', function(data) {
		if (data.room === roomID) {
	   		loadSongQueue(false);
		}
	})

});

$(document).on('click', '.add-button', function(){
	var index = parseInt($(this).attr('arrayIndex'));
	var song = getSearchResult(index);

	addSong(song);
});

var loadSearchResults = function(results){
	$('#search-results').html(Handlebars.templates['search-results'](results));
};

var loadSongQueue = function(refreshPlayer){
	$.ajax({
	    type: 'GET',
	    url: '/api/rooms/' + roomID + '/queue/songs',
	    success: function(response) {
	        $('#queue').html(Handlebars.templates['queue-songs']({'queue-songs':response.queue}));
	        if ((isHost && refreshPlayer) || response.queue.length === 1){
	        	console.log('load player');

				loadPlayer(response.queue[0]);
			}
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});	
}


var addSong = function(song){
	console.log(song);
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + roomID + '/queue/songs',
	    data: {'song': JSON.stringify(song)},
	    success: function(response) {
	    	loadSongQueue(false);
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});
}

var updateListenerList = function() {
	$.ajax({
	    type: 'GET',
	    url: '/api/rooms/' + roomID + '/users',
	    success: function(response) {
	    	var userString = "";
			$.each(response.listeners, function( index, user ) {
				userString = userString + user + ", ";
			});
			userString = userString.substring(0, userString.length - 2);
			$('#listeners').text(userString);
	    }
	});
};

var joinParticipant = function(room, userName) {
	$.ajax({
	    type: 'POST',
	    url: '/api/rooms/' + roomID + '/users',
	    data: {
	        'name': userName
	    },
	    success: function(msg) {
			$('#userName').text(userName);
			$('input[placeholder=Username]').val(userName);
			$('#joinRoom').modal('hide');
	    }
	});
}

var logInParticipant = function() {
	if ($.cookie('userName') == null) {
		$('#joinRoom').modal({backdrop: 'static', keyboard: false, show: true});
		$('#joinButton').click(function(e){
			var userName = $('#joinName').val();
			joinParticipant(roomID, userName);
		});
	} else {
		var userName = $.cookie('userName');
		joinParticipant(roomID, userName);
	}
}

var loadNextSong = function(){
	$.ajax({
	    type: 'DELETE',
	    url: '/api/rooms/' + roomID + '/queue/songs',
	    success: function(response) {
	        loadSongQueue(true);
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});
}
/*
YouTube logic

Reference: https://developers.google.com/youtube/js_api_reference
*/
var onYouTubePlayerReady = function(playerId) {
	ytplayer = document.getElementById("myytplayer");
	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

var onytplayerStateChange = function(newState) {
	// current song has ended
	if (newState === 0) {
		$('#waiting').show();
		$('#myytplayer').replaceWith("<div id='ytapiplayer'></div>");
		loadNextSong();
   }
}

var loadPlayer = function(song) {
	if (!song) {
		return;
	}
	
	var VIDEO_ID = utils.extractVideoID(song.url);

	//var VIDEO_ID = "hRp3ND-fBNw";

	$('#waiting').hide();
	var params = { allowScriptAccess: "always" };
	var atts = { id: "myytplayer" };
	swfobject.embedSWF('http://www.youtube.com/v/' + VIDEO_ID + 
					   '?enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1',
                   	   'ytapiplayer', '640', '390', '8', null, null, params, atts);
}

var getSearchResult = function(i) {
	return searchResults[i];
}
/*
    Author: Dylan
*/

var utils = {}

/*
    Convert a string of a number of seconds into the format
    mm:ss
*/
utils.parseTime = function(secs) {
    var secs = parseInt(secs);
    
    var mm = Math.floor(secs/60).toString();
    var ss = (secs % 60).toString();

    if (mm.length === 1) {
        mm = '0' + mm;
    }
    if (ss.length === 1) {
        ss = '0' + ss;
    }

    return mm + ':' + ss;
}

/*
    Given an YouTube video URL of the form 
    http://www.youtube.com/watch?v=hRp3ND-fBNw&feature=youtube_gdata,
    extract the ID i.e. hRp3ND-fBNw
*/
utils.extractVideoID = function(url) {
    var pos = url.indexOf('=');

    return url.substring(pos + 1, pos + 1 + 11);
}
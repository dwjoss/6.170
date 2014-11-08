Project 3: YouTube Jukebox
=====
An Express.js + MongoDB application that allows you to create real-time music playlists

Have a look here: [http://ytj-kulpreet.rhcloud.com/](http://ytj-kulpreet.rhcloud.com/)

To see the AJAX test results, go to [http://ytj-kulpreet.rhcloud.com/test](http://ytj-kulpreet.rhcloud.com/test) and look at the console output.

Who Did What
============
Kulpreet - user accounts, login/logout, sockets, room links

Dylan - YouTube search results and rendering, YouTube video integration/rendering

Jason - queue fetching/populating/editing, sockets

Note:
There's a bug in Express.io that prevents cookies from being updated in the same session, so a page refresh is required
for a participant to be removed from a room. For more details, see line 119 of server.js.
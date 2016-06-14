# NodeBB Youtube Lite Plugin

The Youtube Lite plugin now supports v3 of Youtubes API, this means you will need an API key. Find out more about that further down this document. 
Youtube Lite allows you to lazyload youtube videos into your NodeBB Forum with no code knowledge on the users end. (Just paste any video URL)


## Installation

    npm install nodebb-plugin-youtube-lite


##Changes in V3
    0.6.0
     - Works with NodeBB 1.0
     - Moved most of the work to the server, to include API calls (keeps API key
       from being exposed to users).
     - LRU cache to reduce quota usage.
     - Supports `t=`, '`start=`', `end=` query string parameters
     - With valid API key displays title, channel and duration information
     - Support `#` in query strings
	0.5.0
	 - Plugin now supports [Youtube API v3](https://developers.google.com/youtube/v3/?hl=en)
	
##Changes
    0.4.7
     - Changes to Desktop Video Size & Fixed CSS Issues
    0.4.5
     - Fixed how the video displays on mobiles. Should no longer extend past the viewport.
    0.4.4
     - Upgraded Regex so it doesn't match ANY 11 character string. Includes support for rel="nofollow". 
    0.4.1
     - Works with latest 0.7.x and hopefully beyond. Should also support time stamps. 
    0.3.1
     - Removed forced http from api and pre loaded image. 

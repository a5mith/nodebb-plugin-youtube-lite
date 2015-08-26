# NodeBB Youtube Lite Plugin

This NodeBB plugin allows users to embed Youtube videos inline with their posts, the added benefit of using this plugin, is it lazyloads each video when it's needed.
Saving precious time when loading long, youtube heavy topics. A preview image is loaded by default, the video is requested when play is clicked.


## Installation

    npm install nodebb-plugin-youtube-lite


##Changes
    0.4.6
     - Changes to Desktop Video Size
    0.4.5
     - Fixed how the video displays on mobiles. Should no longer extend past the viewport.
    0.4.4
     - Upgraded Regex so it doesn't match ANY 11 character string. Includes support for rel="nofollow". 
    0.4.1
     - Works with latest 0.7.x and hopefully beyond. Should also support time stamps. 
    0.3.1
     - Removed forced http from api and pre loaded image. 

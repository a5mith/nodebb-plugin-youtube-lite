(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$4" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$4"></iframe></div>';

	    var	regularUrl = /<a\s?(rel="nofollow")? href="((https?:\/\/www\.)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|(https?:\/\/)?youtu\.be\/)([a-zA-Z0-9_-]{6,11})"\s?(rel="nofollow")?>.+<\/a>/g;
        
    YoutubeLite.parse = function(data, callback) {
        if (!data || !data.postData || !data.postData.content) {
            return callback(null, data);
        }
        /* 
        if (data.postData.content.match(embedUrl)) { 
            data.postData.content = data.postData.content.replace(embedUrl, embed);
        }
        */
        if (data.postData.content.match(regularUrl)) {
        	
            data.postData.content = data.postData.content.replace(regularUrl, embed);
            
        }
        /*
        if (data.postData.content.match(shortUrl)) {
            data.postData.content = data.postData.content.replace(shortUrl, embed);
        }
        */
        callback(null, data);

    };

	module.exports = YoutubeLite;
}(module));

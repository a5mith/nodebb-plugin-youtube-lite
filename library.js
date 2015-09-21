(function(module) {
	"use strict";

	var YoutubeLite = {},
	    embed = '<div class="js-lazyYT" data-youtube-id="$4" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$4"></iframe></div>';

	var regularUrl = /<a.*?href="((https?:\/\/www\.)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|(https?:\/\/)?youtu\.be\/)([a-zA-Z0-9_-]{6,11})".*?<\/a>/g;
        
    YoutubeLite.parse = function(data, callback) {
        if (!data || !data.postData || !data.postData.content) {
            return callback(null, data);
        }
        if (data.postData.content.match(regularUrl)) {	
            data.postData.content = data.postData.content.replace(regularUrl, embed);
        }
        callback(null, data);

    };
	module.exports = YoutubeLite;
}(module));

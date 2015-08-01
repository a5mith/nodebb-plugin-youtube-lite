(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$1"></iframe></div>';

	    var	regularUrl = /<a href="http.?:.*(youtube.com|.*be\/|.*embed\/|watch\?.*v=|(\w{11})).*?<\/a>/g;
        
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

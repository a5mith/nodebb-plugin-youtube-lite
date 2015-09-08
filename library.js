(function(module) {
	"use strict";
        
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

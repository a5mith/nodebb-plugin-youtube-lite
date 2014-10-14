(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-width="640" data-height="360">Youtube Embed...</div>';


    YoutubeLite.parse = function(postContent, callback) {
        var	regularUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*" rel="nofollow">.+<\/a>/g;
        var	shortUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*" rel="nofollow">.+<\/a>/g;
        var	embedUrl = /<a href="(?:https?:\/\/)?(?:www\.)youtube\.com\/embed\/((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*" rel="nofollow"><\/a>/;

        if (postContent.match(embedUrl)) {
            postContent = postContent.replace(embedUrl, embed);
        }
        if (postContent.match(regularUrl)) {
            postContent = postContent.replace(regularUrl, embed);
        }
        if (postContent.match(shortUrl)) {
            postContent = postContent.replace(shortUrl, embed);
        }

        callback(null, postContent);
    };

	module.exports = YoutubeLite;
}(module));

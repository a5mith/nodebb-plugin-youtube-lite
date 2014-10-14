(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-width="640" data-height="360"><iframe class="lazytube-$1" src="//www.youtube.com/embed/$1"></iframe></div>';


    YoutubeLite.parse = function(postContent, callback) {
        var	regularUrl = /(?:<a (?:rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*">[^<a]+<\/a>+)/gm;
        var	shortUrl = /(?:<a(?: rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*">[^<a]+<\/a>)+/gm;
        var	embedUrl = /(?:<a (?:rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/((?:[\w\-_]+){11})\??([^&]+)?(&?[\w&=]+)*">[^<a]+<\/a>+)/;

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

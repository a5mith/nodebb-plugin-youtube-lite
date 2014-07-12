(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-width="640" data-height="360"></div>';


    YoutubeLite.parse = function(postContent, callback) {
        var	regularUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)(.+)">.+<\/a>/g;
        var	shortUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/(.+)">.+<\/a>/g;

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

(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-width="640" data-height="360"><iframe class="lazytube-$1" src="//www.youtube.com/embed/$1"></iframe></div>';


    YoutubeLite.parse = function(postContent, callback) {
        var	regularUrl = /<a (?:rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)(.+)">.+<\/a>/g;
        var	shortUrl = /<a (?:rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/(.+)">.+<\/a>/g;
        var	embedUrl = /<a (?:rel="nofollow")? href="(?:https?:\/\/)?(?:www\.)youtube\.com\/embed\/([\w\-_]+)">.+<\/a>/;

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

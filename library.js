(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$1"></iframe></div>';

    var	regularUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)(.+)">.+<\/a>/g,
        shortUrl = /<a href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/(.+)">.+<\/a>/g,
        embedUrl = /<a href="(?:https?:\/\/)?(?:www\.)youtube.com\/embed\/([\w\-_]+)">.+<\/a>/;

    YoutubeLite.parse = function(data, callback) {
        if (!data || !data.postData || !data.postData.content) {
            return callback(null, data);
        }
        if (data.postData.content.match(embedUrl)) {
            data.postData.content = data.postData.content.replace(embedUrl, embed);
        }
        if (data.postData.content.match(regularUrl)) {
            data.postData.content = data.postData.content.replace(regularUrl, embed);
        }
        if (data.postData.content.match(shortUrl)) {
            data.postData.content = data.postData.content.replace(shortUrl, embed);
        }
        callback(null, data);
    };

    YoutubeLite.updateParser = function(parser) {
        var renderImage = parser.renderer.rules.image || function(tokens, idx, options, env, self) {
                renderToken.apply(self, arguments);
            },
            regularUrl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)(.+)/,
            shortUrl = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/(.+)/,
            embedUrl = /(?:https?:\/\/)?(?:www\.)youtube.com\/embed\/([\w\-_]+)/;

        // If an image contains a youtube link, convert it!
        parser.renderer.rules.image = function (tokens, idx, options, env, self) {
            var src = tokens[idx].attrs[tokens[idx].attrIndex('src')][1];
            if (regularUrl.test(src)) {
                return src.replace(regularUrl, embed);
            } else if (shortUrl.test(src)) {
                return src.replace(shortUrl, embed);
            } else if (embedUrl.test(src)) {
                return src.replace(embedUrl, embed);
            } else {
                return renderImage(tokens, idx, options, env, self);
            }
        };
    };

	module.exports = YoutubeLite;
}(module));

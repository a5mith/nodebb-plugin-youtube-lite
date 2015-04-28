(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$1" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/$1"></iframe></div>';

    YoutubeLite.updateParser = function(parser) {
        var renderImage = parser.renderer.rules.image || function(tokens, idx, options, env, self) {
                return renderToken.apply(self, arguments);
            },
            regularUrl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)([\w\-_]+)/,
            shortUrl = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be)\/([\w\-_]+)/,
            embedUrl = /(?:https?:\/\/)?(?:www\.)youtube.com\/embed\/([\w\-_]+)/,
            tests = [regularUrl, shortUrl, embedUrl],
            token;

        // Just for fun, if an image contains a youtube link, convert it!
        parser.renderer.rules.image = function (tokens, idx, options, env, self) {
            var src = tokens[idx].attrs[tokens[idx].attrIndex('src')][1];
            if (regularUrl.test(src)) {
                return src.replace(regularUrl, embed);
            } else if (shortUrl.test(src)) {
                return src.replace(shortUrl, embed);
            } else if (embedUrl.test(src)) {
                return src.replace(embedUrl, embed);
            } else {
                return renderImage.apply(self, arguments);
            }
        };

        parser.renderer.rules['youtube-lite'] = function(tokens, idx, options, env) {
            return '<div class="js-lazyYT" data-youtube-id="' + tokens[idx].embedId + '" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/' + tokens[idx].embedId + '"></iframe></div>';
        };

        parser.inline.ruler.after('link', 'youtube-lite', function replace(state) {
            var found = false;
            tests.forEach(function(urlRegexp, idx) {
                if (!found && urlRegexp.test(state.src)) {
                    var match = state.src.match(urlRegexp),
                        id = match[1],
                        max = state.posMax;

                    state.pending = state.src.slice(0, match.index);
                    state.pos = match.index;
                    state.posMax = state.pos + match[0].length;

                    token = state.push('youtube-lite');
                    token.embedId = id;

                    state.pos = state.posMax + 1;
                    state.posMax = max;

                    state.pending = '';

                    found = true;
                }
            });

            return found;
        });
    };

	module.exports = YoutubeLite;
}(module));

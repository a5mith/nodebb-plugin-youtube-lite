(function(module) {
	"use strict";
	
		youtube-lite.init = function(params, callback) {

		params.router.get('/admin/plugins/youtube-lite', params.middleware.applyCSRF, params.middleware.admin.buildHeader, renderAdmin);
		params.router.get('/api/admin/plugins/youtube-lite', params.middleware.applyCSRF, renderAdmin);

		params.router.post('/api/admin/plugins/youtube-lite/save', params.middleware.applyCSRF, save);

		params.router.get('/admin/plugins/youtube-lite/oauth', authorize);

		callback();
	};

	function renderAdmin(req, res, next) {
		var data = {
			YoutubeID: settings.YoutubeID,
			YoutubeSecret: settings.YoutubeSecret,
		};
		res.render('admin/plugins/youtube-lite', {settings: data, csrf: req.csrfToken()});
	}

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

(function(module) {
	"use strict";

	var YoutubeLite = {},
		embed = '<div class="js-lazyYT" data-youtube-id="$5" data-ratio="16:9" data-parameters="rel=0"><iframe class="lazytube" src="//www.youtube.com/embed/$5"></iframe></div>';

	    var	regularUrl = /<a\s?(rel="nofollow")? href="((https?:\/\/www\.)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|(https?:\/\/)?youtu\.be\/)([a-zA-Z0-9_-]{6,11})"\s?(rel="nofollow")?>.+<\/a>/g;
     
	db.getObject('nodebb-plugin-youtube-lite', function(err, _settings) {
		if (err) {
			return winston.error(err.message);
		}
		settings = _settings || {};

	});

	youtube.init = function(params, callback) {

		params.router.get('/admin/plugins/youtube', params.middleware.applyCSRF, params.middleware.admin.buildHeader, renderAdmin);
		params.router.get('/api/admin/plugins/youtube', params.middleware.applyCSRF, renderAdmin);

		params.router.post('/api/admin/plugins/youtube/save', params.middleware.applyCSRF, save);

		callback();
	};

	function renderAdmin(req, res, next) {
		var data = {
			youtubeClientID: settings.youtubeClientID,
		};
		res.render('admin/plugins/youtube', {settings: data, csrf: req.csrfToken()});
	}

	function save(req, res, next) {
		var data = {
			youtubeClientID: req.body.youtubeClientID || '',
			};

		db.setObject('nodebb-plugin-youtube-lite', data, function(err) {
			if (err) {
				return next(err);
			}

			settings.youtubeClientID = data.youtubeClientID;
			res.status(200).json({message: 'Settings saved!'});
		});
	}     
     
        
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

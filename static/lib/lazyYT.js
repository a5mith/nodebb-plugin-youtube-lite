;(function ($) {
    'use strict';
	$.fn.lazyYT = function (e) {
		
        var $el = $(e.parentElement.parentElement),
            id = $el.data('youtube-id'),
            youtube_parameters = $el.data('parameters') || '';
		$el.html(
			'<iframe type="text/html" src="https://www.youtube.com/embed/' + id + '?' + youtube_parameters + '&autoplay=1" frameborder="0" allowfullscreen></iframe>')
			.addClass('lazyYT-video-loaded');
	};
}(jQuery));


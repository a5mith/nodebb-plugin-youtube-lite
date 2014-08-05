"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });

    $(window).on('action:topics.post', function() {
        $('.js-lazyYT').lazyYT();
    });


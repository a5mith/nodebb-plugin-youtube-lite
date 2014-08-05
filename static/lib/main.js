"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });

    $(window).on('action:composer.topics.post', function() {
        $('.js-lazyYT').lazyYT();
        console.log('lazyYT: fired');
    });


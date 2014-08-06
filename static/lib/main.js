"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });


    $(window).on('action:composer.posts.reply', function() {
        $('.js-lazyYT').lazyYT();
    });

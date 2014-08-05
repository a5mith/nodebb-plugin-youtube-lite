"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });

    $(window).on('action:posts.reply', function() {
        $('.js-lazyYT').lazyYT();
    });


"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
        console.log('Widgets Loaded')
    });


    $(window).on('action:composer.posts.reply', function() {
        $('.js-lazyYT').lazyYT();
        console.log('New Post')
    });

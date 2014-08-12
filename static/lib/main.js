"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });


    $(window).on('action:posts.loaded', function(){
        $('.js-lazyYT').delay(500).lazyYT();
    });

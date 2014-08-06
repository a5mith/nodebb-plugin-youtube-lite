"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
        console.log('Widgets Loaded')
    });


    $(window).on('action:ajaxify.end', function() {
        $('.js-lazyYT').lazyYT();
        console.log('Ajax End')
    });

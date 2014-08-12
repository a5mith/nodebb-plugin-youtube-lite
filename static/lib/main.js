"use strict";

    $(window).on('action:widgets.loaded', function() {
        $('.js-lazyYT').lazyYT();
    });


        $(window).trigger('action:ajaxify.end', function() {
        $('.js-lazyYT').lazyYT();
    });

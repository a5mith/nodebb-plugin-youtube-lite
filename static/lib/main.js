"use strict";

    $(window).on('action:widgets.loaded', function() {
        console.log('on widget load');    });

    $(window).on('action:composer.topics.post', function() {
        console.log('on action composer topic post');    });

    $(window).on('action:composer.posts.reply', function() {
        console.log('on action composer post reply');    });

    $(window).on('action:composer.posts.edit', function() {
        console.log('on action composer post edit');    });


    $(window).trigger('action:widgets.loaded', function() {
        console.log('trigger action widget loaded');    });

    $(window).trigger('action:composer.topics.post', function() {
        console.log('trigger action composer topic post');    });

    $(window).trigger('action:composer.posts.reply', function() {
        console.log('trigger action composer post reply');    });

    $(window).trigger('action:composer.posts.edit', function() {
        console.log('trigger action composer post edit');    });
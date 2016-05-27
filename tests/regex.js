'use strict';
var winston = require('winston');

process.on('uncaughtException', function (err) {
    winston.error('Encountered error while running test suite: ' + err.message);
});

function replaceAll(text, searchReplace) {
    if (searchReplace === undefined) {
        return text.toString();
    }
    if( !Array.isArray(searchReplace) ){
        searchReplace = [searchReplace];
    }
    for( var i = 0; i < searchReplace.length; ++i ){
        var sr = searchReplace[i];
        text = text.split( sr.search ).join( sr.replace );
    }
    return text;
}

var expect = require("chai").expect;

var youtubeLite = require("../library");
var rawTitlePrefix = '<a href="https://youtu.be/{videoId}{queryString}"><i class="fa fa-youtube" aria-hidden="true"></i> Youtube Video';
var rawTimes = ' <small>&ndash; {time}</small>';
var rawTitleSuffix = '</a><br><img src="https://i.ytimg.com/vi/{videoId}/mqdefault.jpg"/>'
var rawSimpleTemplate = rawTitlePrefix + rawTitleSuffix;
var rawTimesTemplate = rawTitlePrefix + rawTimes + rawTitleSuffix;
var postQueryStringPrefixTemplate = '<a href="https://youtu.be/{videoId}?{queryString}"><i class="fa fa-youtube" aria-hidden="true"></i> Youtube Video <small>&ndash; {time}</small></a>';
var postSimplePrefixTemplate = '<a href="https://youtu.be/{videoId}"><i class="fa fa-youtube" aria-hidden="true"></i> Youtube Video</a>';
var postSuffix = 
'<div class="js-lazyYT lazyYT-container" data-youtube-id="{videoId}" data-width="640" data-height="360" data-parameters="{dataParameters}" style="width: 640px; padding-bottom: 360px;">' +
'\n <div class="ytp-thumbnail lazyYT-image-loaded" style="background-image: url(&quot;https://i.ytimg.com/vi/{videoId}/hqdefault.jpg&quot;);">' +
'\n  <button class="ytp-large-play-button ytp-button" tabindex="23" aria-live="assertive" style="transform: scale(0.85);" onclick="$(this).lazyYT(this);return false;">' +
'\n   <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">' +
'\n    <path class="ytp-large-play-button-bg" d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" fill="#1f1f1e" fill-opacity="0.9">' +
'\n    </path>' +
'\n    <path d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z" fill="#fff">' +
'\n    </path>' + 
'\n    <path d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z" fill="#ccc">' +
'\n    </path>' +
'\n   </svg>' +
'\n  </button>' +
'\n </div>' +
'\n</div>';
var postSimpleTemplate = postSimplePrefixTemplate + postSuffix;
var postQueryStringTemplate = postQueryStringPrefixTemplate + postSuffix;

var videoIdSearchReplace = {search:'{videoId}', replace:'fXhUgV9qzI0'};
var blankQueryStringSearchReplace = {search:'{queryString}', replace:''};
var blankDataParameterstringSearchReplace = {search:'{dataParameters}', replace:''};

var posts = [
    { 
        description: 'Simple post with only the youtube link',
        content: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
        expected:{
            raw: '<p>' + replaceAll( rawSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace]) + '</p>',
            post: '<p>' + replaceAll( postSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace, blankDataParameterstringSearchReplace]) + '</p>'
        }
    },
    {
        description: 'Markdown link with a youtube URL should be left alone',
        content:  '<p><a href="https://youtu.be/fXhUgV9qzI0">linked</a></p>',
        expected: {
            raw: '<p><a href="https://youtu.be/fXhUgV9qzI0">linked</a></p>',
            post: '<p><a href="https://youtu.be/fXhUgV9qzI0">linked</a></p>'
        }
    },
    {
        description: 'Video URLs on consecutive lines',
        videoId: 'fXhUgV9qzI0',
        content:  '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a><br/>\n<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
        expected: {
            raw: '<p>' + replaceAll( rawSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace]) + '<br/>\n' +
                replaceAll( rawSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace]) + '</p>',
            post: '<p>' + replaceAll( postSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace, blankDataParameterstringSearchReplace]) + '<br/>\n' +
                replaceAll( postSimpleTemplate, [videoIdSearchReplace, blankQueryStringSearchReplace, blankDataParameterstringSearchReplace]) + '</p>'
        }
    },
    { 
        description: 'Link with text in front should be left alone',
        content: '<p>Look at this<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
        expected: {
            raw: '<p>Look at this<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
            post: '<p>Look at this<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>'
        }
    },
    { 
        description: 'Link with text behind should be left alone',
        content: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
        expected: {
            raw: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
            post: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>'
        }
    },
    { 
        description: 'Link with text in front and behind should be left alone',
        content: '<p>Look: <a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
        expected: {
            raw: '<p>Look: <a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
            post: '<p>Look: <a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>'
        }
    },
    { 
        description: 'Simple post with only the youtu.be link with a start time',
        videoId: 'fXhUgV9qzI0',
        content: '<p><a href="https://youtu.be/fXhUgV9qzI0?t=55s">https://youtu.be/fXhUgV9qzI0?t=55s</a></p>',
        expected: {
            raw: '<p>' + replaceAll( rawTimesTemplate, [videoIdSearchReplace,{search:'{time}',replace:'[00:55..]'}, {search:'{queryString}', replace:'?t=55s'}]) + '</p>',
            post: '<p>' + replaceAll( postQueryStringTemplate, [
                videoIdSearchReplace,
                {search:'{queryString}', replace:'t=55s'},
                {search:'{time}',replace:'[00:55..]'},
                {search:'{dataParameters}', replace:'start=55'}
                                                               ]) + '</p>'
        }
    },
    { 
        description: 'Simple post with only the youtube.com link with a start time',
        videoId: 'fXhUgV9qzI0',
        content: '<p><a href="https://youtube.com/watch?v=fXhUgV9qzI0&t=55s">https://youtube.com/watch?v=fXhUgV9qzI0&t=55s</a></p>',
        expected: {
            raw: '<p>' + replaceAll( rawTimesTemplate, [
                {search:'youtu.be/',replace:'youtube.com/watch?v='},
                videoIdSearchReplace,
                {search:'{time}',replace:'[00:55..]'},
                {search:'{queryString}', replace:'&t=55s'}]) + '</p>',
            post: '<p>' + replaceAll( postQueryStringTemplate, [
                videoIdSearchReplace,
                {search:'youtu.be/',replace:'youtube.com/watch?v='},
                {search:'?{queryString}',replace:'&{queryString}'},
                {search:'{queryString}', replace:'t=55s'},
                {search:'{time}',replace:'[00:55..]'},
                {search:'{dataParameters}', replace:'start=55'}
                                                               ]) + '</p>'
        }
    }
];


describe( 'Parsing a ', function(){
    var i;
    for( i = 0; i < posts.length; ++i ){
        var post = posts[i];
        describe( post.description + ' in preview', function(){
            
            var data = new Object();
            var expectedValue = post.expected.raw;
            data = post.content;
            it('converts the post correctly', function(){
                youtubeLite.parseRaw( data, function( callback, theData  ){
                    expect( theData ).to.equal( expectedValue );
                });
            
            });
        });
        describe( post.description + ' in the final post', function(){
            
            var data = new Object();
            var expectedValue = post.expected.post;
            data.postData = new Object();
            data.postData.content = post.content;
            it('converts the post correctly', function(){
                youtubeLite.parsePost( data, function( callback, theData  ){
                    expect( theData.postData.content ).to.equal( expectedValue );
                });
            
            });
        });
    }
});



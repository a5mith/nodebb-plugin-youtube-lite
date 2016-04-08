'use strict';
var winston = require('winston');

process.on('uncaughtException', function (err) {
	winston.error('Encountered error while running test suite: ' + err.message);
});

var expect = require("chai").expect;

var youtubeLite = require("../library");

var posts = [
	{ 
		description: 'Simple post with only the youtube link',
		content: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
		expected: '<div class="js-lazyYT" data-youtube-id="fXhUgV9qzI0" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/fXhUgV9qzI0"></iframe></div>'
	},
	{
		description: 'Markdown link with a youtube URL should be left alone',
		content:  '<p><a href="https://youtu.be/fXhUgV9qzI0">linked</a></p>',
		expected: '<p><a href="https://youtu.be/fXhUgV9qzI0">linked</a></p>'
	},
	{
		description: 'Video URLs on consecutive lines',
		content:  '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a><br/>\n<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
		expected: '<div class="js-lazyYT" data-youtube-id="fXhUgV9qzI0" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/fXhUgV9qzI0"></iframe></div>\n<div class="js-lazyYT" data-youtube-id="fXhUgV9qzI0" data-width="640" data-height="360"><iframe class="lazytube" src="//www.youtube.com/embed/fXhUgV9qzI0"></iframe></div>'
	},
	{ 
		description: 'Link with text in front should be left alone',
		content: '<p>Look at this<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>',
		expected: '<p>Look at this<a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a></p>'
	},
	{ 
		description: 'Link with text behind should be left alone',
		content: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
		expected: '<p><a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>'
	},
	{ 
		description: 'Link with text in front and behind should be left alone',
		content: '<p>Look: <a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>',
		expected: '<p>Look: <a href="https://youtu.be/fXhUgV9qzI0">https://youtu.be/fXhUgV9qzI0</a> uh huh</p>'
	}
];


describe( 'regex tests', function(){
	var i;
	for( i = 0; i < posts.length; ++i ){
		var post = posts[i];
		describe( post.description, function(){
			
			var data = new Object();
			var expectedValue = post.expected;
			data.postData = new Object();
			data.postData.content = post.content;
			it('converts the post correctly', function(){
				youtubeLite.parse( data, function( callback, theData  ){
					expect( theData.postData.content ).to.equal( expectedValue );
				});
			
			});
		});
	}
});



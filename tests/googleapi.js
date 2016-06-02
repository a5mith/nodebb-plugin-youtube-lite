'use strict';
var winston = require('winston');
var sinon = require('sinon');
var expect = require("chai").expect;
var youtubeLite = require("../library");

process.on('uncaughtException', function (err) {
    winston.error('Encountered error while running test suite: ' + err.message);
});


describe('Youtube API call',function(){
    var sandbox = null;
    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        youtubeLite.apiKey = 'fakekey';
    });
    afterEach(function(){
        sandbox.restore();
    });
    
    it("doesn't crash on a bad video id",function(){
        sandbox.stub( youtubeLite, 'apiRequest').yields( null, "{}" );
        youtubeLite.fetchSnippet( "badVideo", function( err, snippet  ){
                    expect( snippet ).to.be.null;
                });
    });
    
    it("returns {title, channelTitle, thumbnails, duration} on a good video id",function(){
        sandbox.stub( youtubeLite, 'apiRequest').yields( null, JSON.stringify(
                    {
                        items: [
                        {
                            snippet: {
                                title: 'Video title!',
                                channelTitle: 'Channel Title!',
                                thumbnails:{
                                    default:{ url:'https://i.ytimg.com/vi/goodvideo/default.jpg'},
                                    high:{ url:'https://i.ytimg.com/vi/goodvideo/hqdefault.jpg'},
                                    medium:{ url:'https://i.ytimg.com/vi/goodvideo/mqdefault.jpg'},
                                    standard:{ url:'https://i.ytimg.com/vi/goodvideo/sddefault.jpg'},
                                }
                            },
                            contentDetails: {duration: 'PT3H2M31S'}
                        }
                        ]
                    }) );
        youtubeLite.fetchSnippet( "goodvideo", function( err, snippet  ){
                    expect( snippet ).to.deep.equal( 
                    {
                        title: 'Video title!',
                        channelTitle: 'Channel Title!',
                        duration: '3:02:31',
                        thumbnails:{
                            default:{ url:'https://i.ytimg.com/vi/goodvideo/default.jpg'},
                            high:{ url:'https://i.ytimg.com/vi/goodvideo/hqdefault.jpg'},
                            medium:{ url:'https://i.ytimg.com/vi/goodvideo/mqdefault.jpg'},
                            standard:{ url:'https://i.ytimg.com/vi/goodvideo/sddefault.jpg'}, 
                        }
                    } );
                    
                });
    });
});

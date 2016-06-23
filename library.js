"use strict";
// https://developers.google.com/youtube/v3/docs/videos

var LRU = require('lru-cache'),
    cache = LRU( 500 );
var https = require('https');
var controllers = require('./lib/controllers');
var winston = require('winston');

var YoutubeLite = {};
YoutubeLite.apiKey = null;
YoutubeLite.cache = cache;

YoutubeLite.youtubeUrl = /(<p>|^)((<a.*?href="((https?:\/\/(?:www\.)?)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|(https?:\/\/)?youtu\.be\/)(([a-zA-Z0-9_-]{6,11})(?:(?:[&\?#])([^"]+))?)"[^>]*?>)(\4\7)<\/a>)(<br\/?>|<\/p>)/m;

YoutubeLite.init = function(params, callback) {
    var router = params.router,
        hostMiddleware = params.middleware,
        hostControllers = params.controllers,
		db = module.parent.require('./database');
    // We create two routes for every view. One API call, and the actual route itself.
    // Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

    router.get('/admin/plugins/youtube-lite', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
    router.get('/api/admin/plugins/youtube-lite', controllers.renderAdminPage);
    
    db.getObjectField('settings:youtube-lite', 'id', function(err, result){
        YoutubeLite.apiKey = result;
        callback();
    });
};

YoutubeLite.addAdminNavigation = function(header, callback) {
    header.plugins.push({
        route: '/plugins/youtube-lite',
        icon: 'fa-youtube',
        name: 'Youtube Lite'
    });

    callback(null, header);
};

YoutubeLite.apiRequest = function( videoId, callback ){
    var req = https.request({
        host: 'www.googleapis.com',
        path: '/youtube/v3/videos?id=' + videoId + '&key=' + YoutubeLite.apiKey + '&part=snippet,contentDetails&fields=items(snippet(title,channelTitle,thumbnails),contentDetails(duration))',
        port: 443,
        agent: false,
        json: true,
        method: 'GET'
    },(res) => {
        res.setEncoding('utf8');
        var videos = '';
        res.on('data', (data) => { 
            videos += data;
        });
        res.on('end', function(){
            callback(null, videos);
        });
    });
    req.end();
    
    req.on('error', (err) => {
        winston.error('[youtube-lite] error looking up video id: [' + videoId + ']' );
        winston.error( err );
        callback( err );
    });
}

YoutubeLite.fetchSnippet = function( videoId, callback ){
    var cachedSnippet = cache.get(videoId);
    if( cachedSnippet ){
        return callback(null, cachedSnippet);
    }
    else{
        if( YoutubeLite.apiKey ){
            return YoutubeLite.apiRequest( videoId, function(err, videos){
                if( err ){
                    return callback(err);
                }
                videos = JSON.parse(videos);
                if( !videos.items || videos.items.length == 0 ){
                    cache.set( videoId, null );
                    return callback(null, null);
                }
                var snippet = videos.items[0].snippet;
                snippet.title = replaceAll( snippet.title, '<', '&lt;');
                snippet.channelTitle = replaceAll( snippet.channelTitle, '<', '&lt;');
                snippet.duration = timeToString( parseDuration( videos.items[0].contentDetails.duration ) );
                cache.set( videoId, snippet );
                callback( null, snippet );
            });
        }
        else{
            var snippet = {
                title: 'Youtube Video',
                thumbnails: {
                    medium:    {url: 'https://i.ytimg.com/vi/' + videoId + '/mqdefault.jpg'},
                    default:   {url: 'https://i.ytimg.com/vi/' + videoId + '/default.jpg'},
                    high:      {url: 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg'},
                    standard:  {url: 'https://i.ytimg.com/vi/' + videoId + '/sddefault.jpg'}   
                }
            };
            callback(null, snippet);
        }
    }
}

function replaceAll(text, search, replace) {
    if (replace === undefined) {
        return text.toString();
    }
    return text.split(search).join(replace);
}

function spliceSlice(str, index, count, add) {
return str.slice(0, index) + (add || "") + str.slice(index + count);
}

/*
[
0 '<p><a href="https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s">https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s</a></p>',
1  '<p>',
2  '<a href="https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s">https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s</a>',
3  '<a href="https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s">',
4  'https://youtu.be/',
5  undefined,
6  'https://',
7  'ggCuyOeDl5M?t=30s&amp;end=50s',
8  'ggCuyOeDl5M',
9  't=30s&amp;end=50s',
10  'https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s',
    index: 11,
    input: '<p>foo</p>\n<p><a href="https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s">https://youtu.be/ggCuyOeDl5M?t=30s&amp;end=50s</a></p>\n' ]

0: whole match
1: opening paragraph tag (optional)
2: entire <a>...</a> tag
3: <a ...> tag
4: https//url inside <a...> tag
5: http://url inside <a> tag
6: https
7: query string
8: video id
9: rest of query string (minus starting character) 
10: text between <a>...</a>
11: ending tag
*/

function getParams( params ){
    var result = {};
    var queryString = [];
    for( var i = 0; i < params.length; ++i ){
        var param = params[i];
        if( param.indexOf('t=') == 0 ){
            var val = parseTime( param.substring( param.indexOf('=')+1) );
            queryString.push( 'start=' + val );
            result.start = timeToString( parseInt( val, 10 ) );
        }
        else if( 
            param.indexOf('start=') == 0 ||
            param.indexOf('end=') == 0
        ){
            var ex = param.indexOf('=');
            var val = parseTime( param.substring( ex+1 ) );
            queryString.push( param.substring(0, ex+1) + val );
            result[param.substring(0, ex)] = timeToString( parseInt( val, 10 ) );
        }
        else if(
            param.indexOf('iv_load_policy=') == 0
        ){
            queryString.push( param );
        }
    }
    result.queryString = queryString.join('&');
    return result;
}


function filter(data, match, preview, callback){
	if(match){
        var videoId = match[8];
        YoutubeLite.fetchSnippet(videoId,
            function(err, snippet){
                if( err ){
                    return callback(err);
                }
                if( !snippet ){
                    // not a valid video, skip it
                    return callback(null, data);
                }
               
                var params = getParams( (match[9] || '').split('&amp;') );
                var queryString = params.queryString;
                var content = match[1] + match[3] + '<i class="fa fa-youtube" aria-hidden="true"></i> ' + snippet.title;
                
                if( snippet.duration ){
                    content += ' <small>&ndash; ';
                        
                    if( params.start ){
                        if( params.end ){
                            content += '[' + params.start + '..' + params.end + ']';
                        }
                        else{
                            content += '[' + params.start + '..' + snippet.duration + ']';
                        }
                    }
                    else if( params.end ){
                        content += '[00:00..' + params.end + ']';
                    }
                    
                    content += ' ' + snippet.duration + '<br>&mdash; ' + snippet.channelTitle +'</small>';
                }
                else if( params.start || params.end ){
                    // No API key, but we still have a start / end we can display
                    content += ' <small>&ndash; ';
                        
                    if( params.start ){
                        if( params.end ){
                            content += '[' + params.start + '..' + params.end + ']';
                        }
                        else{
                            content += '[' + params.start + '..]';
                        }
                    }
                    else if( params.end ){
                        content += '[00:00..' + params.end + ']';
                    }
                    content += '</small>';
                }
                content += '</a>';
                var thumbnails = snippet.thumbnails;
                if( preview ){
                    var img = thumbnails.medium || thumbnails.default || thumbnails.high || thumbnails.standard;
                    content += '<br><img src="' + img.url + '"/>';
                }
                else{
                   
                    var img = thumbnails.high || thumbnails.standard || thumbnails.default || thumbnails.medium;
                    content += '<div class="js-lazyYT lazyYT-container" data-youtube-id="' + videoId + '" data-width="640" data-height="360" data-parameters="' + queryString + '" style="width: 640px; padding-bottom: 360px;">' +
                            '\n <div class="ytp-thumbnail lazyYT-image-loaded" style="background-image: url(&quot;' + img.url + '&quot;);">' +
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
                }
                
                content += match[11];
                data = data.substring(0, match.index) + content + data.substring( match.index + match[0].length ) ;
                
                // Check for more...
                filter(data, data.match(YoutubeLite.youtubeUrl), preview, callback);
            });
    }
    else{
        callback(null, data);
    }
}
function parseTime(PT) {
    var output = [];
    var seconds = 0;
    var matches = PT.match(/(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?(\d*)?/i);
    var parts = [
        { // hours
            pos: 1,
            multiplier: 3600
        },
        { // minutes
            pos: 2,
            multiplier: 60
        },
        { // seconds
            pos: 3,
            multiplier: 1
        },
        { // seconds (raw)
            pos: 4,
            multiplier: 1
        }
    ];
    
    for (var i = 0; i < parts.length; i++) {
        if (typeof matches[parts[i].pos] != 'undefined') {
            seconds += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
        }
    }
    
    return seconds;
};

YoutubeLite.parseRaw = function(data, callback){
    if (!data ) {
        return callback(null, data);
    }
    filter(data, data.match(YoutubeLite.youtubeUrl), true, callback);
};

YoutubeLite.parsePost = function(data, callback) {
    if (!data || !data.postData || !data.postData.content) {
        return callback(null, data);
    }
    var content = data.postData.content;
    filter(content, content.match(YoutubeLite.youtubeUrl), false, function(err, content){
        if(err){
            winston.error('[youtube-lite] error parsing pid ' + data.postData.pid );
            return callback(null, data);
        }
        data.postData.content = content;
        callback(null, data);
    });
};

function parseDuration(PT, settings) {
    var durationInSec = 0;
    var matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
    var parts = [
        { // years
            pos: 1,
            multiplier: 86400 * 365
        },
        { // months
            pos: 2,
            multiplier: 86400 * 30
        },
        { // weeks
            pos: 3,
            multiplier: 604800
        },
        { // days
            pos: 4,
            multiplier: 86400
        },
        { // hours
            pos: 5,
            multiplier: 3600
        },
        { // minutes
            pos: 6,
            multiplier: 60
        },
        { // seconds
            pos: 7,
            multiplier: 1
        }
    ];
    
    for (var i = 0; i < parts.length; i++) {
        if (typeof matches[parts[i].pos] != 'undefined') {
            durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
        }
    }
    return durationInSec;
    
};

function timeToString(seconds){
    var output = [];
    // Hours extraction
    if (seconds > 3599) {
        output.push(parseInt(seconds / 3600));
        seconds %= 3600;
    }
    // Minutes extraction with leading zero
    output.push(('0' + parseInt(seconds / 60)).slice(-2));
    // Seconds extraction with leading zero
    output.push(('0' + seconds % 60).slice(-2));
    
    return output.join(':');
}

module.exports = YoutubeLite;

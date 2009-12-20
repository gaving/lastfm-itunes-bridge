// ==UserScript==
// @name           Last.fm - iTunes Bridge
// @namespace      gaving
// @description    Allows track play button to trigger itunes play
// @include        http://www.last.fm/music/*/*/*
// @include        http://www.last.fm/user/*
// @include        http://www.lastfm.*/music/*/*/*
// @exclude        http://www.last.fm/music/*/+images/*
// @exclude        http://www.lastfm.*/music/*/+images/*
// @exclude        http://www.last.fm/music/*/+videos/*
// @exclude        http://www.lastfm.*/music/*/+videos/*
// @exclude        http://www.last.fm/music/*/+news/*
// @exclude        http://www.lastfm.*/music/*/+news/*
// @version        0.1
// @author         gaving
// @require        http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

var itunes = {

    buildControls : function() {

        var $playIcon = $('img.play_icon:first').clone()
            .removeClass('play_icon').addClass('ss-itunes_icon')
            .css({'cursor': 'pointer'})
            .prependTo('table#recentTracks td.lovedCell').click(function() {

            /* Grab the link and split it up into artist/title components */
            var $parent = $(this).parent().prev().prev().prev().find('a');
            var trackLink = $parent.attr('href');
            var trackRegex = /\/music\/(.*)\/_\/(.*)/
            var trackResults = trackLink.match(trackRegex);

            if (trackResults[1] && trackResults[2]) {

                var artist = trackResults[1];
                var title = trackResults[2];

                /* TODO: Make configurable */
                var url = 'http://0.0.0.0:3889/play/' + artist + '/' + title;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
                        "Accept": "application/xml"
                    },
                    onload: function(responseDetails) {
                        var $title = $parent.parent().next().next();
                        $title.addClass('highlight');
                        setTimeout(function(){ $title.removeClass('highlight') }, 250);
                    },
                    onerror: function(responseDetails) {
                        var errorMessage = 'Error: could not reach mini remote. Check it is running?';
                        alert(errorMessage);
                        GM_log(errorMessage);
                    }
                });
            }
        });
    },

    init: function() {

        /* Build the buttons on the user page */
        itunes.buildControls();
    }
};

if (document.body) itunes.init();

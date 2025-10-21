$(document).ready(function() {
    var reads = $('.readaudio');
    var audioPlay = $('.readAudioPlay');

    reads.on('pause', function() {
        $(this).parent().find('.audioBtn').removeClass('pause');
    });
    reads.on('play', function() {
        $(this).parent().find('.audioBtn').addClass('pause');
    });
    reads.each(function(index, element) {
        var playPause = $(element).parent().find('.audioBtn');
        playPause.on('click', pausePlay.bind(element));
    });

    function pausePlay(event) {
        var that = this;
        reads.each(function(index, element) {
            if (element != that) {
                element.pause();
            }
        });
        if (!this.paused) {
            this.pause();
        } else {
            this.play();
        }
    }



    audioPlay.on('pause', function() {
        $(this).parent().find('.clickedBtn').removeClass('pause');
    });
    audioPlay.on('play', function() {
        $(this).parent().find('.clickedBtn').addClass('pause');
    });
    audioPlay.each(function(index, elem) {
        var playPause = $(elem).parent().find('.clickedBtn');
        playPause.on('click', pausePlayV.bind(elem));
    });

    function pausePlayV(event) {
        var that = this;
        audioPlay.each(function(index, elem) {
            if (elem != that) {
                elem.pause();
            }
        });
        if (!this.paused) {
            this.pause();
        } else {
            this.play();
        }
    }


});
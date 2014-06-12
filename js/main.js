(function ($, Howl, ID3, Case, console) {
    'use strict';

    window.musics = [
        'musics/iridescent.mp3',
        'musics/castle-of-glass.mp3'
    ];

    function imageExists(url, callback) {
        var img     = new Image();

        img.onload  = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src     = url;
    }

    function constructSound(music) {
        var musics = [music];

        if (typeof music === 'object') {
            musics = music;
        }

        return new Howl({
            urls: musics,
            autoplay: false,
            volume: 0.5,
            onloaderror: function () { $('.art-image').attr('src', './img/logo.png'); },
            onend: function () { next(); },
            onplay: function () {
                ID3.loadTags(sound._src, function () {
                    var tags = ID3.getAllTags(sound._src),
                        albumSource = './img/albums/' + Case.snake(tags.album) + '.png';

                    $('#music-tilte').text(tags.title);
                    $('#music-artist').text(tags.artist);
                    $('#music-album').text(tags.album);

                    imageExists(albumSource, function (exists) {
                        if (exists) {
                            $('.art-image').attr('src', albumSource);
                        } else {
                            console.error('Album art not found: ' + albumSource);
                            $('.art-image').attr('src', './img/logo.png');
                        }
                    });

                    $('.art-image').attr('title', tags.album);
                });
            }
        });
    }

    function getMusicIndex(title) {
        var index = null;

        $.each(musics, function(key, value) {
            if (title === value) {
                index = key;
                return false;
            }
        });

        return index;
    }

    function stop() {
        $('.progress-bar').attr('aria-valuenow', 0);
        $('.progress-bar').attr('aria-valuenow', 0);
        $('.progress-bar').css('width', 0 + '%');
    }

    function next() {
        if (sound._loaded) {
            sound.stop();
            var index = getMusicIndex(sound._src);
            if (typeof window.musics[parseInt(index) + 1] !== 'undefined') {
                sound = window.sound = constructSound(window.musics[parseInt(index) + 1]);
                sound.play();
            }
        }
    }

    function prev() {
        if (sound._loaded) {
            sound.stop();
            var index = getMusicIndex(sound._src);
            if (typeof window.musics[parseInt(index) - 1] !== 'undefined') {
                sound = window.sound = constructSound(window.musics[parseInt(index) - 1]);
                sound.play();
            }
        }
    }

    var sound = window.sound = constructSound(window.musics[0]);

    $(document).on('click', '#play', function (event) {
        var target = $(event.target);

        if (sound._loaded) {
            target.attr('class', 'fa fa-pause fa-2x');
            target.attr('id', 'pause');
            target.attr('title', 'Pause');
            $('#stop').show();
            sound.play();
        }
    });

    $(document).on('click', '#next', function (event) {
        var target = $(event.target);

        next();

        if ($('#pause').length === 0) {
            $('#play').attr('class', 'fa fa-pause fa-2x');
            target.attr('title', 'Pause');
            $('#stop').show();
        }
    });

    $(document).on('click', '#prev', function (event) {
        var target = $(event.target);

        prev();

        if ($('#pause').length === 0) {
            $('#play').attr('class', 'fa fa-pause fa-2x');
            target.attr('title', 'Pause');
            $('#stop').show();
        }
    });

    $(document).on('click', '#stop', function (event) {
        $('#stop').hide();
        sound.stop();

        stop();
    });

    $(document).on('click', '#pause', function (event) {
        var target = $(event.target);

        target.attr('class', 'fa fa-play fa-2x');
        target.attr('id', 'play');
        target.attr('title', 'Play');

        sound.pause();
    });

    $('.slider').slider({
        formater: function (value) {
            var volume = value / 20,
                percentage = Number((volume * 100).toFixed(0));

            return percentage;
        }
    }).on('slide', function (event) {
        var volume = $(event.target).val() / 20,
            percentage = Number((volume * 100).toFixed(0));
        $('.volume-percentage').text(percentage + '%');
        sound.volume(volume / 20);
    });

    setInterval(function () {
        var percentage = Number(((sound.pos() / sound._duration) * 100).toFixed(0));
        $('.progress-bar').attr('aria-valuenow', percentage);
        $('.progress-bar').attr('aria-valuenow', percentage);
        $('.progress-bar').css('width', percentage + '%');
    }, 1000);
})(window.jQuery, window.Howl, window.ID3, window.Case, window.console);

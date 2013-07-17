/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof series === 'undefined') {
        console.warn('"series" variable is not defined.');
    } else {
        var applyPreferences = function () {
            series.setTitle(MashupPlatform.prefs.get('title'));
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('series_data_1d', function (data) {
            series.setData(parseJSON(to2d(data)));
        });

        MashupPlatform.wiring.registerCallback('series_data_2d', function (data) {
            series.setData(parseJSON(data));
        });
    }

    function to2d(array) {
        var matrix = new [];
        for (var i = 0; i < array.length; i++)
            matrix[i] = [ array[i] ];
        return matrix;
    }

    function parseJSON(data) {
        if (typeof data === 'string') {
            data = $.parseJSON(data);
            if (typeof data !== 'array')
                console.warn('Provided JSON data is not an array');
        }
        return data;
    }
});
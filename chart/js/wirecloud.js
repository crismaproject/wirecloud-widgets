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
            window.indicator_uri = MashupPlatform.prefs.get('indicator-uri');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('worldstate', function (data) {
            loadWorldState(series, data);
        });
    }
});
/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var toConsole = false;

        var applyPreferences = function () {
            autoRecenter = MashupPlatform.prefs.get('to_console');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('data', function (data) {
            appendData(data);
            if (toConsole)
                console.log(data);
        });
    }
});
/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var applyPreferences = function () {
//            toConsole = MashupPlatform.prefs.get('to_console');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        $('#btn-load').click(function () {
        });

        $('#btn-refresh').click(function () {
        });
    }
});
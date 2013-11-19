/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
    $(function() { appendData('The Wirecloud platform was not detected!', 'text-danger'); });
} else {
    var toConsole = false;
    var applyPreferences = function () {
        toConsole = MashupPlatform.prefs.get('to_console');
        rowLimit = MashupPlatform.prefs.get('row_limit');
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('data', function (data) {
        appendData(data);
        if (toConsole)
            console.log({
                'received': true,
                'data': data
            });
    });
}
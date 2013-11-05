/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined')
    console.warn('Wirecloud environment not detected.');

var toConsole = false;
var applyPreferences = function () {
    toConsole = MashupPlatform.prefs.get('to_console');
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
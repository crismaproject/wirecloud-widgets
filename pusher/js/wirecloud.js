/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var toConsole = false;

        var applyPreferences = function () {
            toConsole = MashupPlatform.prefs.get('to_console');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        $('#btn-send').click(function () {
            var eventData = $('#inputEventData').val();
            if (toConsole)
                console.log({
                    'local-event': 'data',
                    'remote-event': '??', // TODO
                    'data': eventData});
            MashupPlatform.wiring.pushEvent('data', eventData);
        });
    }
});
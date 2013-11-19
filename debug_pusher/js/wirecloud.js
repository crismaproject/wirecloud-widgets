/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
var hasMashupPlatform = typeof MashupPlatform !== 'undefined';
if (!hasMashupPlatform)
    console.warn('Wirecloud environment not detected.');

var toConsole = false;
if (hasMashupPlatform) {
    var applyPreferences = function () {
        toConsole = MashupPlatform.prefs.get('to_console');
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();
} else {
    toConsole = true;
}

$(function() {
    $('#btn-send').click(function () {
        getData()
            .done(function (data) {
                if (!data) return;

                if (toConsole)
                    console.logEventData(data);
                if (hasMashupPlatform)
                    MashupPlatform.wiring.pushEvent('data', data);

                showDispatchNotification();
            })
    });

    if (hasMashupPlatform)
        $('#btn-refresh-event').click(function () {
            var connections = MashupPlatform.wiring.getReachableEndpoints('data');
            var str = '';
            for (var i = 0; i < connections.length; i++) {
                var connection = connections[i];
                if (i > 0) str += ', ';
                str += connection.endpoint + ' (' + connection.iWidgetName + ')';
            }
            $('#inputEventName').val(str);
        });
});
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

$(function() {
    $('#btn-send').click(function () {
        var eventData = $('#inputEventData').val();
        if (toConsole) {
            var remote = null;
            var reached = MashupPlatform.wiring.getReachableEndpoints('data');
            if (reached.length == 1)
                remote = reached[0].endpoint;
            else if (reached.length > 1) {
                remote = [];
                for (var i = 0; i < reached.length; i++)
                    remote[i] = reached[i].endpoint;
            }

            console.log({
                'sent': true,
                'local-event': 'data',
                'remote-event': remote,
                'data': eventData
            });
        }
        MashupPlatform.wiring.pushEvent('data', eventData);
    });

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
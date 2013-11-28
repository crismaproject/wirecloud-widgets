/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
var hasMashupPlatform = typeof MashupPlatform !== 'undefined';
if (!hasMashupPlatform)
    console.warn('Wirecloud environment not detected.');

$(function() {
    $('#btn-send').click(function () {
        getData()
            .done(function (data) {
                if (typeof data !== 'undefined' && hasMashupPlatform) {
                    var start = new Date().getTime();
                    MashupPlatform.wiring.pushEvent('data', data);
                    var end = new Date().getTime();
                    console.log('Propagating event data took ' + (end - start) + 'ms');
                }

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
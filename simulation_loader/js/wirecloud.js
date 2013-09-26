/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var applyPreferences = function () {
            window.ooiWsrApiUri = MashupPlatform.prefs.get('api');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        var jqueryGet = $.fn.get;
        $.fn.get = function (uri, callback, type) {
            var proxyUri = MashupPlatform.http.buildProxyURL(uri);
            return jqueryGet(proxyUri, callback, type);
        };

        $('#btn-load').click(function () {
            var simulationId = $('select#simulationId option:selected').val();
            if (!simulationId) return;
            // ALWAYS load the most recent simulation data from the server on load
            $.get(window.ooiWsrApiUri + '/Simulation/' + simulationId, function (simulation) {
                $('#simulationLoadedNotification').fadeIn();
                $('button#btn-load,button#btn-refresh,select#simulationId').attr('disabled', 'disabled');
                MashupPlatform.wiring.pushEvent('simulation', JSON.stringify(simulation));
            }, 'json');
        });
    }

});
/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var applyPreferences = function () {
            api.apiUri = MashupPlatform.prefs.get('api');
        };
        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        $('#btn-load').click(function () {
            var simulationId = $('select#simulationId option:selected').val();
            if (!simulationId) return;
            // ALWAYS load the most recent simulation data from the server on load
            api.getSimulation(simulationId)
                .done(function (simulation) {
                    $('#simulationLoadedNotification').fadeIn();
                    $('button#btn-load,button#btn-refresh,select#simulationId').attr('disabled', 'disabled');
                    MashupPlatform.wiring.pushEvent('simulation', JSON.stringify(simulation));
                }, 'json');
        });
    }
});
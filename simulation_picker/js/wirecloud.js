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
                    var $simulationLoadedNotification = $('#simulationLoadedNotification');
                    $simulationLoadedNotification.slideDown();
                    var $formInput = $('button#btn-load,button#btn-refresh,select#simulationId');
                    $formInput.attr('disabled', 'disabled');
                    MashupPlatform.wiring.pushEvent('simulation', JSON.stringify(simulation));

                    window.setTimeout(function() {
                        $formInput.removeAttr('disabled');
                        $simulationLoadedNotification.slideUp();
                    }, 5000)
                }, 'json');
        });
    }
});
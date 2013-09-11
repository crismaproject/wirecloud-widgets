/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        var applyPreferences = function () {
            window.ooi_wsr_uri = MashupPlatform.prefs.get('ooi-wsr-uri');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        $('#btn-load').click(function () {
            var simId = $('#simulationId').val();
            var wsId = $('#worldstateId').val();
            MashupPlatform.wiring.pushEvent('simulation', simId);
            MashupPlatform.wiring.pushEvent('worldstate', wsId);
        });
    }
});
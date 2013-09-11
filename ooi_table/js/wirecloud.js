/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    var hasMashupPlatform = typeof MashupPlatform !== 'undefined';

    if (!hasMashupPlatform)
        console.warn('Wirecloud environment not detected.');

    table.onSelected = function (row) {
        if (row && hasMashupPlatform) {
            if (row.hasOwnProperty('entityId')) MashupPlatform.wiring.pushEvent('entity', row.entityId);
            MashupPlatform.wiring.pushEvent('row', JSON.stringify(row));
        } else
            console.log(['selected row', row]);
    }

    if (hasMashupPlatform) {
        var applyPreferences = function () {
            window.ooi_wsr_uri = MashupPlatform.prefs.get('ooi-wsr-uri');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('worldstate', function (data) {
            var worldstateId = parseInt(data);
            table.loadWorldState(worldstateId);
        });
    }
});
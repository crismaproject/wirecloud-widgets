/*global series,MashupPlatform*/
/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
} else {
    var applyPreferences = function () {
        window.indicator_uri = MashupPlatform.http.buildProxyURL(MashupPlatform.prefs.get('indicator-uri'));
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate_in', function (data) {
        var worldstate = JSON.parse(data);
        if (!worldstate || !worldstate.hasOwnProperty('worldStateId'))
            throw 'Provided worldstate object has no worldStateId property.';
        loadWorldState(series, worldstate.worldStateId);
    });
}
/*global series,MashupPlatform*/
/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
} else {
    var applyPreferences = function () {
        window.wps = new WPS(MashupPlatform.http.buildProxyURL(MashupPlatform.prefs.get('wps-uri')));
        window.ooiwsr = new WorldStateRepository(MashupPlatform.prefs.get('ooiwsr-uri'));
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();
}
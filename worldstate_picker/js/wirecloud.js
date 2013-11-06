/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
} else {
    var applyPreferences = function () {
        apiUri = MashupPlatform.prefs.get('api');
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    var jqueryGet = $.fn.get;
    $.fn.get = function (uri, callback, type) {
        var proxyUri = MashupPlatform.http.buildProxyURL(uri);
        return jqueryGet(proxyUri, callback, type);
    };
}
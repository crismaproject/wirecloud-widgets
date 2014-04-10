/**
 * Parses the request URL and returns any query parameters contained in it. The specified url needs to be free of
 * URL anchor fragments.
 * @param {string} url the URL to parse
 * @returns {*} a key-value pair container containing all the parameters. Note that if one key is mentioned
 * multiple times in the URL query parameters, only the last value will be contained in this return value.
 */
function parseQueryParams(url) {
    var cutoff = url.indexOf('?');
    var params = {};
    if (cutoff != -1) {
        var paramsStr = url.substring(cutoff + 1);
        var components = paramsStr.split('&');

        for (var i = 0; i < components.length; i++) {
            var parts = components[i].split('=', 2);
            params[parts[0]] = parts[1] || true;
        }
    }

    return params;
}

window.onload = function () {
    var url = document.referrer;
    var params = parseQueryParams(url);

    if (typeof MashupPlatform !== 'undefined')
        MashupPlatform.wiring.pushEvent('url_params', JSON.stringify(params));
    else {
        console.warn('Wirecloud was not detected. Logging query parameters into the JS console instead.');
        console.log(params);
    }
};
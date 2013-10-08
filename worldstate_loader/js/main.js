/*global MashupPlatform*/

var apiUri = null;
var enforcedWorldstate = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
    var enforcedWorldstatePref = MashupPlatform.prefs.get('force-ws');

    if (enforcedWorldstatePref && enforcedWorldstate !== enforcedWorldstatePref && enforcedWorldstatePref > 0) {
        enforcedWorldstate = enforcedWorldstatePref;
        loadWorldstate(enforcedWorldstate);
    }

    apiCall('EntityType', function (response) {
        MashupPlatform.wiring.pushEvent('ooi-types', response.responseText);
    }, 'Request to OOI-WSR failed! (while trying to load entity types)');
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('simulation', loadLastWorldstateForSimulation);

function loadWorldstate(worldstateId) {
    apiCall('WorldState/' + worldstateId, function (response) {
        MashupPlatform.wiring.pushEvent('worldstate', response.responseText);
    }, 'Request to OOI-WSR failed! (during loadWorldstate)');
    loadOOIs(worldstateId);
}

function loadLastWorldstateForSimulation(simulationData) {
    if (enforcedWorldstate || !apiUri || !simulationData) return;

    var simulation = JSON.parse(simulationData);
    if (!simulation || !simulation.hasOwnProperty('simulationId')) throw 'Provided item does not have a "simulationId" property!';

    apiCall('WorldState', function (response) { // TODO: filter by simulation id on remote
        var jsonResponse = JSON.parse(response.responseText);
        var lastWorldState = null;

        for (var i = 0; i < jsonResponse.length; i++) {
            if (!jsonResponse[i].hasOwnProperty('simulationId') || jsonResponse[i].simulationId != simulationData) continue;
            lastWorldState = jsonResponse[i];
        }

        if (lastWorldState) { // we have a working latest world state, propagate
            MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastWorldState));
            loadOOIs(lastWorldState.worldStateId);
        }
    }, 'Request to OOI-WSR failed! (during loadLastWorldstateForSimulation)', { 'simulationId': simulation.simulationId });
}

/**
 * @param {int} worldstateId
 */
function loadOOIs(worldstateId) {
    apiCall('Entity', function (response) {
        MashupPlatform.wiring.pushEvent('oois', response.responseText);
    }, 'Request to OOI-WSR failed! (during loadOOIs)', { 'wsid': worldstateId });
}

/**
 * Performs a GET request to the OOI-WSR REST API and expects a JSON-encoded response.
 * @param {string} path the (relative) path/route to request; if any query parameters are required for this request,
 * either put them here, or declare them in arguments, but not both.
 * @param {function} onSuccess a callback to handle the response.
 * @param {string?} failureMessage a message that will be sent to the user via window.alert iff the request failed.
 * @param {object?} arguments any query parameters that should be sent along with the request; if any query parameters
 * are required for this request, either put them here, or declare them in the path, but not both.
 */
function apiCall(path, onSuccess, failureMessage, arguments) {
    var uri = apiUri + '/' + path;
    if (typeof arguments !== 'undefined' && arguments !== {}) {
        var queryString = '?';
        for (var key in arguments) {
            if (queryString.length > 1) queryString += '&';
            queryString += encodeURIComponent(key) + '=' + encodeURIComponent(arguments[key]);
        }
        uri += queryString;
    }
    MashupPlatform.http.makeRequest(uri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: onSuccess,
        onFailure: function () {
            alert(failureMessage || 'Request to ' + uri + ' failed.');
        }
    });
}
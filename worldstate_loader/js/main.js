/*global MashupPlatform*/

var apiUri = null;
var enforcedWorldstate = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
    var enforcedWorldstatePref = MashupPlatform.prefs.get('force-ws');

    if (enforcedWorldstatePref && enforcedWorldstate !== enforcedWorldstatePref) {
        enforcedWorldstate = enforcedWorldstatePref;
        loadWorldstate(enforcedWorldstate);
    }

    var typeUri = apiUri + '/EntityType';
    MashupPlatform.http.makeRequest(typeUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
            MashupPlatform.wiring.pushEvent('ooi-types', response.responseText);
        },
        onFailure: function () { alert('Request to OOI-WSR failed! (while trying to load entity types)'); }
    });
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('simulation', loadLastWorldstateForSimulation);

function loadWorldstate(worldstateId) {
    MashupPlatform.http.makeRequest(apiUri + '/WorldState/' + worldstateId, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) { MashupPlatform.wiring.pushEvent('worldstate', response.responseText); },
        onFailure: function () { alert('Request to OOI-WSR failed! (during loadWorldstate)'); }
    });
    loadOOIs(worldstateId);
}

function loadLastWorldstateForSimulation (simulationData) {
    if (enforcedWorldstate || !apiUri || !simulationData) return;

    var simulation = JSON.parse(simulationData);
    if (!simulation || !simulation.hasOwnProperty('simulationId')) throw 'Provided item does not have a "simulationId" property!';

    var wsUri = apiUri + '/WorldState?simulationId=' + simulation.simulationId; // TODO: filter by simulation id on remote
    MashupPlatform.http.makeRequest(wsUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
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
        },
        onFailure: function () { alert('Request to OOI-WSR failed! (during loadLastWorldstateForSimulation)'); }
    });
}

/**
 * @param {int} worldstateId
 */
function loadOOIs (worldstateId) {
    var ooiUri = apiUri + '/Entity?wsid=' + worldstateId;
    MashupPlatform.http.makeRequest(ooiUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
            MashupPlatform.wiring.pushEvent('oois', response.responseText);
        },
        onFailure: function () { alert('Request to OOI-WSR failed! (during loadOOIs)'); }
    });
}
var apiUri = null;
var enforcedWorldstate = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
    var enforcedWorldstatePref = MashupPlatform.prefs.get('force-ws');

    if (enforcedWorldstatePref && enforcedWorldstate !== enforcedWorldstatePref) {
        enforcedWorldstate = enforcedWorldstatePref;
        loadWorldstate(enforcedWorldstate);
    }
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('simulation_id', loadLastWorldstateForSimulation);

function loadWorldstate(worldstateId) {
    MashupPlatform.http.makeRequest(apiUri + '/WorldState/' + worldstateId, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) { MashupPlatform.wiring.pushEvent('worldstate', response.responseText); },
        onFailure: function () { alert('Request to OOI-WSR failed!'); }
    });
    loadOOIs(worldstateId);
}

function loadLastWorldstateForSimulation (simulationId) {
    if (enforcedWorldstate || !apiUri || !simulationId) return;

    // simulation ID known, load the appropriate world states from the OOI-WSR
    var wsUri = apiUri + '/WorldState?simulationId=' + simulationId; // TODO: filter by simulation id on remote
    MashupPlatform.http.makeRequest(wsUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
            var jsonResponse = JSON.parse(response.responseText);
            var lastWorldState = null;

            for (var i = 0; i < jsonResponse.length; i++) {
                if (!jsonResponse[i].hasOwnProperty('simulationId') || jsonResponse[i].simulationId != simulationId) continue;
                lastWorldState = jsonResponse[i];
            }

            if (lastWorldState) { // we have a working latest world state, propagate
                MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastWorldState));
                loadOOIs(lastWorldState.worldStateId);
            }
        },
        onFailure: function () { alert('Request to OOI-WSR failed!'); }
    });
}

/**
 * @param {integer} worldstateId
 */
function loadOOIs (worldstateId) {
    var ooiUri = apiUri + '/Entity?wsid=' + worldstateId;
    MashupPlatform.http.makeRequest(ooiUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
            MashupPlatform.wiring.pushEvent('oois', response.responseText);
        },
        onFailure: function () { alert('Request to OOI-WSR failed!'); }
    });
}
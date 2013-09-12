var apiUri = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('simulation_id', function (simulationId) {
    if (!apiUri || !simulationId) return;

    // simulation ID known, load the appropriate world states from the OOI-WSR
    var wsUri = apiUri + '/WorldState?simulationId=' + simulationId; // TODO: filter by simulation id on remote
    MashupPlatform.http.makeRequest(wsUri, {
        method: 'GET',
        requestHeaders: { 'Accept': 'application/json' },
        onSuccess: function (response) {
            var jsonResponse = JSON.parse(response);
            var lastWorldState = null;

            for (var i = 0; i < jsonResponse.length; i++) {
                if (!jsonResponse[i].hasOwnProperty('simulationId') || jsonResponse[i].simulationId != simulationId) continue;
                lastWorldState = jsonResponse[i];
            }

            if (lastWorldState) { // we have a working latest world state, propagate
                MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastWorldState));
            }
        },
        onFailure: function () { alert('Request to OOI-WSR failed!'); }
    });
});
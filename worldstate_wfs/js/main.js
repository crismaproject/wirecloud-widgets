var wfsUriBase = null;
var applyPreferences = function () {
    wfsUriBase = MashupPlatform.prefs.get('wfs');
    if (wfsUriBase.indexOf('?') == -1)
        wfsUriBase += '?';
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('worldstate', function (worldStateStringData) {
    var worldState = JSON.parse(worldStateStringData);
    if (!worldState.hasOwnProperty('worldStateId')) throw 'Something went horribly wrong. No "worldStateId" field in worldstate object!';
    var worldStateWfsUri = wfsUriBase + '&viewParams=wsid:' + worldState.worldStateId;
    MashupPlatform.wiring.pushEvent('wfs-uri', worldStateWfsUri);
});
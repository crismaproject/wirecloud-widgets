var wfsUriBase = null;
var applyPreferences = function () {
    wfsUriBase = MashupPlatform.prefs.get('wfs');
    if (wfsUriBase.indexOf('?') == -1)
        wfsUriBase += '?';
};

MashupPlatform.prefs.registerCallback(applyPreferences);
applyPreferences();

MashupPlatform.wiring.registerCallback('worldstate', function (worldstateStringData) {
    var worldstate = JSON.parse(worldstateStringData);
    var worldstateWfsUri = wfsUriBase + '&viewparams=wsid:' + worldstate.id;
    MashupPlatform.wiring.pushEvent('wfs-uri', worldstateWfsUri);
});
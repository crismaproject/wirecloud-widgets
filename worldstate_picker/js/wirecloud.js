/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
} else {
    var applyPreferences = function () {
        api = new WorldStateRepository(MashupPlatform.prefs.get('api'));
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('simulation', function (simulation) {
        var simulation = JSON.parse(simulation);
        createWorldStateTree('worldstate-tree', simulation);
    });
}
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
        simulation = JSON.parse(simulation);
        createWorldStateTree('worldstate-tree', simulation);
    });
}

$(function () {
    var lastSelectedNode = null;

    $('#worldstate-tree').on('nodeSelected', function (a, b) {
        lastSelectedNode = b;
    });

    $('#loadBtn').click(function () {
        if (!lastSelectedNode) return;

        MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastSelectedNode));
        api.listEntities()
            .done(function (response) {
                // BEGIN workaround: not all entities belong to the WorldState; ignoring all that don't have properties in the given worldstate
                var oois = response.filter(function(x) {
                    return x.hasOwnProperty('entityInstancesProperties') &&
                        x.entityInstancesProperties.length &&
                        x.entityInstancesProperties.every(function (y) {
                            return y.worldStateId == lastSelectedNode.worldStateId;
                        });
                });
                // END workaround
                MashupPlatform.wiring.pushEvent('oois', JSON.stringify(oois));
            });

        api.listEntityTypes()
            .done(function (response) {
                MashupPlatform.wiring.pushEvent('ooi-types', JSON.stringify(response));
            });
    });
});
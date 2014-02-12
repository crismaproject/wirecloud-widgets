/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
} else {
    var applyPreferences = function () {
        api = new WorldStateRepository(MashupPlatform.prefs.get('api'));
        treeCfg.orientation = MashupPlatform.prefs.get('orientation');
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

        if (typeof MashupPlatform !== 'undefined')
            MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastSelectedNode));
        else
            console.log(lastSelectedNode);

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
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.pushEvent('oois', JSON.stringify(oois));
                else
                    console.log(oois);
            });

        api.listEntityTypes()
            .done(function (response) {
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.pushEvent('ooi-types', JSON.stringify(response));
                else
                    console.log(response);
            });
    });
});
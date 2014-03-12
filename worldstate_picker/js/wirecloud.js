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
        if (typeof MashupPlatform !== 'undefined') {
            console.warn('MashupPlatform is not present!');
            return;
        }
        if (!lastSelectedNode) return;

        MashupPlatform.wiring.pushEvent('worldstate_history', JSON.stringify(getHistoryOf(lastSelectedNode.worldStateId)));
        MashupPlatform.wiring.pushEvent('worldstate', JSON.stringify(lastSelectedNode));

        api.fetch('/Entity?wsid=' + lastSelectedNode.worldStateId)
            .done(function (oois) {
                MashupPlatform.wiring.pushEvent('oois', JSON.stringify(oois));
            });

        api.listEntityTypes()
            .done(function (response) {
                MashupPlatform.wiring.pushEvent('ooi-types', JSON.stringify(response));
            });
    });
});
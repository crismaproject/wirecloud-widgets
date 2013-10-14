/*global map,MashupPlatform*/

var entitiesLookupTable = {};
var selected = [];

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform === 'undefined') {
    console.warn('Wirecloud environment not detected.');
    var logEvent = function (event) {
        console.log([event.originalEvent.type, event.originalEvent.detail]);
    };

    // These bindings exist for debugging purposes outside the Wirecloud environment
    $('#map')
        .bind('mapFocusChanged', logEvent)
        .bind('mapClicked', logEvent)
        .bind('featureAdded', logEvent);
} else if (typeof map === 'undefined') {
    console.warn('"map" variable is not defined.');
} else {
    MashupPlatform.wiring.registerCallback('oois_in', function (data) {
        entitiesLookupTable = { };
        var entities = JSON.parse(data);
        for (var i = 0; i < entities.length; i++) {
            if (!entities[i].hasOwnProperty('entityId')) continue;
            entitiesLookupTable[entities[i].entityId] = entities[i];
        }

        // TODO: add OOIs to map
    });

    MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
        selected = JSON.parse(data);
    });

    $(function () {
        $('#map')
            .bind('mapFocusChanged', function (event) {
                MashupPlatform.wiring.pushEvent('center_point', JSON.stringify({ lat: event.originalEvent.detail.lat, lon: event.originalEvent.detail.lon }));
            })
            .bind('mapClicked', function (event) {
                MashupPlatform.wiring.pushEvent('clicked', JSON.stringify(event.originalEvent.detail));

                if (!event.originalEvent.detail.ooi) return;
                // inconsistent property name casing between WFS and OOI-WSR, so let's just take the ID
                // and look it up in our table
                var clickedOoiId = event.originalEvent.detail.ooi.EntityId; // NOTE: WFS uses 'EntityId', OOI-WSR uses 'entityId'
                if (!entitiesLookupTable.hasOwnProperty(clickedOoiId))
                    throw 'Entities table (received through oois_in) is inconsistent with WFS data!';
                var clickedOoi = entitiesLookupTable[clickedOoiId];

                var selectedIndex = -1;
                for (var i = 0; i < selected.length && selectedIndex == -1; i++)
                    if (selected[i].entityId === clickedOoi.entityId)
                        selectedIndex = i;

                if (selectedIndex === -1)
                    selected.push(clickedOoi);
                else
                    selected.splice(selectedIndex, 1);

                MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
            });
    });
}
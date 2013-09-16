var entitiesLookupTable = {};
var selected = [];

function propagateSelection() {
    MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
}

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
        var logEvent = function (event) {
            console.log([event.originalEvent.type, event.originalEvent.detail]);
        };

        // These bindings exist for debugging purposes outside the Wirecloud environment
        $('#map')
            .bind('mapFocusChanged', logEvent)
            .bind('mapClicked', logEvent)
            .bind('poiClicked', logEvent)
            .bind('featureAdded', logEvent);

        map.setReadonly(false);
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
        });

        MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
            selected = JSON.parse(data);
        });

        MashupPlatform.wiring.registerCallback('wfs-uri', function (wfsUri) {
            map.loadWFS(wfsUri);
        });

        $('#map')
            .bind('mapFocusChanged', function (event) {
                MashupPlatform.wiring.pushEvent('center_point', JSON.stringify({ latitude: event.originalEvent.detail.lat, longitude: event.originalEvent.detail.lon }));
            })
            .bind('mapClicked', function (event) {
                MashupPlatform.wiring.pushEvent('pos_click', JSON.stringify({ latitude: event.originalEvent.detail.lat, longitude: event.originalEvent.detail.lon }));
            })
            .bind('poiClicked', function (event) {
                MashupPlatform.wiring.pushEvent('ooi_click', JSON.stringify(event.originalEvent.detail));
            });
    }
});
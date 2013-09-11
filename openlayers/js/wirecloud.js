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
        var applyPreferences = function () {
            map.wfsUriBase = MashupPlatform.prefs.get('wfs_uri');
            if (map.worldState) map.loadWorldState(map.worldState);
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('view_point', function (data) {
            var coordinates = parseJSON(data);
            map.view(coordinates.latitude, coordinates.longitude);
        });

        MashupPlatform.wiring.registerCallback('worldstate', function (data) {
            var worldstateId = parseInt(data);
            map.loadWorldState(worldstateId);
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

    function parseJSON(data) {
        if (typeof data === 'string')
            data = $.parseJSON(data);
        return data;
    }
});
/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof map === 'undefined') {
        console.warn('"map" variable is not defined.')
    } else {
        var autoRecenter = false;

        var applyPreferences = function () {
            autoRecenter = MashupPlatform.prefs.get('recenter');
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        MashupPlatform.wiring.registerCallback('view_point', function (data) {
            var coordinates = parseJSON(data);
            map.view(coordinates.latitude, coordinates.longitude);
        });

        MashupPlatform.wiring.registerCallback('add_point', function (data) {
            var coordinates = parseJSON(data);
            map.add(coordinates.id, coordinates.latitude, coordinates.longitude, coordinates.icon);
            if (autoRecenter)
                map.viewAll();
        });

        MashupPlatform.wiring.registerCallback('add_line', function (data) {
            var coordinates = parseJSON(data);
            map.addLine(coordinates.id, coordinates.points);
            if (autoRecenter)
                map.viewAll();
        });

        MashupPlatform.wiring.registerCallback('add_poly', function (data) {
            var coordinates = parseJSON(data);
            map.addPoly(coordinates.id, coordinates.points);
            if (autoRecenter)
                map.viewAll();
        });

        MashupPlatform.wiring.registerCallback('clear', function () {
            map.clear();
        });

        $('#map').bind('mapFocusChanged', function(event) {
            MashupPlatform.wiring.pushEvent('center_point', JSON.string({ latitude: event.originalEvent.lat, longitude: event.originalEvent.lon }));
        });
        $('#map').bind('mapClicked', function(event) {
            MashupPlatform.wiring.pushEvent('pos_click', JSON.string({ latitude: event.originalEvent.lat, longitude: event.originalEvent.lon }));
        });
        $('#map').bind('poiClicked', function(event) {
            MashupPlatform.wiring.pushEvent('ooi_click', event.originalEvent);
        });
    }

    function parseJSON(data) {
        if (typeof data === 'string')
            data = $.parseJSON(data);
        return data;
    }
});
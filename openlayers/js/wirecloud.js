/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
        var logEvent = function(event) { console.log([event.originalEvent.type, event.originalEvent.detail]); };

        // These bindings exist for debugging purposes outside the Wirecloud environment
        $('#map').bind('mapFocusChanged', logEvent);
        $('#map').bind('mapClicked', logEvent);
        $('#map').bind('poiClicked', logEvent);
        $('#map').bind('featureAdded', logEvent);

        map.setReadonly(false);
    } else if (typeof map === 'undefined') {
        console.warn('"map" variable is not defined.');
    } else {
        var autoRecenter = false;

        var applyPreferences = function () {
            autoRecenter = MashupPlatform.prefs.get('recenter');
            map.readonly = !MashupPlatform.prefs.get('canDraw');
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
            MashupPlatform.wiring.pushEvent('center_point', JSON.stringify({ latitude: event.originalEvent.detail.lat, longitude: event.originalEvent.detail.lon }));
        });
        $('#map').bind('mapClicked', function(event) {
            MashupPlatform.wiring.pushEvent('pos_click', JSON.stringify({ latitude: event.originalEvent.detail.lat, longitude: event.originalEvent.detail.lon }));
        });
        $('#map').bind('poiClicked', function(event) {
            MashupPlatform.wiring.pushEvent('ooi_click', event.originalEvent.detail);
        });

        $('#map').bind('featureAdded', function(event) {
            switch (event.originalEvent.type) {
                case 'poi':
                    MashupPlatform.wiring.pushEvent('added_point', JSON.stringify(event.originalEvent.detail));
                    break;
                case 'line':
                    MashupPlatform.wiring.pushEvent('added_line', JSON.stringify(event.originalEvent.detail));
                    break;
                case 'poly':
                    MashupPlatform.wiring.pushEvent('added_poly', JSON.stringify(event.originalEvent.detail));
                    break;
                default:
                    console.warn('Unsupported feature type: ' + event.originalEvent.type);
            }
        });
    }

    function parseJSON(data) {
        if (typeof data === 'string')
            data = $.parseJSON(data);
        return data;
    }
});
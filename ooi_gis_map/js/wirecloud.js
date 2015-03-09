/*global map,MashupPlatform*/

var entitiesLookupTable = {};
var selected = [];
var restrictedTo = null;
var dispatchCentroid = true;

/** @const */
var bboxExpression = /^(-?[\d\.]+),(-?[\d\.]+),(-?[\d\.]+),(-?[\d\.]+)$/;

function setOOIs(entities) {
    entitiesLookupTable = { };
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var typeInfo = null;
        for (var j = 0; typeInfo == null && j < entityTypes.length; j++)
            if (entityTypes[j].id == entity.entityTypeId)
                typeInfo = entityTypes[j];

        if (entity.hasOwnProperty('entityId') && entity.entityId >= 0) {
            entitiesLookupTable[entity.entityId] = entity;
            if (restrictedTo != null && (!restrictedTo.hasOwnProperty(entity.entityId) || !restrictedTo[entity.entityId])) continue;
        }

        if (typeInfo != null &&
            typeInfo.hasOwnProperty('hideIf') &&
            typeInfo.hideIf(entity))
            continue;

        if (entity.hasOwnProperty('entityInstancesGeometry') && entity.entityInstancesGeometry.length > 0)
            map.createOOI(entity);
    }
    window.setTimeout(map.focusOnAll, 1500);
}

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
        .bind('featureAdded', logEvent)
        .bind('polygonDrawn', logEvent);

    $(function () {
        var bounds = new OpenLayers.Bounds();
        bounds.extend(new OpenLayers.LonLat(-1284142, 7696291));
        bounds.extend(new OpenLayers.LonLat(4087240, 3684875));
        map.map.zoomToExtent(bounds, false);
    });
} else if (typeof map === 'undefined') {
    console.warn('"map" variable is not defined.');
} else {
    var applyPreferences = function () {
        var bboxMatch = bboxExpression.exec(MashupPlatform.prefs.get('bbox'));
        if (bboxMatch)
            map.setBBox(
                parseFloat(bboxMatch[1]),
                parseFloat(bboxMatch[2]),
                parseFloat(bboxMatch[3]),
                parseFloat(bboxMatch[4])
            );

        var restrictedToString = MashupPlatform.prefs.get('only_show');
        if (restrictedToString) {
            try {
                restrictedTo = {};
                restrictedToString.split(',').forEach(function (x) {
                    restrictedTo[parseInt(x)] = true;
                });
            } catch (e) {
                console.error('Failed to interpret type restriction setting; showing all. Setting was: ' + restrictedToString);
                restrictedTo = null;
            }
        }

        dispatchCentroid = MashupPlatform.prefs.get('geometryCentroid');
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('focus', function (data) {
        var focusOn = JSON.parse(data);
        if (focusOn.hasOwnProperty('lat') && focusOn.hasOwnProperty('lon'))
            map.focusOn(focusOn.lat, focusOn.lon);
    });

    MashupPlatform.wiring.registerCallback('oois_in', function (data) {
        setOOIs(JSON.parse(data));
    });

    MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
        // this is primarily used to synchronize selected OOIs between widgets that support this behavior
        selected = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('bbox', function (data) {
        var bboxMatch = bboxExpression.exec(data);
        if (bboxMatch) {
            map.setBBox(
                parseFloat(bboxMatch[1]),
                parseFloat(bboxMatch[2]),
                parseFloat(bboxMatch[3]),
                parseFloat(bboxMatch[4])
            );
        }
    });

    MashupPlatform.wiring.registerCallback('mapmode', function (data) {
        map.setMode(JSON.parse(data));
    });

    $(function () {
        $('#map')
            .bind('mapFocusChanged', function (event) {
                MashupPlatform.wiring.pushEvent('center_point', JSON.stringify({ lat: event.originalEvent.detail.lat, lon: event.originalEvent.detail.lon }));
            })
            .bind('mapClicked', function (event) {
                MashupPlatform.wiring.pushEvent('clicked', JSON.stringify(event.originalEvent.detail));

                if (!event.originalEvent.detail.ooi) return;
                var clickedOoi = resolveOOI(event.originalEvent.detail.ooi);

                var selectedIndex = -1;
                for (var i = 0; i < selected.length && selectedIndex == -1; i++)
                    if (selected[i].entityId === clickedOoi.entityId)
                        selectedIndex = i;

                if (selectedIndex === -1)
                    selected.push(clickedOoi);
                else
                    selected.splice(selectedIndex, 1);

                // this is primarily used to synchronize selected OOIs between widgets that support this behavior
                MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
            })
            .bind('polygonDrawn', function (event) {
                MashupPlatform.wiring.pushEvent('drawing', JSON.stringify(event.originalEvent.detail));
                map.setMode('view');
            });
    });

    function resolveOOI(ooi) {
        function findById(entityId) {
            if (!entitiesLookupTable.hasOwnProperty(entityId))
                throw 'Entities table is inconsistent!';
            return entitiesLookupTable[entityId];
        }

        if (typeof ooi === 'string')
            return findById(ooi);
        else if (ooi.hasOwnProperty('EntityId')) // WFS likes CamelCasing
            return findById(ooi.EntityId);
        else if(ooi.hasOwnProperty('entityId')) // nothing to do there, move along
            return ooi;
        else
            throw 'Invalid method arguments. Not sure how to handle that.';
    }
}
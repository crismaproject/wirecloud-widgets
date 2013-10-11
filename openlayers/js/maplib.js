/**
 * A facade-like interface to handle interaction with the OpenLayers library.
 * @param {string} container the id of the DOM element where the map should be rendered
 * @constructor
 */
function OpenLayersFacade(container) {
    /** @const */
    var EPSG_4326_PROJECTION = new OpenLayers.Projection('EPSG:4326'); // WGS 1984
    var geometryLayer = new OpenLayers.Layer.Vector('Geometry Layer');
    this.wfsUri = 'http://localhost/ows';

    /**
     * Contains the OpenLayers map object
     * @type {OpenLayers.Map}
     */
    var map = new OpenLayers.Map(container, {
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap",
                ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]),
            geometryLayer
        ],
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent,
            click: mapClickEvent
        }
    });

    var selectControl = new OpenLayers.Control.SelectFeature([geometryLayer], { clickout: true });
    selectControl.onSelect = function (e) {
        if (e.layer == geometryLayer) mapClickEvent(e, { area: e.attributes });
        else mapClickEvent(e);
    };
    map.addControl(selectControl);
    selectControl.activate();

    /** @private */
    this.map = map;

    /**
     * Pans the map to the specified object. The object can either be: a latitude-longitude coordinate pair, OR
     * the id of a registered item.
     *
     * @example
     * facade.view(31.25, 27.5);
     * facade.view('myPoi1');
     */
    this.view = function () {
        if (arguments.length == 2 && typeof arguments[0] == 'number' && typeof arguments[1] == 'number') {
            var projectedCoordinates = latLon(arguments[0], arguments[1]); // actually returns a Point, but we need LonLat for map.panTo
            map.panTo(new OpenLayers.LonLat(projectedCoordinates.x, projectedCoordinates.y));
        } else if (arguments.length == 1 && typeof arguments[0] == 'string') {
            var wfsLayer = this.getWfsLayer();
            if (wfsLayer) {
                for (var i = 0; i < wfsLayer.features.length; i++) {
                    if (wfsLayer.features[i].data['EntityId'] === arguments[0] ||
                        wfsLayer.features[i].data['EntityName'] === arguments[0]) {
                        var geometry = wfsLayer.features[i].geometry;
                        map.panTo(new OpenLayers.LonLat(geometry.x, geometry.y));
                        break;
                    }
                }
            }
        }
    };

    /**
     * @param {object} area
     * @param {string} area.id
     * @param {object} area.location
     * @param {Number} area.location.lat
     * @param {Number} area.location.lon
     * @param {string?} area.name
     */
    this.createArea = function (area) {
        var areaLocation = area['_areaLocation'];
        var center = new OpenLayers.Geometry.Point(areaLocation.lon, areaLocation.lat).transform(EPSG_4326_PROJECTION, mapProjection());
        var radius = 150; // WARNING: This is an arbitrary constant
        var steps = 25;   // WARNING: This is an arbitrary constant
        var stept = 2 * Math.PI / steps;
        var points = [ ];
        for (var i = 0; i < steps; i++)
            points[i] = new OpenLayers.Geometry.Point(
                center.x + radius * Math.cos(stept * i),
                center.y + radius * Math.sin(stept * i)
            );

        var poly = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)]);
        var vector = new OpenLayers.Feature.Vector(poly, { area: area });
        geometryLayer.addFeatures(vector);
    };

    this.createOOI = function (ooi) {
        throw 'NotImplemented'; // TODO
    }

    /**
     * Converts latitude-longitude coordinate pairs to a properly projected OpenLayers.LonLat instance.
     * @param {Number} latitude
     * @param {Number} longitude
     * @returns {OpenLayers.Geometry.Point}
     * @private
     */
    function latLon(latitude, longitude) {
        return new OpenLayers.Geometry.Point(longitude, latitude).transform(EPSG_4326_PROJECTION, mapProjection());
    }

    /**
     * Gets the map's internal projection (defaults to EPSG:900913 if it hasn't been initialized yet).
     * @returns {OpenLayers.Projection}
     * @private
     */
    function mapProjection() {
        return map ? map.getProjectionObject() : new OpenLayers.Projection('EPSG:900913');
    }

    /**
     * Handles an internal event that relays changes of the map's center and/or zoom factor.
     * @param ev event data
     * @private
     */
    function mapEvent(ev) {
        var lonlatCenter = ev.object.center.clone().transform(mapProjection(), EPSG_4326_PROJECTION);
        var coordData = { 'lat': lonlatCenter.lat, 'lon': lonlatCenter.lon, 'z': ev.object.zoom };
        fireEvent('mapFocusChanged', coordData);
    }

    /**
     * Handles an internal event that relays clicks on the map.
     * @param ev event data
     * @private
     */
    function mapClickEvent(ev) {
        var opx = typeof ev.xy !== 'undefined' ? map.getLonLatFromViewPortPx(ev.xy) : ev.geometry.getCentroid();
        var clickCenter = opx.transform(mapProjection(), EPSG_4326_PROJECTION);
        var coordData = { 'lat': clickCenter.lat || clickCenter.x, 'lon': clickCenter.lon || clickCenter.y };
        if (arguments[1]) coordData = $.extend(arguments[1], coordData);
        fireEvent('mapClicked', coordData);
    }

    /**
     * Triggers a custom event (bubbling and cancelable) with the specified name at the
     * map's own DOM root object (the same that was specified in the constructor).
     *
     * @param {string} name the event's name.
     * @param {Object=} data additional event data.
     * @private
     */
    function fireEvent(name, data) {
        var event = new CustomEvent(name, { detail: data, bubbles: true, cancelable: true });
        document.getElementById(container).dispatchEvent(event);
    }
}

function graphicFor(entityTypeId) {
    //noinspection FallthroughInSwitchStatementJS
    switch (entityTypeId) {
        case 7:
        case 8:
            return 'img/ambulance.png';
        case 9:
            return 'img/hospital.png';
        case 10:
            return 'img/person.png';
        case 11:
            return 'img/danger.png';
        default:
            return 'img/ooi.png';
    }
}
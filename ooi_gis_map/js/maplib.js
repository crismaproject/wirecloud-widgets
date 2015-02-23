//var RENDERERS = ["Canvas", "SVG", "VML"];
var RENDERERS = ["SVG"];

/**
 * A façade-like interface to handle interaction with the OpenLayers library.
 * @param {string} container the id of the DOM element where the map should be rendered
 * @constructor
 */
function OpenLayersFacade(container) {
    /** @const */
    var EPSG_4326_PROJECTION = new OpenLayers.Projection('EPSG:4326'); // WGS 1984
    var geometryLayer = new OpenLayers.Layer.Vector('Geometry Layer', { renderers: RENDERERS, displayInLayerSwitcher: false });
    var ooiLayer = new OpenLayers.Layer.Vector('Other OOIs', { renderers: RENDERERS, displayInLayerSwitcher: false });
    ooiLayer.setZIndex(1000);

    var ooiStyle = $.extend({}, OpenLayers.Feature.Vector.style['default'], {
        graphicWidth: 31,
        graphicHeight: 31,
        fillOpacity:.8,
        externalGraphic: 'img/ooi.png'
    });

    /**
     * Contains the OpenLayers map object
     * @type {OpenLayers.Map}
     */
    var map = new OpenLayers.Map(container, {
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap",
                ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"], {'displayInLayerSwitcher':false}),
            geometryLayer,
            ooiLayer
        ],
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent,
            click: mapClickEvent
        },
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

    entityTypes
        .filter(function(x) { return x.hasOwnProperty('dedicatedLayer'); })
        .forEach(function(x, i) {
            var dedicatedLayer = new OpenLayers.Layer.Vector(x.dedicatedLayer, { renderers: RENDERERS });
            dedicatedLayer.setZIndex(1000 - i);
            x.layer = dedicatedLayer;
            if (x.hasOwnProperty('inactive') && x.inactive)
                dedicatedLayer.setVisibility(false);
            map.addLayer(x.layer);
        });

    /**
     * Selection control that captures and relays clicks on OOIs and misc. geometry
     * @type {OpenLayers.Control.SelectFeature}
     */
    var selectControl = new OpenLayers.Control.SelectFeature(map.layers.filter(function(x) { return x instanceof OpenLayers.Layer.Vector }), { clickout: true });
    selectControl.onSelect = function (e) {
        if (e.layer instanceof OpenLayers.Layer.OSM)
            mapClickEvent(e);
        else
            mapClickEvent(e, { ooi: e.attributes });
    };
    map.addControl(selectControl);
    selectControl.activate();

    var drawPolyControl = new OpenLayers.Control.DrawFeature(geometryLayer, OpenLayers.Handler.Polygon);
    map.addControl(drawPolyControl);
    drawPolyControl.deactivate();
    drawPolyControl.events.register('featureadded', drawPolyControl, function(f) {
        var feature = f.feature;
        feature.geometry.transform(mapProjection(), EPSG_4326_PROJECTION);
        fireEvent('polygonDrawn', new OpenLayers.Format.WKT().write(feature));
    });

    var switcherControl = new OpenLayers.Control.LayerSwitcher();
    map.addControl(switcherControl);
    switcherControl.activate();

    /** @private */
    this.map = map;

    /**
     * Creates a new circular area on the map.
     * @param {float} lat the circle's center latitude.
     * @param {float} lon the circle's center longitude.
     * @param {*?} ooi the OOI represented by this circle.
     */
    this.createArea = function (lat, lon, ooi) {
        var center = new OpenLayers.Geometry.Point(lon, lat).transform(EPSG_4326_PROJECTION, mapProjection());
        var radius = 150; // NOTE: This is an arbitrary constant; describes size of the circle to be drawn
        var steps = 26;   // NOTE: This is an arbitrary constant; describes amount of points along the circumference
        var stept = 2 * Math.PI / steps;
        var points = [ ];
        for (var i = 0; i < steps; i++)
            points[i] = new OpenLayers.Geometry.Point(
                    center.x + radius * Math.cos(stept * i),
                    center.y + radius * Math.sin(stept * i)
            );

        var poly = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)]);
        var vector = new OpenLayers.Feature.Vector(poly, ooi);
        geometryLayer.addFeatures(vector);
    };

    this.setMode = function (mode) {
        switch (mode) {
            case 'edit':
                selectControl.deactivate();
                drawPolyControl.activate();
                break;

            default:
                selectControl.activate();
                drawPolyControl.deactivate();
                break;
        }
    };

    /**
     * Restricts the map view to the specified bounding box. If no arguments are provided, the
     * bounding box is reset.
     * @param {float?} left
     * @param {float?} bottom
     * @param {float?} right
     * @param {float?} top
     */
    this.setBBox = function (left, bottom, right, top) {
        map.setOptions({
            restrictedExtent: arguments.length >= 4 ?
                new OpenLayers.Bounds(left, bottom, right, top).transform(EPSG_4326_PROJECTION, mapProjection()) :
                null
        });
    };

    /**
     * Sets the center of the map to the specified coordinates.
     * @param {float} lat
     * @param {float} lon
     * @param {float?} z
     */
    this.focusOn = function (lat, lon, z) {
        map.setCenter(latLon(lat, lon), z);
    };

    /**
     * Repositions the map so that it contains all elements displayed on it.
     * @return {boolean} true, if the map moves to a new extent; false otherwise.
     */
    this.focusOnAll = function () {
        var maxExtent = new OpenLayers.Bounds();
        map.layers
            .filter(function(x) { return x instanceof OpenLayers.Layer.Vector && x.features.length; })
            .forEach(function(x) { maxExtent.extend(x.getDataExtent()); });
        var size = maxExtent.getSize();
        if (size.h > 0 && size.w > 0) {
            map.zoomToExtent(maxExtent);
            return true;
        } else return false;
    };

    /**
     * Creates a new OOI on the map, depicted as an icon.
     * @param {object} ooi the OOI to display.
     * @param {int} ooi.entityTypeId the entity's type identifier
     * @param {String} ooi.entityName the entity's name
     * @param {*[]} ooi.entityInstancesGeometry the entity's geometry (WKT format)
     */
    this.createOOI = function (ooi) {
        var wkt = new OpenLayers.Format.WKT(ooi);
        var wktData = ooi.entityInstancesGeometry[0].geometry.geometry.wellKnownText;
        var vector = wkt.read(wktData);
        if (ooi.entityTypeId == 14 && vector.geometry instanceof OpenLayers.Geometry.Point)
            this.createArea.call(this, vector.geometry.x, vector.geometry.y, ooi);
        else {
            var actualVector = new OpenLayers.Feature.Vector(
                latLon(vector.geometry.x, vector.geometry.y),
                ooi,
                $.extend({}, ooiStyle, {
                    title: ooi.entityName,
                    externalGraphic: graphicFor(ooi.entityTypeId)
                })
            );

            var layer = this.layerFor.call(this, ooi.entityTypeId);
            layer.addFeatures(actualVector);
        }
    };

    this.layerFor = function(entityTypeId) {
        var entry = entityTypes.find(function (x) { return entityTypeId == x.id; });
        return entry && entry.hasOwnProperty('layer') ? entry['layer'] : ooiLayer;
    };

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

/**
 * Returns a relative URI to an image that can be used for the specified entity type.
 * @param {number} entityTypeId the entity type's unique identifier
 * @returns {string} a relative path to an image corresponding to the specified entity type ID.
 */
function graphicFor(entityTypeId) {
    var entry = entityTypes.find(function (x) { return entityTypeId == x.id; });
    return entry ? entry['img'] : 'img/ooi.png';
}
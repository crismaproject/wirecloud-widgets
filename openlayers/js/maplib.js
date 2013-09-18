/**
 * A facade-like interface to handle interaction with the OpenLayers library.
 * @param {string} container the id of the DOM element where the map should be rendered
 * @param {float=} initLat the initial center latitude to display (optional)
 * @param {float=} initLong the initial center longitude to display (optional)
 * @param {int=} initZ the initial zoom factor to display (optional)
 * @constructor
 */
function OpenLayersFacade(container, initLat, initLong, initZ) {
    /** @const */
    var EPSG_4326_PROJECTION = new OpenLayers.Projection('EPSG:4326'); // WGS 1984
    var geometryLayer = new OpenLayers.Layer.Vector('Geometry Layer');
    this.wfsUri = 'http://localhost/ows';

    function graphicFor(typeIdentifier) {
        switch (typeIdentifier) {
            case 'Ambulance':
            case 'Ambulance Station':
                return 'img/ambulance.png';
            case 'Hospital':
                return 'img/hospital.png';
            case 'Patient':
                return 'img/person.png';
            case 'Incident':
                return 'img/danger.png';
            default:
                console.log('Unknown OOI type: ' + typeIdentifier);
                return 'img/ooi.png';
        }
    }

    /**
     * Contains the OpenLayers map object
     * @type {OpenLayers.Map}
     */
    var map = new OpenLayers.Map({
        div: container,
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap",
                ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]),
            geometryLayer
        ],
        center: latLon(initLat || 51.75, initLong || -1.25),
        zoom: initZ || 3,
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent,
            click: mapClickEvent
        }
    });

    /** @private */
    this.map = map;

    /**
     * @private
     * @returns {OpenLayers.Layer.Vector}
     */
    this.getWfsLayer = function () {
        var layers = this.map.getLayersByName("OOI-WFS-Entities");
        return layers.length ? layers[0] : null;
    };

    this.loadWfsFor = function (worldStateId) {
        var originalLayer = this.getWfsLayer();
        if (originalLayer != null)
            this.map.removeLayer(originalLayer);

        var originalSelectControls = this.map.getControlsByClass('OpenLayers.Control.SelectFeature');
        if (originalSelectControls != null && originalSelectControls.length > 0)
            for (var i = 0; i < originalSelectControls.length; i++) {
                originalSelectControls[i].deactivate();
                this.map.removeControl(originalSelectControls[i]);
            }

        if (!this.wfsUri) throw 'No WFS URI set!';

        if (worldStateId) {
            var wfsLayerProtocol = new OpenLayers.Protocol.WFS({
                readFormat: new OpenLayers.Format.GML({xy: false}),
                version: "1.0.0",
                url: this.wfsUri,
                featurePrefix: "OOI-WSR",
                featureType: "OOI-Entities",
                featureNS: "http://www.crismaproject.eu/",
                geometryName: "Geometry"
            });

            var wfsLayer = new OpenLayers.Layer.Vector(
                "OOI-WFS-Entities",
                {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    projection: EPSG_4326_PROJECTION,
                    protocol: wfsLayerProtocol,
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "OOI-WSR:WorldStateId",
                        value: worldStateId
                    })
                });

            var mapFacade = this;

            wfsLayer.events.register('beforefeatureadded', wfsLayer.events.object, function (obj) {
                var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.externalGraphic = graphicFor(obj.feature.data.EntityTypeName);
                style.graphicWidth = 25;
                style.graphicHeight = 25;
                style.title = obj.feature.data.EntityName;
                style.fillOpacity = .75;
                obj.feature.style = style;
            });

            wfsLayer.events.register('featuresadded', wfsLayer.events.object, function (eventData) {
                var bounds = new OpenLayers.Bounds();
                for (var i = 0; i < eventData.features.length; i++)
                    bounds.extend(eventData.features[i].geometry);

                mapFacade.map.zoomToExtent(bounds);
            });

            this.map.addLayer(wfsLayer);

            var selectControl = new OpenLayers.Control.SelectFeature(wfsLayer, {
                clickout: true,
                onSelect: function (feature) {
                    fireEvent('poiClicked', { clicked: feature.data });
                }
            });

            this.map.addControl(selectControl);
            selectControl.activate();
        }
    };

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
     * Pans the map so that all elements are visible at a maximum zoom level.
     */
    this.viewAll = function () {
        var bounds = new OpenLayers.Bounds();
        for (var id in this.elements) {
            var element = this.elements[id];
            if (element.type == 'poi')
                bounds.extend(element['coordinates']);
            else if (element.type == 'poly')
                for (var j = 0; j < element['points'].length; j++)
                    bounds.extend(element['points'][j]);
        }
        map.zoomToExtent(bounds);
    };

    /**
     * Removes all elements from the map.
     */
    this.clear = function () {
        geometryLayer.removeAllFeatures();
        this.elements = [];
        geometryLayer.redraw();
    };

    /**
     * Creates an array of points from an array of [x, y] tuples.
     *
     * @param {Array} points an array of [x, y] tuples.
     * @returns {Array} an array of Point instances with the correct map projection.
     * @private
     */
    function project(points) {
        var projectedPoints = [];
        for (var i = 0; i < points.length; i++)
            projectedPoints[i] = latLon(points[i][0], points[i][1]);
        return projectedPoints;
    }

    /**
     * Converts latitude-longitude coordinate pairs to a properly projected OpenLayers.LonLat instance.
     * @param {float} latitude
     * @param {float} longitude
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
        var opx = map.getLonLatFromViewPortPx(ev.xy);
        var clickCenter = opx.transform(mapProjection(), EPSG_4326_PROJECTION);
        var coordData = { 'lat': clickCenter.lat, 'lon': clickCenter.lon };
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
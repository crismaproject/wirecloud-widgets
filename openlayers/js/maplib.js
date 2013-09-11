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

    this.loadWorldState = function(worldStateId) {
        var autoFocus = typeof this.worldState === 'undefined';
        this.worldState = worldStateId;

        var originalLayer = this.map.getLayersByName("OOI-Entities-WS");
        if (originalLayer != null && originalLayer.length > 0)
            for (var i = 0; i < originalLayer.length; i++)
                this.map.removeLayer(originalLayer[i]);

        var originalSelectControls = this.map.getControlsByClass('OpenLayers.Control.SelectFeature');
        if (originalSelectControls != null && originalSelectControls.length > 0)
            for (var i = 0; i < originalSelectControls.length; i++) {
                originalSelectControls[i].deactivate();
                this.map.removeControl(originalSelectControls[i]);
            }

        if (worldStateId != null) {
            var wfsLayerProtocol = new OpenLayers.Protocol.WFS({
                readFormat: new OpenLayers.Format.GML({xy: false}),
                version: "1.0.0",
                url: this.wfsUriBase + '?service=WFS&version=1.0.0&request=GetFeature&typeName=OOI-WSR:OOI-Entities&maxFeatures=50&viewparams=wsid:' + worldStateId,
                featurePrefix: "OOI-WSR",
                featureType: "OOI-Entities",
                featureNS: "http://www.crismaproject.eu/",
                geometryName: "Geometry"
            });

            var wfsLayer = new OpenLayers.Layer.Vector(
                "OOI-Entities-WS",
                {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    projection: EPSG_4326_PROJECTION,
                    protocol: wfsLayerProtocol
                });

            wfsLayer.events.register('beforefeatureadded', wfsLayer.events.object, function(obj) {
                var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.externalGraphic = graphicFor(obj.feature.data.EntityTypeName);
                style.graphicWidth = 25;
                style.graphicHeight = 25;
                style.title = obj.feature.data.EntityName;
                style.fillOpacity = .75;
                obj.feature.style = style;
            });

            if (autoFocus) {
                wfsLayer.events.register('featuresadded', wfsLayer.events.object, function(eventData) {
                    autoFocus = false;

                    var bounds = new OpenLayers.Bounds();
                    for (var i = 0; i < eventData.features.length; i++)
                        bounds.extend(eventData.features[i].geometry);

                    this.map.zoomToExtent(bounds);
                });
            }

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
    }

    /**
     * Contains all elements currently shown on the map.
     * @type {Array}
     */
    this.elements = { };

    this.wfsUriBase = 'http://localhost/ows';

    var readonly = true;

    /**
     * Gets if the viewer is in a readonly mode.
     * @returns {boolean} true iff it is readonly, false otherwise.
     */
    this.isReadonly = function () {
        return readonly;
    };

    /**
     * Sets whether the viewer is readonly (ie. drawing is disallowed).
     * @param {boolean} value
     */
    this.setReadonly = function (value) {
        readonly = value;
        this.setMode('select');
    };

    /**
     * Sets the viewer's drawing mode.
     * @param {string} mode Must be one of the following: 'select' for panning, 'poi' for placing points, 'line' for drawing lines, or 'poly' for polygons.
     * If the viewer is readonly, only 'select' is allowed.
     */
    this.setMode = function (mode) {
        if (readonly && mode !== 'select') return;
        for (var key in drawPanel.controls)
            drawPanel.controls[key].deactivate();
        drawControls[drawControls.hasOwnProperty(mode) ? mode : 'select'].activate();
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
        } else if (arguments.length == 1 && typeof arguments[0] == 'string' && this.elements.hasOwnProperty(arguments[0])) {
            var item = this.elements[arguments[0]];
            var panTarget = null;
            if (item.hasOwnProperty('coordinates'))
                panTarget = item['coordinates'];
            else if (item.hasOwnProperty('points')) {
                panTarget = new OpenLayers.Bounds();
                for (var i = 0; i < item['points'].length; i++)
                    panTarget.extend(item['points'][i]);
            }
            map.zoomToExtent(panTarget);
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
     * Adds a point of interest to the map.
     * @param {string} id a unique identifier for the object.
     * @param {float} lat the latitude of the object.
     * @param {float} lon the longitude of the object.
     * @param {string=} icon the URL to the icon that represents this POI.
     */
    this.add = function (id, lat, lon, icon) {
        if (!icon) icon = 'img/marker.png';
        if (this.elements.hasOwnProperty(id)) this.remove.call(this, id);

        this.elements[id] =
        {
            'id': id,
            'type': 'poi',
            'coordinates': latLon(lat, lon),
            'icon': icon
        };
        addPoiToMap.call(this, id);
    };

    /**
     * Adds a polygon to the map.
     *
     * @param {string} id the object's unique identifier.
     * @param {Array} points an array of [x, y] tuples that are edges of the outline of the polygon.
     */
    this.addPoly = function (id, points) {
        if (this.elements.hasOwnProperty(id)) this.remove.call(this, id);
        points = project(points);
        this.elements[id] =
        {
            'id': id,
            'type': 'poly',
            'points': points
        };
        addPolyToMap.call(this, id);
    };

    /**
     * Adds a polyline to the map.
     *
     * @param {string} id the object's unique identifier.
     * @param {Array} points an array of [x, y] tuples that form the polyline.
     */
    this.addLine = function (id, points) {
        if (this.elements.hasOwnProperty(id)) this.remove.call(this, id);
        points = project(points);
        this.elements[id] =
        {
            'id': id,
            'type': 'line',
            'points': points
        };
        addLineToMap.call(this, id);
    };

    /**
     * Moves a marker to the designated coordinates. This ONLY works with points of interests added
     * through {OpenLayersFacade.add}; everything else will be ignored.
     * @param {string} id the marker's unique identifier. If no marker by this identifier exists, this method will do nothing.
     * @param {float} lat the marker's new latitude.
     * @param {float} lon the marker's new longitude.
     */
    this.move = function (id, lat, lon) {
        if (this.elements[id] && this.elements[id].type == 'poi') {
            removeFromMap.call(this, id);
            this.elements[id]['coordinates'] = latLon(lat, lon);
            addPoiToMap.call(this, id);
        }
    };

    /**
     * Removes an object (marker OR polygon) from the map using its unique identifier.
     * @param {string} id
     */
    this.remove = function (id) {
        if (!this.elements.hasOwnProperty(id)) return;
        var type = this.elements[id]['type'];
        if (type == 'poi')  removeFromMap.call(this, id);
        else if (type == 'poly' || type == 'line') removePolyFromMap.call(this, id);
        delete this.elements[id];
    };

    /** @private */
    this.map = map;

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
     * Removes a marker from the map using its unique identifier.
     * @param {string} id
     * @private
     */
    function removeFromMap(id) {
        if (this.elements[id] && this.elements[id]['_inst'])
            removeAndRedraw.call(this, id, geometryLayer);
    }

    /**
     * Removes a feature from a specific layer using its unique element identifier.
     * @param {string} id
     * @param {OpenLayers.Layer.Vector} layer
     * @private
     */
    function removeAndRedraw(id, layer) {
        layer.removeFeatures([this.elements[id]['_inst']]);
        layer.redraw();
    }

    /**
     * Adds an internally registered but not yet rendered marker to the map.
     * @param {string} id
     * @private
     */
    function addPoiToMap(id) {
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = this.elements[id]['icon'];
        style.graphicWidth = 25;
        style.graphicHeight = 25;
        style.title = id;
        style.fillOpacity = .75;

        var vector = new OpenLayers.Feature.Vector(this.elements[id]['coordinates'], { id: id }, style);
        geometryLayer.addFeatures([vector]);
        this.elements[id]['_inst'] = vector;
    }

    /**
     * Adds an internally registered but not yet rendered polygon to the map.
     * @param {string} id
     * @private
     */
    function addPolyToMap(id) {
        var ring = new OpenLayers.Geometry.LinearRing(this.elements[id]['points']);
        var polygon = new OpenLayers.Geometry.Polygon([ring]);
        this.elements[id]['_inst'] = new OpenLayers.Feature.Vector(polygon, { id: id });
        geometryLayer.addFeatures(this.elements[id]['_inst']);
        geometryLayer.redraw();
    }

    /**
     * Adds an internally registered but not yet rendered polyline to the map.
     * @param {string} id
     * @private
     */
    function addLineToMap(id) {
        var lines = new OpenLayers.Geometry.LineString(this.elements[id]['points']);
        this.elements[id]['_inst'] = new OpenLayers.Feature.Vector(lines, { id: id }, {
            strokeWidth: 3,
            strokeOpacity: .5,
            strokeColor: '#ff3333'
        });
        geometryLayer.addFeatures(this.elements[id]['_inst']);
        geometryLayer.redraw();
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

    function unravel(array) {
        var points = [];
        for (var i = 0; i < array.length; i++) {
            var point = array[i].clone().transform(mapProjection(), EPSG_4326_PROJECTION);
            points[i] = [ point.x, point.y ];
        }
        return points;
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
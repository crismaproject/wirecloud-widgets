/**
 * A facade-like interface to handle interaction with the OpenLayers library.
 * @param container the id of the DOM element where the map should be rendered
 * @param initLat the initial center latitude to display (optional)
 * @param initLong the initial center longitude to display (optional)
 * @param initZ the initial zoom factor to display (optional)
 */
function OpenLayersFacade(container, initLat, initLong, initZ) {
    var epsg4326Projection = new OpenLayers.Projection('EPSG:4326'); // WGS 1984
    var vectorLayer = new OpenLayers.Layer.Vector();

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
            vectorLayer
        ],
        center: latLon(initLat || 51.75, initLong || -1.25),
        zoom: initZ || 3,
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent
        }
    });

    var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {clickout: true});
    selectControl.onSelect = function(feature) {
        fireEvent('poiClicked', { clicked: feature.attributes.id });
    };
    map.addControl(selectControl);
    selectControl.activate();

    /**
     * Contains all elements currently shown on the map.
     * @type {Array}
     */
    this.elements = { };
    this.view = view;
    this.viewAll = viewAll;
    this.add = add;
    this.addPoly = addPoly;
    this.addLine = addLine;
    this.move = move;
    this.remove = remove;
    this.map = map;

    /**
     * Pans the map to the specified latitude-longitude coordinates.
     * @param lat the latitude
     * @param lon the longitude
     */
    function view(lat, lon) {
        map.panTo(latLon(lat, lon));
    }

    function viewAll() {
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
    }

    /**
     * Adds a point of interest to the map.
     * @param id a unique identifier for the object.
     * @param lat the latitude of the object.
     * @param lon the longitude of the object.
     */
    function add(id, lat, lon, icon) {
        if (!icon) icon = 'img/marker.png';
        if (this.elements.hasOwnProperty(id)) remove.call(this, id);

        this.elements[id] =
        {
            'id': id,
            'type': 'poi',
            'coordinates': latLon(lat, lon),
            'icon': icon
        };
        addToMap.call(this, id);
    }

    /**
     * Creates an array of points from an array of [x, y] tuples.
     *
     * @param points an array of [x, y] tuples.
     * @returns {Array} an array of Point instances with the correct map projection.
     */
    function project(points) {
        var projectedPoints = [];
        for (var i = 0; i < points.length; i++)
            projectedPoints[i] = latLon(points[i][0], points[i][1]);
        return projectedPoints;
    }

    /**
     * Adds a polygon to the map.
     *
     * @param id the object's unique identifier.
     * @param points an array of [x, y] tuples that are edges of the outline of the polygon.
     */
    function addPoly(id, points) {
        if (this.elements.hasOwnProperty(id)) remove.call(this, id);
        points = project(points);
        this.elements[id] =
        {
            'id': id,
            'type': 'poly',
            'points': points
        };
        addPolyToMap.call(this, id);
    }

    function addLine(id, points) {
        if (this.elements.hasOwnProperty(id)) remove.call(this, id);
        points = project(points);
        this.elements[id] =
        {
            'id': id,
            'type': 'line',
            'points': points
        };
        addLineToMap.call(this, id);
    }

    /**
     * Removes a marker from the map using its unique identifier.
     * @param id
     */
    function removeFromMap(id) {
        if (this.elements[id]['_inst']) {
            vectorLayer.removeFeatures([this.elements[id]['_inst']]);
            vectorLayer.redraw();
        }
    }

    /**
     * Removes a polygon from the map using its unique identifier.
     * @param id
     */
    function removePolyFromMap(id) {
        if (this.elements[id]['_inst']) {
            vectorLayer.removeFeatures(this.elements[id]['_inst']);
            vectorLayer.redraw();
        }
    }

    /**
     * Adds an internally registered but not yet rendered marker to the map.
     * @param id
     * @see add
     */
    function addToMap(id) {
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = this.elements[id]['icon'];
        style.graphicWidth = 25;
        style.graphicHeight = 25;
        style.title = id;
        style.fillOpacity = .75;

        var vector = new OpenLayers.Feature.Vector(this.elements[id]['coordinates'], { id: id }, style);
        vectorLayer.addFeatures([vector]);
        this.elements[id]['_inst'] = vector;
    }

    /**
     * Adds an internally registered but not yet rendered polygon to the map.
     * @param id
     * @see addPoly
     */
    function addPolyToMap(id) {
        var ring = new OpenLayers.Geometry.LinearRing(this.elements[id]['points']);
        var polygon = new OpenLayers.Geometry.Polygon([ring]);
        this.elements[id]['_inst'] = new OpenLayers.Feature.Vector(polygon, { id: id });
        vectorLayer.addFeatures(this.elements[id]['_inst']);
        vectorLayer.redraw();
    }

    function addLineToMap(id) {
        var lines = new OpenLayers.Geometry.LineString(this.elements[id]['points']);
        this.elements[id]['_inst'] = new OpenLayers.Feature.Vector(lines, { id: id }, {
                strokeWidth: 3,
                strokeOpacity: .5,
                strokeColor: '#ff3333'
        });
        vectorLayer.addFeatures(this.elements[id]['_inst']);
        vectorLayer.redraw();
    }

    /**
     * Moves a marker to the designated coordinates.
     * @param id the marker's unique identifier. If no marker by this identifier exists, this method will do nothing.
     * @param lat the marker's new latitude.
     * @param lon the marker's new longitude.
     */
    function move(id, lat, lon) {
        if (this.elements[id]) {
            removeFromMap.call(this, id);
            this.elements[id]['coordinates'] = latLon(lat, lon);
            addToMap.call(this, id);
        }
    }

    /**
     * Removes an object (marker OR polygon) from the map using its unique identifier.
     * @param id
     */
    function remove(id) {
        if (!this.elements.hasOwnProperty(id)) return;
        var type = this.elements[id]['type'];
        if      (type == 'poi')  removeFromMap.call(this, id);
        else if (type == 'poly' || type == 'line') removePolyFromMap.call(this, id);
        delete this.elements[id];
    }

    /**
     * Converts latitude-longitude coordinate pairs to a properly projected OpenLayers.LonLat instance.
     * @param latitude
     * @param longitude
     * @returns {OpenLayers.Geometry.Point}
     */
    function latLon(latitude, longitude) {
        return new OpenLayers.Geometry.Point(longitude, latitude).transform(epsg4326Projection, mapProjection());
    }

    /**
     * Gets the map's internal projection (defaults to EPSG:900913 if it hasn't been initialized yet).
     * @returns {OpenLayers.Projection}
     */
    function mapProjection() {
        return map ? map.getProjectionObject() : new OpenLayers.Projection('EPSG:900913');
    }

    /**
     * Handles an internal event that relays changes of the map's center and/or zoom factor.
     * @param ev event data
     */
    function mapEvent(ev) {
        var lonlatCenter = ev.object.center.clone().transform(mapProjection(), epsg4326Projection);
        var coordData = { 'lat': lonlatCenter.lat, 'lon': lonlatCenter.lon, 'z': ev.object.zoom };
        fireEvent('mapFocusChanged', coordData);
    }

    /**
     * Triggers a custom event (bubbling and cancelable) with the specified name at the
     * map's own DOM root object (the same that was specified in the constructor).
     *
     * @param name the event's name.
     * @param data additional event data.
     */
    function fireEvent(name, data) {
        var event = new CustomEvent(name, { detail: data, bubbles: true, cancelable: true });
        document.getElementById(container).dispatchEvent(event);
    }
}
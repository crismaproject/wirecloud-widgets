$(function(){
    var epsg4326Projection = new OpenLayers.Projection('EPSG:4326'); // WGS 1984

    //var poiIcon = new OpenLayers.Icon('img/marker.png', { w: 21, h: 32 }, { x: -10, y: -32 });

    var vectorLayer = new OpenLayers.Layer.Vector();
    //var markerLayer = new OpenLayers.Layer.Markers();
    var map = new OpenLayers.Map({
        div: 'map',
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap",
                ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]),
            vectorLayer
            //markerLayer
        ],
        center: latLon(51.75, -1.25),
        zoom: 3,
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent
        }
    });

    function mapProjection() {
        return map ? map.getProjectionObject() : new OpenLayers.Projection('EPSG:900913');
    }

    function latLon(latitude, longitude) {
        return new OpenLayers.LonLat(longitude, latitude).transform(epsg4326Projection, mapProjection());
    }

    function mapEvent(ev) {
        var lonlatCenter = ev.object.center.clone().transform(mapProjection(), epsg4326Projection);
        var coordData = [ lonlatCenter.lat, lonlatCenter.lon, ev.object.zoom ];
        var coordDataStr = JSON.stringify(coordData);
        console.log(coordData);
        //MashupPlatform.wiring.pushEvent('center_point', coordDataStr);
    }

    function view(lat, lon, z) {
        map.panTo(latLon(lat, lon));
        if (typeof(z) !== 'undefined')
            map.zoomTo(z);
    }

    function addPolygon(points) {
        var pointList = [];
        for (var i = 0; i < points.length; i++)
            pointList.push(new OpenLayers.Geometry.Point(points[i][1], points[i][0]));
        var linearRing = new OpenLayers.Geometry.LinearRing(pointList).transform(epsg4326Projection, mapProjection());
        var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
        vectorLayer.addFeatures([polygonFeature]);
        return polygonFeature;
    }

    function addPoI(lat, lon) {
        var coords = latLon(lat, lon);
        var point = new OpenLayers.Geometry.Point(coords.lon, coords.lat);
        marker = new OpenLayers.Feature.Vector(point);
        vectorLayer.addFeatures([marker]);
        return marker;
    }

    function focus() {
        map.zoomToExtent(vectorLayer.getDataExtent());
    }

    function removeVectors() {
        vectorLayer.removeAllFeatures();
    }

    /*MashupPlatform.wiring.registerCallback('view_point', function (ev) {
        view($.parseJSON(ev));
    });

    MashupPlatform.wiring.registerCallback('add_point', function (ev) {
        addPoI($.parseJSON(ev));
    });

    MashupPlatform.wiring.registerCallback('add_poly', function (ev) {
        addPolygon($.parseJSON(ev));
    });

    MashupPlatform.wiring.registerCallback('clear', function (ev) {
        removeVectors();
    });*/

    window.map = map;

    /* the code below is only relevant to doing magic when the marker moving thing is used on the site; it can be
     * removed when #move_marker is no longer present. */
    var marker = null;
    var point = null;

    $('#move_marker').click(function() {
        var lon = parseFloat($('#mLon').val());
        var lat = parseFloat($('#mLat').val());
        var coords = new OpenLayers.LonLat(lon, lat).transform(epsg4326Projection, mapProjection());

        if (marker == null) {
            point = new OpenLayers.Geometry.Point(coords.lon, coords.lat);
            marker = new OpenLayers.Feature.Vector(point);
            vectorLayer.addFeatures([marker]);
        } else {
            point.move(coords.lon - point.x, coords.lat - point.y);
            vectorLayer.drawFeature(marker);
        }

        map.setCenter(coords);
    });

    $('#draw_poly').click(function() {
        var points = [[43.5, -0.8], [45.98, -0.82], [46.825, -3.82], [48.6, -6.3], [49.541, 0.9], [53, 6], [54.75, 16], [44.6, 13.75], [42.25, 4.82]];
        var feature = addPolygon(points);
        $(this).attr('disabled', 'disabled');

        map.zoomToExtent(feature.geometry.getBounds(), false);
    });
});
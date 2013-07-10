$(function(){
    var epsg4326Projection = new OpenLayers.Projection('EPSG:4326'); // WGS 1984
    var mapProjection = new OpenLayers.Projection('EPSG:900913');    // Spherical Mercator Projection

    var poiIcon = new OpenLayers.Icon('img/marker.png', { w: 21, h: 32 }, { x: -10, y: -32 });

    function latLon(latitude, longitude) {
        return new OpenLayers.LonLat(longitude, latitude).transform(epsg4326Projection, mapProjection);
    }

    var vectorLayer = new OpenLayers.Layer.Vector();
    var markerLayer = new OpenLayers.Layer.Markers();
    var map = new OpenLayers.Map({
        div: 'map',
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap",
                ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]),
            vectorLayer,
            markerLayer
        ],
        center: latLon(51.75, -1.25),
        zoom: 3,
        eventListeners: {
            moveend: mapEvent,
            zoomend: mapEvent
        }
    });

    function mapEvent(ev) {
        var lonlatCenter = ev.object.center.clone().transform(mapProjection, epsg4326Projection);
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
            pointList.push(latLon(points[i][0], points[i][1]));
        var linearRing = new OpenLayers.Geometry.LinearRing(pointList).transform(epsg4326Projection, mapProjection);
        var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
        vectorLayer.addFeatures(polygonFeature);
        return polygonFeature;
    }

    function addPoI(lat, lon) {
        var marker = new OpenLayers.Marker(latLon(lat, lon), poiIcon);
        markerLayer.addMarker(marker);
        return marker;;
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
    var marker = new OpenLayers.Marker(new OpenLayers.LonLat(-2, 51).transform(epsg4326Projection, mapProjection), poiIcon);
    markerLayer.addMarker(marker);

    $('#move_marker').click(function() {
        var lon = parseFloat($('#mLon').val());
        var lat = parseFloat($('#mLat').val());

        if(lat && lon) {
            /*markerLayer.removeMarker(marker);
            marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat).transform(epsg4326Projection, mapProjection), poiIcon);
            markerLayer.addMarker(marker);*/

            marker.moveTo(new OpenLayers.LonLat(lon, lat));

            map.panTo(marker);
        }
    });
});
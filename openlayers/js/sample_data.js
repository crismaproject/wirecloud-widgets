function getXml(source, success) {
    $.ajax({
        type: 'GET',
        url: source,
        dataType: 'xml',
        success: success
    });
}

function loadSampleData(facade) {
    var actualMap = facade.map;
    var vectorLayer = actualMap.layers[1];

    loadRoutes(facade);
}

function loadRoutes(facade) {
    getXml('sample_data/routes.xml', function(xml) {
        $(xml).find('mapobject[entity="Path"]').each(function(index, element) {
            var id = $(element).find('name').text();
            var points = [];
            $(xml).find('latlng').each(function(index2, element2) {
                points.push([$(element2).attr('latY'), $(element2).attr('lonX')]);
            });
            facade.addLine(id, points);
        });
    });
}

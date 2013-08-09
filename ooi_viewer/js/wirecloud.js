/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof ooiViewer === 'undefined') {
        console.warn('"ooiViewer" variable is not defined.')
    } else {
        MashupPlatform.wiring.registerCallback('ooi', function (data) {
            var ooiId = parseJSON(data);

            // do something with the identifier now; eg. fetch it from the external resource, or something like that
            console.log('Implement me :(');
        });

        MashupPlatform.wiring.registerCallback('row', function (data) {
            var rowData = parseJSON(data);
            var id = null;

            if (data.hasOwnProperty('id')) {
                id = data.id;
                delete data.id;
            }

            ooiViewer.set(id, rowData);
        });

        $('#btn-locate').click(function () {
            // the following lines might throw errors as parts of the implementation are still missing
            if (window.hasOwnProperty('currentObj') && window.currentObj) {
                MashupPlatform.wiring.pushEvent('locate-ooi', window.currentObj.id);

                if (window.currentObj.hasOwnProperty('lon') && window.currentObj.hasOwnProperty('lat')
                    && window.currentObj.lon && window.currentObj.lat)
                    MashupPlatform.wiring.pushEvent('locate-lon-lat', JSON.stringify({ lon: window.currentObj.lon, lat: window.currentObj.lat }));
            }
        });
    }

    function parseJSON(data) {
        if (typeof data === 'string')
            data = $.parseJSON(data);
        return data;
    }
});
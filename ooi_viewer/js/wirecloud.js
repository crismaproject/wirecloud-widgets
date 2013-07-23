/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof ooiViewer === 'undefined') {
        console.warn('"map" variable is not defined.')
    } else {
        MashupPlatform.wiring.registerCallback('ooi', function (data) {
            var ooiId = parseJSON(data);
            map.view(ooiId);

            // do something with the identifier now; eg. fetch it from the external resource, or something like that
            console.debug('Implement me :(');
        });
    }

    function parseJSON(data) {
        if (typeof data === 'string')
            data = $.parseJSON(data);
        return data;
    }
});
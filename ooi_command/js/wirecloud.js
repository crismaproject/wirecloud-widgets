/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        MashupPlatform.wiring.registerCallback('oois_in', function (data) {
            setObjectsOfInterest(JSON.parse(data));
        });

        MashupPlatform.wiring.registerCallback('ooi-types', function (data) {
            setObjectsOfInterestTypes(JSON.parse(data));
        });

        MashupPlatform.wiring.registerCallback('types', function (data) {
            var ooiTypes = JSON.parse(data);
            types = { };
            for (var i = 0; i < ooiTypes.length; i++) {
                var ooiType = ooiTypes[i];
                types[ooiType.entityTypeId] = ooiType;
            }
        });
    }
});
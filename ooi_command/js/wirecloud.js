/*global entityTypes,objectsOfInterest,pendingCommand,MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
        var logFunction = function(event, data) { console.log(data); };

        $('body')
            .on('command', logFunction)
            .on('areaCreated', logFunction);
    } else {
        MashupPlatform.wiring.registerCallback('oois_in', function (data) {
            setObjectsOfInterest(JSON.parse(data));
        });

        MashupPlatform.wiring.registerCallback('ooi-types_in', function (data) {
            setObjectsOfInterestTypes(JSON.parse(data));
        });

        MashupPlatform.wiring.registerCallback('point_in', function (data) {
            executePendingWith(JSON.parse(data), { failSilently: true });
        });

        $('body')
            .on('command', function (event, data) {
                MashupPlatform.wiring.pushEvent('commands', JSON.stringify(data));
            })
            .on('areaCreated', function (event, data) {
                MashupPlatform.wiring.pushEvent('areas_created_out', JSON.stringify(data));
            });
    }
});

function getObjectsOfInterestAsArray() {
    var array = [ ];
    for (var ooiType in objectsOfInterest)
        array = array.concat(objectsOfInterest[ooiType]);
    return array;
}
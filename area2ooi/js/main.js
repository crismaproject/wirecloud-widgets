/*global MashupPlatform*/

MashupPlatform.wiring.registerCallback('areas_in', function (data) {
    var areas = JSON.parse(data);
    if (typeof areas == 'object')
        areas = [ areas ];
    var oois = areas.map(area2ooi);

    MashupPlatform.wiring.pushEvent('oois_out', JSON.stringify(oois));
});

function area2ooi(area) {
    return {
        'entityId': area.entityId,
        'entityTypeId': area.entityTypeId || 14,
        'entityName': area.entityName || 'Area'
    }
}
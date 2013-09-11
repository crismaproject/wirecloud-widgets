/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof ooiViewer === 'undefined') {
        console.warn('"ooiViewer" variable is not defined.')
    } else {
        MashupPlatform.wiring.registerCallback('worldstate', function (data) {
            worldstateId = data;
            attemptUpdate();
        });

        MashupPlatform.wiring.registerCallback('entity', function (data) {
            entityId = data;
            attemptUpdate();
        });
    }

    $.get(window.ooi_wsr_uri + '/EntityType', function (entityData) {
        for (var i = 0; i < entityData.length; i++) {
            var cur = entityData[i];
            entityTypes[cur.entityTypeId] = {
                name: entityData[i].entityTypeName.trim(),
                description: entityData[i].entityTypeDescription.trim(),
                properties: {}
            };
        }

        $.get(window.ooi_wsr_uri + '/EntityTypeProperty', function (propertyData) {
            for (var i = 0; i < propertyData.length; i++) {
                var cur = propertyData[i];
                var entityId = cur.entityTypeId;
                if (typeof entityTypes[entityId] !== 'undefined')
                    entityTypes[entityId].properties[cur.entityTypePropertyId] = {
                        name: cur.entityTypePropertyName.trim(),
                        description: cur.entityTypePropertyDescription.trim()
                    };
            }
        }, 'json');
    }, 'json');
});
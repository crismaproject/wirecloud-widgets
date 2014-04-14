var availableCommands = {
    '*': {
        'treat': {
            displayName: 'Create treatment area',
            targetType: 'point',
            spawnArea: {
                entityName: 'Treatment area',
                entityTypeId: 14
            },
            log: 'Treatment area created'
        }
    },
    7: {
        'treat': {
            displayName: 'Treat',
            targetType: 'point',
            log: 'Treating patients near lat. #{data.lat}, long. #{data.lon}'
        }

        ,'$isAvailable': function (ambulance) {
            var properties = ambulance.entityInstancesProperties;
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                if (property.entityTypePropertyId == 312) // 31 = Target arrival time
                    return property.entityPropertyValue !== 0 && property.entityPropertyValue !== '0';
            }
            return true;
        }
    },
    14: {
        'goto': {
            displayName: 'Set target',
            targetType: 'ooi',
            targetRestrictedTo: 14,
            log: 'Treated patients will be moved to #{data.entityName}'
        }
    }
};
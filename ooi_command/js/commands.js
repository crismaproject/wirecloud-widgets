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
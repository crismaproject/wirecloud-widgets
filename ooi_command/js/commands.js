var availableCommands = {
    '*': {
        'treat': {
            displayName: 'Create treatment area',
            targetType: 'point',
            spawnArea: {
                entityName: 'Treatment area',
                entityTypeId: 14
            }
        }
    },
    7: {
        'treat': {
            displayName: 'Treat',
            targetType: 'point'
        }
    },
    14: {
        'goto': {
            displayName: 'Set target',
            targetType: 'ooi',
            targetRestrictedTo: 14
        }
    }
};
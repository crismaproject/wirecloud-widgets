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
        },
        'test': {
            displayName: 'Test',
            targetType: 'point',
            setProperties: {
                destination: '#{data[0]}, #{data[1]}'
            }
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
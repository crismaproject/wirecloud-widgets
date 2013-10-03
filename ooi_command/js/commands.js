var availableCommands = {
    '*': {
        'createTreatmentArea': {
            displayName: 'Create treatment area',
            targetType: 'point',
            spawnArea: {
                entityName: 'Treatment area',
                entityTypeId: 14
            }
        },
        'createDeconArea': {
            displayName: 'Create decontamination area',
            targetType: 'point',
            spawnArea: {
                entityName: 'Decontamination area',
                entityTypeId: 14
            }
        }
    },
    7: {
        'hi': { // only exists for testing purposes. Makes little sense otherwise
            displayName: 'Hello world'
        },
        'treat': {
            displayName: 'Treat',
            targetType: 'point'
        }
    }
};
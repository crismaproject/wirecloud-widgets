var availableCommands = {
    '*': {
        'createStagingArea': {
            displayName: 'Create staging area',
            targetType: 'point',
            spawnArea: 'staging'
        },
        'createDeconArea': {
            displayName: 'Create decontamination area',
            targetType: 'point',
            spawnArea: 'decontamination'
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
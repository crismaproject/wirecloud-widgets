angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'treat',
            css: 'ico-cmd-treat',
            displayName: 'Create treatment area',
            help: 'This will create a new area in which patients can be treated.',
            targetType: 'point',
            spawnArea: {
                entityName: 'Treatment area',
                entityTypeId: 14
            },
            log: 'Create treatment area'
        },
        {
            id: 'treat',
            css: 'ico-cmd-treat',
            entityTypeId: 7,
            displayName: 'Treat',
            help: 'This command orders an ambulance to a specified location to treat or pick-up patients.',
            targetType: 'point',
            log: 'Treating patients near lat. #{data.lat}, long. #{data.lon}',
            isAvailable: function (ambulance) {
                var properties = ambulance.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // Check target availability time; 0 = now, >0 = later, <0 = never
                    if (property.entityTypePropertyId == 312)
                        return property.entityPropertyValue !== 0 && property.entityPropertyValue !== '0';
                }
                return true;
            }
        },
        {
            id: 'goto',
            css: 'ico-cmd-goto',
            entityTypeId: 14,
            displayName: 'Set target',
            help: 'This command will set where patients within this zone should be moved to next.',
            targetType: 'ooi',
            targetRestrictedTo: 14,
            log: 'Treating patients will be moved to #{data.entityName}'
        }
    ]);
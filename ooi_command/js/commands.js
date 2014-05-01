angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        /*{
            id: 'create-evac',
            css: 'ico-cmd-evac',
            displayName: 'Create evacuation zone',
            help: 'This will create a new area designated to evacuate people.',
            targetType: 'point',
            spawnArea: {
                entityName: 'Evacuation zone',
                entityTypeId: 14
            },
            log: 'Create evacuation zone near lat. #{data.lat}, long. #{data.lon}'
        },
        {
            id: 'create-decontamination',
            css: 'ico-cmd-decontamination',
            displayName: 'Create decontamination zone',
            help: 'This will create a new area designated to decontamination.',
            targetType: 'point',
            spawnArea: {
                entityName: 'Decontamination zone',
                entityTypeId: 14
            },
            log: 'Create decontamination zone near lat. #{data.lat}, long. #{data.lon}'
        },*/
        {
            id: 'pickup',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Pick up',
            help: 'This command orders an ambulance to pick up patients around the specified location.',
            targetType: 'ooi',
            targetRestrictedTo: 14,
            log: 'Retrieve patients from an area.',
            isAvailable: function (ambulance) {
                var properties = ambulance.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // Check target availability time; 0 = now, >0 = later, <0 = never
                    if (property.entityTypePropertyId == 312)
                        return property.entityPropertyValue !== 0 && property.entityPropertyValue !== '0';
                }
                return true;
            },
            setProperties: {
                314: '#{data.entityId}'
            }
        },
        {
            id: 'dispatch',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Dispatch to hospital',
            help: 'This command orders an ambulance to bring patients to the specified hospital.',
            targetType: 'ooi',
            targetRestrictedTo: 9,
            log: 'Bring patients to the hospital.',
            isAvailable: function (ambulance) {
                var properties = ambulance.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // Check target availability time; 0 = now, >0 = later, <0 = never
                    if (property.entityTypePropertyId == 312)
                        return property.entityPropertyValue !== 0 && property.entityPropertyValue !== '0';
                }
                return true;
            },
            setProperties: {
                315: '#{data.entityId}'
            }
        }
    ]);
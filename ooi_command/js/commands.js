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
            isTargetAllowed: function (data) {
                return true; // TODO: requires pick-up area
            },
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
            displayName: 'Dispatch Ambulances',
            help: 'This command orders an ambulance to collect Patients from a Pickup-Area and transfer them to the specified hospital.',
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
            apply: function(command, data, ooi, allOOIs) {
                command.setProperties = $.extend({}, command.setProperties, {
                    315: data.entityId,
                    314: allOOIs[0] // FIXME: should be pickup-area
                });
            }
        }
    ]);

function findFirstEntityOfType(oois, typeId) {
    for (var i = 0; i < oois.length; i++)
        if (oois[i].entityTypeId == typeId)
            return oois[i]
    return null;
}
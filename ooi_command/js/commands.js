angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'create-pickup',
            css: 'ico-cmd-pickup',
            displayName: 'Create pickup area',
            help: 'This will create a new area designated to pick up people.',
            targetType: 'point',
            spawnArea: {
                entityName: 'Pickup Area',
                entityTypeId: 14,
                entityInstancesProperties: [
                    { entityTypePropertyId: 54, entityPropertyValue: 'Pickup-Area' }
                ]
            },
            log: 'Create pickup area near lat. #{data.lat}, long. #{data.lon}'
        },
        {
            id: 'pickup',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Pick up',
            help: 'This command orders an ambulance to pick up patients around the specified location.',
            targetType: 'ooi',
            targetRestrictedTo: 14,
            isTargetAllowed: function (data) {
                return data.entityInstancesProperties.indexOfWhere(function (p) {
                    return p.entityTypePropertyId == 54 && p.entityPropertyValue == 'Pickup-Area';
                }) != -1;
            },
            log: 'Retrieve patients from an area.',
            isAvailable: function (ambulance) {
                var properties = ambulance.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // Check target availability time; 0 = now, >0 = later, <0 = never
                    if (property.entityTypePropertyId == 312)
                        return property.entityPropertyValue == '0';
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
            help: 'This command orders an ambulance to transfer collected patients to the specified hospital.',
            targetType: 'ooi',
            targetRestrictedTo: 9,
            log: 'Bring patients to the hospital.',
            isAvailable: function (ambulance) {
                var properties = ambulance.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // Check target availability time; 0 = now, >0 = later, <0 = never
                    if (property.entityTypePropertyId == 312)
                        return property.entityPropertyValue == '0';
                }
                return true;
            },
            apply: function(command, data, ooi, allOOIs) {
                var i = allOOIs.indexOfWhere(function (o) {
                    return o.entityTypeId == 14 && o.entityInstancesProperties.length &&
                        o.entityInstancesProperties.indexOfWhere(function (p) {
                            return p.entityTypePropertyId == 54 && p.entityPropertyValue == 'Pickup-Area';
                        }) != -1});

                if (i == -1) return null;

                command.setProperties = $.extend({}, command.setProperties, {
                    315: data.entityId,
                    314: allOOIs[i]
                });

                return command;
            }
        }
    ]);
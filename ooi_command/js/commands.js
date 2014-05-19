angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'move-pickup',
            css: 'ico-cmd-pickup',
            entityTypeId: 14,
            displayName: 'Move pickup area',
            help: 'This will move the pickup area to a new location.',
            targetType: 'point',
            log: 'Move pickup area to lat. #{data.lat}, long. #{data.lon}',
            isAvailable: function (area) {
                var properties = area.entityInstancesProperties;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    // prop. #54 = Area-Category
                    if (property.entityTypePropertyId == 54)
                        return property.entityPropertyValue == 'Pickup-Area';
                }
                return true;
            },
            setGeometry: {
                lat: '#{data.lat}',
                lon: '#{data.lon}'
            }
        },

        {
            id: 'dispatch',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Dispatch Ambulances',
            help: 'This command orders an ambulance to collect Patients from Pickup-Area and transfer them to the specified hospital.',
            arguments: [
                {
                    targetType: 'ooi',
                    targetRestrictedTo: 9,
                    displayName: 'Hospital'
                }, {
                    targetType: 'ooi',
                    targetRestrictedTo: 14,
                    displayName: 'Pickup Area',
                    isTargetAllowed: function (area) {
                        return area.entityInstancesProperties.length &&
                            area.entityInstancesProperties.indexOfWhere(function (p) {
                                return p.entityTypePropertyId == 54 && p.entityPropertyValue == 'Pickup-Area';
                            }) != -1;
                    }
                }
            ],
            log: 'Bring patients from #{data[1].entityName} to #{data[0].entityName}.',
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
            apply: function(command, data) {
                command.setProperties = $.extend({}, command.setProperties, {
                    315: data[0].entityId,
                    314: data[1].entityId
                });

                return command;
            }
        }
    ]);
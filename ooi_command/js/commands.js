angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'move-pickup',
            css: 'ico-cmd-move',
            entityTypeId: 14,
            displayName: 'Move treatment area',
            help: 'This will move the treatment area to a new location.',
            log: 'Move treatment area to lat. #{data.lat}, long. #{data.lon}',
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
            arguments: [
                {
                    displayName: 'New location',
                    targetType: 'point'
                }
            ],
            setGeometry: {
                lat: '#{data.lat}',
                lon: '#{data.lon}'
            }
        },

        {
            id: 'dispatch',
            css: 'ico-cmd-treat',
            entityTypeId: 7,
            displayName: 'Dispatch Ambulances',
            help: 'This command orders an ambulance to treat patients at a treatment area.',
            arguments: [
                {
                    targetType: 'ooi',
                    targetRestrictedTo: 14,
                    displayName: 'Treatment Area',
                    isTargetAllowed: function (area) {
                        return area.entityInstancesProperties.length &&
                            area.entityInstancesProperties.indexOfWhere(function (p) {
                                return p.entityTypePropertyId == 54 && p.entityPropertyValue == 'Pickup-Area';
                            }) != -1;
                    }
                }
            ],
            log: 'Treat patients at #{data[0].entityName}.',
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
                    315: '',
                    314: data[0].entityId
                });

                return command;
            }
        },

        {
            id: 'evac',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Evacuate patients',
            help: 'This command orders an ambulance to evacuate patients from a treatment area and bring them to a specified hospital.',
            arguments: [
                {
                    targetType: 'ooi',
                    targetRestrictedTo: 14,
                    displayName: 'Pick up at'
                },
                {
                    targetType: 'ooi',
                    targetRestrictedTo: 9,
                    displayName: 'Evacuate to'
                }
            ],
            log: 'Evacuate patients from #{data[0].entityName} and bring them to #{data[1].entityName}.',
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
                    315: data[1].entityId,
                    314: data[0].entityId
                });

                return command;
            }
        }
    ]);
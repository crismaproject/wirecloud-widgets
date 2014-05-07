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
        /*{
            id: 'pickup',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Select Pick-up Area Location',
            help: 'This command orders an ambulance to collect Patients form Pickup-Area and transfer them to  the specified hospital.',
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
        },*/

        {
            id: 'dispatch',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Dispatch Ambulances',
            help: 'This command orders an ambulance to collect Patients from Pickup-Area and transfer them to the specified hospital.',
            targetType: 'ooi',
            targetRestrictedTo: 9,
            log: 'Bring patients to #{data.entityName}.',
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

                if (i == -1)
                    i = allOOIs.indexOfWhere(function (o) {
                        return o.entityTypeId == 14;
                    });

                if (i == -1) return null;

                command.setProperties = $.extend({}, command.setProperties, {
                    315: data.entityId,
                    314: allOOIs[i].entityId
                });

                return command;
            }
        }
    ]);
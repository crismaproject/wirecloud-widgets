angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'v2-dispatch',
            css: 'ico-cmd-move',
            displayName: 'Dispatch',
            help: 'Dispatch vehicles to the selected Area',
            log: 'Dispatching #{data[0].entityName} to #{data[1].entityName}',

            entityTypeId: 7,

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Area', targetType: 'ooi', targetRestrictedTo: 14 }
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Dispatch',
                        'Command-From-OOI-Identifier': '',
                        'Command-To-OOI-Identifier': data[1].entityId,
                        'Command-Parameters': ''
                    })
                };

                return command;
            }
        },

        {
            id: 'v2-rescue',
            css: 'ico-cmd-move',
            displayName: 'Rescue',
            help: 'Dispatch vehicle in order to rescue Patients from the one area to another within the incident area',
            log: 'Rescue patients from #{data[1].entityName} to #{data[2].entityName} using #{data[0].entityName}',

            entityTypeId: 7,

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Rescue from', targetType: 'ooi', targetRestrictedTo: 14 }, // TODO: needs to be of area type INCIDENT
                { displayName: 'Rescue to', targetType: 'ooi', targetRestrictedTo: 14 },
                { displayName: 'Automatic evac', targetType: 'option', options: [ 'No', 'Yes' ]},
                { displayName: 'Automatic evac to', targetType: 'ooi', targetRestrictedTo: 8 },
                { displayName: 'Repeat', targetType: 'option', options: [ 'No', 'Yes' ]},
                { displayName: 'Delay upon arrival (sec)', targetType: 'number', minimum: 0, maximum: 5400 }
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Rescue',
                        'Command-To-OOI-Identifier': data[2].entityId,
                        'Command-From-OOI-Identifier': data[1].entityId,
                        'Command-Parameters': {
                            'Auto-Evacuate': data[3],
                            'Auto-Evacuate-OOI-Identifier': data[4] ? data[4].entityId : '',
                            'Delay-Upon-Arrival': data[6],
                            'Repeat-Command': data[5]
                        }
                    })
                };

                return command;
            }
        },

        {
            id: 'v2-treat',
            css: 'ico-cmd-move',
            displayName: 'Treat',
            help: 'Dispatch vehicle in order to treat patients at the specified Treatment-Area',
            log: 'Treating patients at #{data[1].entityName} using #{data[0].entityName}',

            entityTypeId: 7,

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Treat at', targetType: 'ooi', targetRestrictedTo: 14 },
                { displayName: 'Automatic evac', targetType: 'option', options: [ 'No', 'Yes' ]},
                { displayName: 'Repeat', targetType: 'option', options: [ 'No', 'Yes' ]},
                { displayName: 'Pre-Triage', targetType: 'option', options: [ 'No', 'Yes' ]},
                { displayName: 'Triage', targetType: 'option', options: [ 'No', 'Yes' ]}
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Treat',
                        'Command-From-OOI-Identifier': '',
                        'Command-To-OOI-Identifier': data[1].entityId,
                        'Command-Parameters': {
                            'Auto-Evacuate': data[2],
                            'Auto-Evacuate-OOI-Identifier': '',
                            'Repeat-Command': data[3],
                            'Perform-Pre-Triage': data[4],
                            'Perform-Triage': data[5]
                        }
                    })
                };

                return command;
            }
        },

        {
            id: 'v2-evacuate',
            css: 'ico-cmd-move',
            displayName: 'Evacuate',
            help: 'Evacuate patients from Treatment-Area or danger zone or advanced medical post to Hospital',
            log: 'Evacuate patients from Treatment-Area or danger zone or advanced medical post to Hospital',

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Evacuate from', targetType: 'ooi', isTargetAllowed: function (ooi) {
                    return ooi.entityTypeId == 11 || ooi.entityTypeId == 14;
                } },
                { displayName: 'Evacuate to', targetType: 'ooi', targetRestrictedTo: 8},
                { displayName: 'Repeat', targetType: 'option', options: [ 'No', 'Yes' ]}
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Evacuate',
                        'Command-From-OOI-Identifier': data[1].entityId,
                        'Command-To-OOI-Identifier': data[2].entityId,
                        'Command-Parameters': {
                            'Repeat-Command': data[3]
                        }
                    })
                };

                return command;
            }
        },

        {
            id: 'v2-refill',
            css: 'ico-cmd-move',
            displayName: 'Refill',
            help: 'Command resource vehicle to refill its resources',
            log: 'Command resource vehicle to refill its resources',

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Refill at', targetType: 'ooi', targetRestrictedTo: 8}
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Refill',
                        'Command-From-OOI-Identifier': '',
                        'Command-To-OOI-Identifier': data[1].entityId,
                        'Command-Parameters': ''
                    })
                };

                return command;
            }
        },

        {
            id: 'v2-build-area',
            css: 'ico-cmd-move',
            displayName: 'Build Area',
            help: 'Builds a specific area type at a specified location consuming time and resources (human resources, equipment, vehicles)',
            log: 'Area will be built at the specified location',

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7 },
                { displayName: 'Area', targetType: 'ooi', targetRestrictedTo: 14},
                { displayName: 'Area location', targetType: 'point' }
            ],

            apply: function (command, data) {
                command.affected = [ data[0] ];
                command.setGeometry = data[2]; // TODO: verify correctness
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'BuildArea',
                        'Command-From-OOI-Identifier': '',
                        'Command-To-OOI-Identifier': '',
                        'Command-Parameters': {
                            'Area-Identifier': data[1].entityId
                        }
                    })
                };

                return command;
            }
        }
    ]);
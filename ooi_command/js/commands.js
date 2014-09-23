angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'dispatch-from-station',
            css: 'ico-cmd-treat',
            entityTypeId: 8,
            displayName: 'Move ambulances',
            help: 'This will dispatch a number of ambulances to the scene to perform an action.',
            log: 'Move to lat. #{data.lat}, long. #{data.lon}',

            arguments: [
                {
                    displayName: 'How many',
                    targetType: 'number'
                },
                {
                    displayName: 'From',
                    targetType: 'option',
                    options: [ 'Expel from station', 'Closest to scene' ]
                },
                {
                    displayName: 'Send to',
                    targetType: 'point',
                    targetRestrictedTo: 14
                },
                {
                    displayName: 'Then',
                    targetType: 'option',
                    options: [ 'Do nothing', 'Rescue', 'Treat', 'Transport', 'Refill' ]
                }
            ]
        },

        {
            id: 'dispatch-amb',
            css: 'ico-cmd-treat',
            entityTypeId: 7,
            displayName: 'Move ambulance',
            help: 'This will dispatch the selected ambulance(s) to the scene to perform an action.',
            log: 'Move to lat. #{data.lat}, long. #{data.lon}',

            arguments: [
                {
                    displayName: 'Send to',
                    targetType: 'ooi',
                    targetRestrictedTo: 14
                },
                {
                    displayName: 'Then',
                    targetType: 'option',
                    options: [ 'Do nothing', 'Rescue', 'Treat', 'Transport', 'Refill' ]
                }
            ]
        },

        {
            id: 'cancel',
            css: 'ico-cmd-goto',
            entityTypeId: 7,
            displayName: 'Return',
            help: 'Return to the station immediately.',
            log: 'Return to station'
        }
    ]);
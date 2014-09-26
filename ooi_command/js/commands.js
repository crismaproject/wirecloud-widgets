angular.module('ooiCommand.commands', [])
    .constant('availableCommands', [
        {
            id: 'dispatch-from-station',
            css: 'ico-cmd-treat',
            displayName: 'Move ambulances',
            help: 'This will dispatch a number of ambulances to the scene to perform an action.',
            log: 'Dispatching #{data[1]} from #{data[1]} to #{data[2]}, then #{data[3]}',

            arguments: [
                {
                    displayName: 'From',
                    targetType: 'option',
                    options: [ 'Closest to scene' ],
                    getOptions: function (oois) {
                        return [ 'Closest to scene' ]
                            .concat(oois
                                .filter(function (x) { return x.entityTypeId == 8 })
                                .map(function (x) { return x.entityName })
                        );
                    }
                },
                {
                    displayName: 'How many',
                    targetType: 'number'
                },
                {
                    displayName: 'Send to',
                    targetType: 'ooi',
                    targetRestrictedTo: 14
                },
                {
                    displayName: 'Then',
                    targetType: 'option',
                    options: [ 'do nothing', 'rescue', 'treat' ]
                }
            ]
        }
    ]);
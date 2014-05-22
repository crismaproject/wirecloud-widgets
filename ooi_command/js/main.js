angular.module('ooiCommand', ['ooiCommand.wirecloud', 'ooiCommand.commands'])
    .controller('OoiCommandCtrl', ['$scope', '$timeout', 'wirecloud', 'availableCommands', function($scope, $timeout, wirecloud, availableCommands) {
        $scope.oois = [];
        $scope.allObjects = [];
        $scope.ooiTypes = { };
        $scope.commandableEntityTypes = [];
        $scope.availableCommands = availableCommands;
        $scope.pendingCommand = null;
        $scope.mouseOverCommand = null;
        $scope.areaSequenceId = 1;

        $scope.prettyOOIType = function(entityTypeId) {
            return $scope.ooiTypes.hasOwnProperty(entityTypeId) ? $scope.ooiTypes[entityTypeId].entityTypeName : 'Type #' + entityTypeId;
        };

        $scope.prettyOOI = function(entity) {
            return entity.hasOwnProperty('entityName') ? entity.entityName : 'Entity #' + entity.entityId;
        };

        $scope.isCommandableEntity = function(ooi) {
            return $scope.commandableEntityTypes.indexOf(ooi.entityTypeId) != -1;
        };

        $scope.showCommand = function(command) {
            if (!command.hasOwnProperty('entityTypeId'))
                return true;
            for (var i = 0; i < $scope.oois.length; i++)
                if($scope.oois[i].entityTypeId == command.entityTypeId)
                    return true;
            return false;
        };

        $scope.showHelpFor = function(command) {
            $scope.mouseOverCommand = command;
        };

        $scope.acceptsArgument = function(argumentSpec, argument) {
            var accept = true;
            if (argumentSpec.targetType == 'ooi') {
                accept =
                    (!argumentSpec.hasOwnProperty('targetRestrictedTo') || argument.entityTypeId == argumentSpec.targetRestrictedTo) &&
                    (!argumentSpec.hasOwnProperty('isTargetAllowed') || argumentSpec.isTargetAllowed(argument));
            }

            return accept;
        };

        $scope.activateCommand = function(command) {
            $scope.pendingCommand = $.extend(true, {
                candidates: [],
                data: command.arguments.map(function(x) {
                    switch(x.targetType) {
                        case 'point':
                            return { lat:0, lon:0 };
                        default:
                            return null;
                    }
                })
            }, command);

            if (!command.hasOwnProperty('arguments') || !command.arguments.length)
                $scope.executePendingCommand();
            else
                for (var i = 0; i < $scope.pendingCommand.arguments.length; i++)
                    $scope.pendingCommand.candidates[i] = $scope.allObjects.filter(function (x) {
                        return $scope.acceptsArgument($scope.pendingCommand.arguments[i], x);
                    });
        };

        $scope.cancelCommand = function() {
            $scope.pendingCommand = null;
        };

        $scope.canExecutePendingCommand = function() {
            if (!$scope.pendingCommand) return false;
            for (var i = 0; i < $scope.pendingCommand.data.length; i++)
                if (!$scope.pendingCommand.data[i]) return false;
            return true;
        };

        $scope.executePendingCommand = function() {
            var command = $scope.pendingCommand;
            var data = $scope.pendingCommand.data;
            var oois = command.hasOwnProperty('entityTypeId') ? $scope.oois.filter(function (ooi) {
                return ooi.entityTypeId == command.entityTypeId &&
                    (!command.hasOwnProperty('isAvailable') || command.isAvailable(ooi));
            }) : [];

            var inject = function(root, key) {
                if (root.hasOwnProperty(key))
                    root[key] = root[key].replace(/#\{(data(\.[a-zA-Z0-9_]+|\[[0-9]+\])*)\}/g, function (x,y) {
                        // TODO: evaluate potential security concerns. eval is usually bad. but it gets the job done.
                        try {
                            return eval(y);
                        } catch (e) {
                            console.error({
                                message: 'Failed to properly inject data into the current pending command',
                                command: $scope.pendingCommand,
                                key: key,
                                key_in: root
                            });
                        }
                    });
                return root;
            };

            if (command.hasOwnProperty('setProperties'))
                for (var key in command.setProperties)
                    inject(command.setProperties, key);
            if (command.hasOwnProperty('setGeometry'))
                for (var key in command.setGeometry)
                    inject(command.setGeometry, key);
            if (command.hasOwnProperty('log'))
                inject(command, 'log');
            if (command.hasOwnProperty('apply'))
                for (var i = 0; i < oois.length; i++) {
                    command = command.apply(command, data, oois[i], $scope.allObjects);
                    if (!command) {
                        console.log(['Command cancellation requested by command.apply()', command]);
                        return;
                    }
                }
            if (command.hasOwnProperty('spawnArea')) {
                var area = $.extend(true, {
                    'entityId': -($scope.areaSequenceId++),
                    'entityTypeId': 14,
                    'entityInstancesGeometry': [
                        { 'geometry': {'geometry': {'coordinateSystemId': 4326, 'wellKnownText': 'POINT(' + data.lat + ' ' + data.lon + ')'}}}
                    ]
                }, (command.spawnArea));
                command.createOOI = area;
                wirecloud.send('areasCreated', [area]);
            }

            oois = oois.map(function (ooi) {
                return ooi.hasOwnProperty('entityId') ? ooi.entityId : ooi;
            });

            var commandObj = {
                affected: oois,
                command: {
                    id: command.id,
                    log: command.log,
                    setGeometry: command.setGeometry,
                    setProperties: command.setProperties,
                    spawnArea: command.spawnArea
                },
                data: data
            };

            delete commandObj.command.data;
            delete commandObj.command.candidates;

            wirecloud.send('command', commandObj);
            $scope.pendingCommand = null;
        };

        /****************************************************************
         * INTERNAL HOUSEKEEPING                                        *
         ****************************************************************/
        $scope.$watchCollection('availableCommands', function(commands) {
            var commandable = { };
            for (var i = 0; i < commands.length; i++)
                if (commands[i].hasOwnProperty('entityTypeId'))
                    commandable[commands[i].entityTypeId] = true;
            $scope.commandableEntityTypes = [ ];
            for (var c in commandable)
                $scope.commandableEntityTypes.push(parseInt(c));
        });

        /****************************************************************
         * WIRECLOUD BINDINGS                                           *
         ****************************************************************/
        wirecloud.on('oois', function(oois) {
            oois = JSON.parse(oois);

            var added = oois.filter(function (x) { return $scope.oois.indexOfWhere(function (y) { return y.entityId == x.entityId; })== -1 });
            var removed = $scope.oois.filter(function (x) { return oois.indexOfWhere(function (y) { return y.entityId == x.entityId; }) == -1 });

            $scope.oois = oois;

            if (added.length)
                itemsAdded(added);
            if (removed.length)
                itemsRemoved(removed);

            $scope.$apply();
        });

        wirecloud.on('oois_all', function(oois) {
            $scope.allObjects = JSON.parse(oois);
            $scope.$apply();
        });

        wirecloud.on('ooiTypes', function(ooiTypes) {
            $scope.ooiTypes = JSON.parse(ooiTypes).toDict('entityTypeId');
            $scope.$apply();
        });

        wirecloud.on('point', function(data) {
            if (!$scope.pendingCommand) return;

            data = typeof data === 'string' ? JSON.parse(data) : data;
            if ($scope.pendingCommand.targetType === 'point')
                $scope.executePendingCommandWith(data);
            else if ($scope.pendingCommand.targetType === 'ooi' && data.hasOwnProperty('ooi') &&
                (!$scope.pendingCommand.hasOwnProperty('isTargetAllowed') || $scope.pendingCommand.isTargetAllowed(data.ooi)) &&
                (!$scope.pendingCommand.hasOwnProperty('targetRestrictedTo') || $scope.pendingCommand.targetRestrictedTo == data.ooi.entityTypeId))
                $scope.executePendingCommandWith(data.ooi);
        });

        /****************************************************************
         * BROWSER EVENT BINDINGS                                       *
         ****************************************************************/
        $(document).keyup(function (eventData) {
            // Cancel any pending commands when the ESC key is captured
            if ($scope.pendingCommand && eventData.keyCode == 27)
                $scope.$apply($scope.cancelCommand);
        });


        function itemsAdded(oois) {
            if (!oois || !oois.length) return;

            /* Iff new OOIs have been selected and there's a command pending, try to assign newly selected OOIs to
             * any data slots that still require a value. The assumption here is that the user selected the OOI with
             * the intent to fill a slot.
             */
            if ($scope.pendingCommand) {
                var commandArgumentCount = $scope.pendingCommand.arguments.length;
                for (var i = 0; i < commandArgumentCount; i++)
                    if (!$scope.pendingCommand.data[i]) // argument slot for pending command is still unset
                        for (var j = 0; j < oois.length; j++) {
                            if ($scope.acceptsArgument($scope.pendingCommand.arguments[i], oois[j])) {
                                var index = $scope.pendingCommand.candidates[i].indexOfWhere(function (x) { return x.entityId == oois[j].entityId; });
                                if (index != -1) {
                                    $scope.pendingCommand.data[i] = $scope.pendingCommand.candidates[i][index];
                                    break;
                                }
                            }
                        }
            }
        }

        function itemsRemoved(oois) {
        }
    }]);
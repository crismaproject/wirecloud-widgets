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
        $scope.awaitingGeometryForArgument = -1;
        $scope.useSlimCommands = wirecloud.getPreference('useSlimCommands', false);

        $scope.prettyOOIType = function(entityTypeId) {
            return $scope.ooiTypes.hasOwnProperty(entityTypeId) ? $scope.ooiTypes[entityTypeId].entityTypeName : 'Type #' + entityTypeId;
        };

        $scope.prettyOOI = function(entity) {
            return entity.hasOwnProperty('entityName') ? entity.entityName : 'Entity #' + entity.entityId;
        };

        $scope.isCommandableEntity = function(ooi) {
            return $scope.commandableEntityTypes.indexOf(ooi.entityTypeId) != -1;
        };

        $scope.showHelpFor = function(command) {
            $scope.mouseOverCommand = command;
        };

        $scope.acceptsArgument = function(argumentSpec, argument) {
            var accept = true;
            if (argumentSpec.targetType == 'ooi' || argumentSpec.targetType == 'point') {
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
                    if (x.hasOwnProperty('defaultValue'))
                        return x['defaultValue'];
                    else
                        switch(x.targetType) {
                            case 'point':
                                return { lat:0, lon:0 };
                            case 'number':
                                return 1;
                            case 'option':
                                if (x.hasOwnProperty('getOptions') && typeof(x.getOptions) === 'function')
                                    x.options = x.getOptions($scope.allObjects);
                                return x.hasOwnProperty('options') && x.options.length > 0 ? x.options[0] : null;
                            default:
                                return null;
                        }
                })
            }, command);

            $scope.assignCommandArguments();
        };

        $scope.assignCommandArguments = function() {
            if (!$scope.pendingCommand || !$scope.pendingCommand.hasOwnProperty('arguments')) return;

            for (var i = 0; i < $scope.pendingCommand.arguments.length; i++) {
                if ($scope.pendingCommand.data[i]) continue;

                var argument = $scope.pendingCommand.arguments[i];
                if (argument.targetType == 'ooi') {
                    $scope.pendingCommand.candidates[i] = $scope.allObjects.filter(function (x) {
                        return $scope.acceptsArgument(argument, x);
                    });
                    for (var j = 0; $scope.pendingCommand.data[i] == null && j < $scope.pendingCommand.candidates[i].length; j++) {
                        for (var k = 0; $scope.pendingCommand.data[i] == null && k < $scope.oois.length; k++) {
                            if ($scope.pendingCommand.candidates[i][j].entityId == $scope.oois[k].entityId)
                                $scope.pendingCommand.data[i] = $scope.pendingCommand.candidates[i][j];
                        }
                    }
                } else if (argument.targetType == 'number') {
                    $scope.pendingCommand.minimum = $scope.getInt(argument.minimum, 1);
                    $scope.pendingCommand.maximum = $scope.getInt(argument.maximum);
                }
            }
        };

        $scope.cancelCommand = function() {
            $scope.pendingCommand = null;
        };

        $scope.canExecutePendingCommand = function() {
            if (!$scope.pendingCommand) return false;
            if ($scope.pendingCommand.hasOwnProperty('validate') && !$scope.pendingCommand.validate($scope.pendingCommand.data))
                return false;
            for (var i = 0; i < $scope.pendingCommand.data.length; i++)
                if (!$scope.pendingCommand.arguments[i].hasOwnProperty('optional') &&
                    ($scope.pendingCommand.data[i] === '' || $scope.pendingCommand.data[i] === null)) return false;
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
                if (!(command = command.apply(command, data, oois, $scope.allObjects))) {
                    console.log('Command cancellation requested by command.apply()');
                    return;
                }

            oois = oois.map(function (ooi) {
                return ooi.hasOwnProperty('entityId') ? ooi.entityId : ooi;
            });

            var commandObj = {
                affected: shallowMap(command.hasOwnProperty('affected') ? command.affected : oois, 'entityId'),
                command: {
                    id: command.id,
                    log: command.log,
                    setGeometry: command.setGeometry,
                    setProperties: command.setProperties
                },
                data: $scope.useSlimCommands ? null : data
            };

            wirecloud.send('command', commandObj);
            $scope.pendingCommand = null;
        };

        $scope.getInt = function (value, fallback) {
            return typeof value === 'function' ? value($scope.allObjects) : value ? value : fallback;
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
            for (var i = 0; i < $scope.pendingCommand.arguments.length; i++)
                if ($scope.pendingCommand.arguments[i].targetType == 'point') {
                    $scope.pendingCommand.data[i] = {lat: data.lat, lon: data.lon};
                    $scope.$apply();
                    break;
                }
        });

        wirecloud.on('geometry', function(data) {
            if (!$scope.pendingCommand || $scope.awaitingGeometryForArgument == -1) return;

            for (var i = 0; i < $scope.pendingCommand.arguments.length; i++)
                if ($scope.pendingCommand.arguments[i].targetType == 'geometry') {
                    $scope.pendingCommand.data[i] = data;
                    $scope.awaitingGeometryForArgument = -1;
                    $scope.$apply();
                    break;
                }
        });

        $scope.requestMapDraw = function(requestedForArgumentIndex) {
            wirecloud.send('mapmode', 'edit');
            $scope.awaitingGeometryForArgument = requestedForArgumentIndex;
        };

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
            $scope.assignCommandArguments();
        }

        function itemsRemoved(oois) {
        }

        /****************************************************************
         * HELPER FUNCTIONS                                             *
         ****************************************************************/
        function shallowMap(array, property) {
            if (array == null || !$.isArray(array)) return array;
            for (var i = 0; i < array.length; i++)
                if (array[i].hasOwnProperty(property))
                    array[i] = array[i][property];
            return array;
        }
    }]);
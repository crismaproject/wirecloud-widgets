angular.module('ooiCommand', ['ooiCommand.wirecloud', 'ooiCommand.commands'])
    .controller('OoiCommandCtrl', ['$scope', '$timeout', 'wirecloud', 'availableCommands', function($scope, $timeout, wirecloud, availableCommands) {
        $scope.oois = [];
        $scope.allObjects = [];
        $scope.ooiTypes = { };
        $scope.commandableEntityTypes = [];
        $scope.possibleTargets = [];
        $scope.selectedPossibleTarget = { ooi: null };
        $scope.availableCommands = availableCommands;
        $scope.pendingCommand = null;
        $scope.mouseOverCommand = null;
        $scope.areaSequenceId = 1;

        $scope.$watch('selectedPossibleTarget', function(n, o) { console.log(['spt', n, o]) });
        $scope.$watch('possibleTargets', function(n, o) { console.log(['pt', n, o]) });

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

        $scope.activateCommand = function(command) {
            $scope.pendingCommand = $.extend(true, {}, command);

            if (!command.hasOwnProperty('targetType'))
                $scope.executePendingCommandWith(null);
            else {
                var targets = $scope.allObjects;
                if ($scope.pendingCommand.hasOwnProperty('targetRestrictedTo'))
                    targets = targets.filter(function (x) { return x.entityTypeId == $scope.pendingCommand.targetRestrictedTo });
                if ($scope.pendingCommand.hasOwnProperty('isTargetAllowed'))
                    targets = targets.filter($scope.pendingCommand.isTargetAllowed);
                $scope.possibleTargets = targets.slice();
            }
        };

        $scope.cancelCommand = function() {
            $scope.pendingCommand = null;
        };

        $scope.confirmPossibleTarget = function() {
            var data = $scope.selectedPossibleTarget.ooi;
            $timeout(function(){$scope.executePendingCommandWith(data);});
        };

        $scope.executePendingCommandWith = function(data) {
            var command = $scope.pendingCommand;
            var oois = command.hasOwnProperty('entityTypeId') ? $scope.oois.filter(function (ooi) {
                return ooi.entityTypeId == command.entityTypeId &&
                    (!command.hasOwnProperty('isAvailable') || command.isAvailable(ooi));
            }) : [];
            var inject = function(root, key) {
                if (root.hasOwnProperty(key))
                    root[key] = root[key].replace(/#\{((data|command)(\.[a-zA-Z0-9_]+|\[[0-9]+\])*)\}/g, function (x,y) {
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
                command: command,
                data: data
            };

            wirecloud.send('command', commandObj);
            $scope.pendingCommand = null;

            if ($scope.possibleTargets.length)
                $scope.possibleTargets = [];

            $scope.$apply();
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
            $scope.oois = JSON.parse(oois);
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
    }]);
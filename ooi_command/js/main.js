angular.module('ooiCommand', ['ooiCommand.wirecloud', 'ooiCommand.commands'])
    .controller('OoiCommandCtrl', ['$scope', 'wirecloud', 'availableCommands', function($scope, wirecloud, availableCommands) {
        $scope.oois = [];
        $scope.ooiTypes = { };
        $scope.commands = [];
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

        $scope.activateCommand = function(command) {
            $scope.pendingCommand = $.extend(true, {}, command);

            if (!command.hasOwnProperty('targetType'))
                $scope.executePendingCommandWith(null);
        };

        $scope.cancelCommand = function() {
            $scope.pendingCommand = null;
        };

        $scope.executePendingCommandWith = function(data) {
            var command = $scope.pendingCommand;
            var oois = !command.hasOwnProperty('entityTypeId') || $scope.oois.filter(function (ooi) {
                return ooi.entityTypeId == command.entityTypeId &&
                    (!command.hasOwnProperty('isAvailable') || command.isAvailable(ooi));
            });
            var inject = function(root, key) {
                if (root.hasOwnProperty(key))
                    root[key] = root[key].replace(/#\{((data|command)(\.[a-zA-Z0-9_]+|\[[0-9]+\])*)\}/g, function (x,y) {
                        // TODO: evaluate potential security concerns. eval is usually bad. but it gets the job done.
                        return eval(y);
                    });
                return root;
            };

            if (command.hasOwnProperty('setProperties'))
                for (var key in command.setProperties)
                    inject(command.setProperties, key);
            if (command.hasOwnProperty('log'))
                inject(command, 'log');
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

            var commandObj = {
                affected: oois,
                command: command,
                data: data
            };

            wirecloud.send('command', commandObj);
            $scope.commands.push(commandObj);
            $scope.pendingCommand = null;
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

        wirecloud.on('ooiTypes', function(ooiTypes) {
            $scope.ooiTypes = JSON.parse(ooiTypes).toDict('entityTypeId');
            $scope.$apply();
        });

        wirecloud.on('point', function(data) {
            if (!$scope.pendingCommand) return;

            data = typeof data === 'string' ? JSON.parse(data) : data;
            if ($scope.pendingCommand.targetType === 'point')
                $scope.executePendingCommandWith(data);
            else if ($scope.pendingCommand.targetType === 'ooi' && data.hasOwnProperty('ooi'))
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
angular
    .module('worldStateSaver', [
        'worldStateSaver.wirecloud',
        'worldStateSaver.icmm',
        'worldStateSaver.ooiwsr',
        'worldStateSaver.wps',
        'worldStateSaver.helper'
    ])
    .config(function($logProvider){
        $logProvider.debugEnabled(true);
    })
    .controller('worldStateSaverCtrl', ['$q', '$scope', 'wirecloud', 'worldStateUpdater', function($q, $scope, wirecloud, worldStateUpdater) {
        $scope.worldState = null;
        $scope.knownOOIs = [ ];
        $scope.commandQueue = [ ];
        $scope.status = [ ];
        $scope.busy = false;
        $scope.autoAdvance = true;

        $scope.commandHasDisplayableText = function (command) {
            return command.command.hasOwnProperty('log');
        };

        $scope.prettyOOINames = function (ooiIds) {
            return ooiIds.map(function (ooiId) {
                if (typeof ooiId === 'object' && ooiId.hasOwnProperty('entityId'))
                    ooiId = ooiId.entityId;
                for (var i = 0; i < $scope.knownOOIs.length; i++)
                    if ($scope.knownOOIs[i].entityId == ooiId)
                        return $scope.knownOOIs[i].entityName || ooiId.toString();
                return ooiId.toString();
            });
        };

        wirecloud.on('worldstate', function(data) {
            $scope.worldState = JSON.parse(data);
            $scope.$apply();
        });
        wirecloud.on('oois', function(data) {
            $scope.knownOOIs = JSON.parse(data);
            $scope.$apply();
        });
        wirecloud.on('command', function(data) {
            $scope.commandQueue.push(JSON.parse(data));
            $scope.$apply();
        });

        $scope.finish = function () {
            $scope.status = [];
            $scope.busy = true;

            worldStateUpdater
                .finalizeWorldState($scope.worldState, $scope.commandQueue, $scope.knownOOIs)
                .then(
                function(createdWorldState) {
                    $scope.status.push('Operation complete.');
                    $scope.busy = false;

                    wirecloud.send('created_worldstate', createdWorldState);
                },
                function(errorMesg) {
                    $scope.status.push('Operation failed!');
                    $scope.status.push('Failure reason:' + (errorMesg || 'unknown'));
                    $scope.busy = false;
                },
                function(x) {
                    $scope.status.push(x.status);
                    console.info(x);
                });
        }
    }]);
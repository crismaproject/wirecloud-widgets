angular.module('worldStateInfoApp', [])
    .factory('wirecloud', function () {
        return {
            getPreference: function (name, fallback) {
                return typeof MashupPlatform !== 'undefined' ? MashupPlatform.prefs.get(name) : fallback;
            },

            on: function (event, callback) {
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.registerCallback(event, callback);
                else if (!this.hasOwnProperty('$warned' + event)) {
                    this['$warned' + event] = true;
                    var dummyFunctionName = 'wcTriggerEv_' + event;
                    console.warn('Wirecloud not detected. Use injected method window.' + dummyFunctionName + ' (event_data) to trigger this event manually manually.');
                    window[dummyFunctionName] = function(arg) {
                        callback(typeof arg === 'string' ? arg : JSON.stringify(arg));
                    };
                }
            },

            send: function (wiringName, data) {
                if (typeof MashupPlatform !== 'undefined') {
                    if (typeof data !== 'string')
                        data = JSON.stringify(data);
                    MashupPlatform.wiring.pushEvent(wiringName, data);
                } else {
                    if (!this.hasOwnProperty('$warned')) {
                        this['$warned'] = true;
                        console.warn('Wirecloud is not available. Data sent to OutputEndpoints will be sent to the console instead.');
                    }
                    console.log([wiringName, data]);
                }
            }
        }
    })
    .controller('WorldStateInfoApp', ['$scope', 'wirecloud', function ($scope, wirecloud) {
        $scope.activeSimulation = null;
        $scope.activeWorldState = null;
        $scope.allWorldStates = [ ];
        $scope.readonly = wirecloud.getPreference('readonly', false);

        $scope.prettyWorldStateName = function (worldState) {
            return worldState.name + ' (' + worldState.simulatedTime + ', #' + worldState.id + ')';
        };

        $scope.goToWorldState = function () {
            wirecloud.send('select_worldstate', $scope.activeWorldState);
        };

        wirecloud.on('simulation', function (simulation) {
            $scope.activeSimulation = JSON.parse(simulation);
            if ($scope.activeSimulation.hasOwnProperty('worldStates'))
                $scope.allWorldStates = $scope.activeSimulation.worldStates;
            if (!$scope.activeWorldState && $scope.activeSimulation.hasOwnProperty('selectedWorldState'))
                $scope.activeWorldState = $scope.activeSimulation.selectedWorldState;
            $scope.$apply();
        });

        wirecloud.on('worldstate', function (worldstate) {
            worldstate = JSON.parse(worldstate);
            if (worldstate.hasOwnProperty('$icmm'))
                worldstate = worldstate['$icmm'];

            $scope.activeWorldState = null;
            if ($scope.allWorldStates.length)
                for (var i = 0; i < $scope.allWorldStates.length; i++)
                    if ($scope.allWorldStates[i].id == worldstate.id)
                        $scope.activeWorldState = $scope.allWorldStates[i];
            if (!$scope.activeWorldState)
                $scope.activeWorldState = JSON.parse(worldstate);
            $scope.$apply();
        });
    }]);
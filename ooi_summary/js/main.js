angular.module('ooiSummary', ['ooiSummary.wirecloud'])
    .controller('OoiSummaryCtrl', ['$scope', 'wirecloud', function($scope, wirecloud) {
        $scope.areas = [
            //{ name: 'Dummy Area 1', red: 2, green: 3, yellow: 1 }
        ];
        $scope.stations = [
            //{ name: 'Station 1', ready: 2, reloading: 0, treatment: 2, rescue: 1, evacuation: 8 }
        ];
        $scope.resourceStates = [ ];

        /****************************************************************
         * WIRECLOUD BINDINGS                                           *
         ****************************************************************/
        wirecloud.on('oois', function(oois) {
            oois = JSON.parse(oois);
            var nameMap = {};
            oois.forEach(function (x) {
                nameMap[x.entityId] = x.entityName;
            });

            countPatientStatus(oois, nameMap);
            countResourceUsage(oois, nameMap);

            $scope.$apply();
        });

        function countResourceUsage(oois, ooiNameMap) {
            var stationResourceMap = {}; // map station ID -> resource status
            var states = { 'Idle': true }; // list of possible Display-States

            oois
                .filter(function (x) { return x.entityTypeId == 7 })
                .forEach(function (x) {
                    var state = null;
                    var station = null;
                    x.entityInstancesProperties.forEach(function (y) {
                        switch (y.entityTypePropertyId) {
                            case 327:// ambulance prop 327 is current state
                                state = y.entityPropertyValue;
                                break;
                            case 313:// ambulance prop ID 313 is rescue station
                                station = parseInt(y.entityPropertyValue);
                                break;
                        }
                    });
                    state = state || 'Idle';
                    station = station || 0;

                    states[state] = true;
                    if (!stationResourceMap.hasOwnProperty(station))
                        stationResourceMap[station] = {  };
                    if (!stationResourceMap[station].hasOwnProperty(state))
                        stationResourceMap[station][state] = 1;
                    else
                        stationResourceMap[station][state]++;
                });

            $scope.resourceStates = Object.keys(states);
            $scope.stations = [ ];
            for (var stationId in stationResourceMap)
                $scope.stations.push($.extend({name: ooiNameMap[stationId]}, stationResourceMap[stationId]));
        }

        function countPatientStatus(oois, ooiNameMap) {
            var areaPatientsMap = {}; // map area ID -> patient status
            oois
                .filter(function (x) { return x.entityTypeId == 10; })
                .forEach(function (x) {
                    var areaId = null;
                    var life = null;
                    var isExposed = true;
                    x.entityInstancesProperties.forEach(function (y) {
                        switch (y.entityTypePropertyId) {
                            case 42:// patient prop ID 42 is life%
                                life = parseInt(y.entityPropertyValue);
                                break;
                            case 45:// patient prop ID 45 is place id
                                areaId = parseInt(y.entityPropertyValue);
                                break;
                            case 476:// prop id 476: Patient-Is-Exposed
                                isExposed = y.entityPropertyValue;
                                break;
                        }
                    });

                    if (isExposed !== 'false' && isExposed !== 'False') {
                        if (!areaPatientsMap.hasOwnProperty(areaId))
                            areaPatientsMap[areaId] = {
                                green: 0,
                                yellow: 0,
                                red: 0
                            };
                        if (life <= 33)
                            areaPatientsMap[areaId]['red']++;
                        else if (life <= 66)
                            areaPatientsMap[areaId]['yellow']++;
                        else
                            areaPatientsMap[areaId]['green']++;
                    }
                });

            var areas = [];
            for (var areaId in areaPatientsMap) {
                var value = areaPatientsMap[areaId];
                areas.push({name: ooiNameMap[areaId], green: value.green, yellow: value.yellow, red: value.red});
            }
            $scope.areas = areas;
        }
    }]);
angular.module('ooiSummary', ['ooiSummary.wirecloud'])
    .controller('OoiSummaryCtrl', ['$scope', 'wirecloud', function($scope, wirecloud) {
        $scope.areas = [
            //{ name: 'Dummy Area 1', red: 2, green: 3, yellow: 1 }
        ];
        $scope.stations = [
            //{ name: 'Station 1', ready: 2, reloading: 0, treatment: 2, rescue: 1, evacuation: 8 }
        ];

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

            $scope.stations = oois
                .filter(function (x) { return x.entityTypeId == 8 })
                .map(function (x) { return { name: x.entityName, ready: 1, reloading: 2, treatment: 3, rescue: 4, evacuation: 5 } });

            $scope.$apply();
        });

        function countResourceUsage(oois, ooiNameMap) {
            var stationResourceMap = {}; // map station ID -> resource status
            // TODO: pending server-side implementation
        }

        function countPatientStatus(oois, ooiNameMap) {
            var areaPatientsMap = {}; // map area ID -> patient status
            oois
                .filter(function (x) { return x.entityTypeId == 10; })
                .forEach(function (x) {
                    var areaId = null;
                    var life = null;
                    x.entityInstancesProperties.forEach(function (y) {
                        switch (y.entityTypePropertyId) {
                            case 42:// patient prop ID 42 is life%
                                life = parseInt(y.entityPropertyValue);
                                break;
                            case 45:// patient prop ID 45 is place id
                                areaId = parseInt(y.entityPropertyValue);
                                break;
                        }
                    });

                    if (!areaPatientsMap.hasOwnProperty(areaId))
                        areaPatientsMap[areaId] = { green: 0, yellow: 0, red: 0 };
                    if (life <= 33)
                        areaPatientsMap[areaId]['red']++;
                    else if (life <= 66)
                        areaPatientsMap[areaId]['yellow']++;
                    else
                        areaPatientsMap[areaId]['green']++;
                });

            var areas = [];
            for (var areaId in areaPatientsMap) {
                var value = areaPatientsMap[areaId];
                areas.push({name: ooiNameMap[areaId], green: value.green, yellow: value.yellow, red: value.red});
            }
            $scope.areas = areas;
        }
    }]);
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

            $scope.areas = oois
                .filter(function (x) { return x.entityTypeId == 11 || x.entityTypeId == 8 })
                .map(function (x) { return { name: x.entityName, green: 0, yellow: 1, red: 2 } });

            $scope.stations = oois
                .filter(function (x) { return x.entityTypeId == 8 })
                .map(function (x) { return { name: x.entityName, ready: 1, reloading: 2, treatment: 3, rescue: 4, evacuation: 5 } });

            $scope.$apply();
        });
    }]);
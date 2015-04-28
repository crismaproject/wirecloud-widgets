angular.module('ooiCommand.directives', [])
    .directive('vehicleTable', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=items',
                selected: '=selected'
            },
            templateUrl: 'templates/vehicleTable.html',
            controller: [ '$scope', 'EntityNameProvider', function($scope, nameProvider) {
                $scope.nameProvider = nameProvider;

                $scope.updateSelected = function () {
                    $scope.selected = $scope.items
                        .filter(function (x) { return x.hasOwnProperty('$selected') && x['$selected']; })
                        ;
                };

                $scope.stationNameFor = function (ooi) {
                    var rescueStation = ooiProperty(ooi, 313);
                    return rescueStation ? nameProvider.get(rescueStation.entityPropertyValue) : null;
                };
            } ]
        }
    });
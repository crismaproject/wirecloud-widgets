angular.module('ooiCommand.directives', [])
    .directive('vehicleTable', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=items',
                selected: '=selectedItems'
            },
            templateUrl: 'templates/vehicleTable.html',
            controller: [ '$scope', 'EntityNameProvider', function($scope, nameProvider) {
                $scope.selected = [];
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

                $scope.activityFor = function (ooi) {
                    var property = ooiProperty(ooi, 327);
                    return property == null || !property.entityPropertyValue ? 'Idle' : property.entityPropertyValue;
                };

                $scope.cssClassFor = function (ooi) {
                    var property = ooiProperty(ooi, 327);
                    return property == null || !property.entityPropertyValue ? 'idle' : property.entityPropertyValue.toLowerCase();
                };
            } ]
        }
    });
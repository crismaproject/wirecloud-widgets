angular.module('ooiCommand.directives', [])
    .directive('vehicleTable', function () {
        return {
            restrict: 'E',
            scope: {
                items: '=items',
                selected: '=selected'
            },
            templateUrl: 'templates/vehicleTable.html',
            controller: [ '$scope', function($scope) {
                $scope.updateSelected = function () {
                    $scope.selected = $scope.items
                        .filter(function (x) { return x.hasOwnProperty('$selected') && x['$selected']; })
                        ;
                };
            } ]
        }
    });
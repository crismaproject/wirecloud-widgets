angular.module('debugListener', ['debugListener.wirecloud'])
    .constant('maxRows', 200)
    .controller('DebugListenerCtrl', ['$scope', 'wirecloud', 'maxRows', function($scope, wirecloud, maxRows) {
        $scope.entries = [];

        $scope.clear = function() {
            $scope.entries = [];
        };

        wirecloud.on('data', function(data) {
            $scope.entries.unshift({
                time: new Date(),
                data: data
            });
            while ($scope.entries.length > maxRows)
                $scope.entries.pop();
            $scope.$apply();
        });
    }]);
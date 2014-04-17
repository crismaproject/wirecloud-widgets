angular.module('debugListener', ['debugListener.wirecloud'])
    .constant('maxRows', 200)
    .controller('DebugListenerCtrl', ['$scope', 'wirecloud', 'maxRows', function($scope, wirecloud, maxRows) {
        $scope.entries = [];

        $scope.clear = function() {
            $scope.entries = [];
        };

        wirecloud.on('data', function(data) {
            if ($scope.entries.length > 0 && $scope.entries[0].data == data) {
                $scope.entries[0].times++;
                $scope.entries[0].time = new Date();
            } else {
                $scope.entries.unshift({
                    time: new Date(),
                    times: 1,
                    data: data
                });
                while ($scope.entries.length > maxRows)
                    $scope.entries.pop();
            }


            $scope.$apply();
        });
    }]);
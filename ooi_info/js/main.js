angular.module('ooiInfo', ['ooiInfo.wirecloud'])
    .controller('OoiInfoCtrl', ['$scope', 'wirecloud', function($scope, wirecloud) {
        $scope.oois = [];
        $scope.ooiTypeNames = { };
        $scope.ooiPropertyNames = { };

        $scope.hasProperties = function (ooi) {
            return ooi.entityInstancesProperties.length > 0;
        };
        $scope.hasValues = function (prop) {
            return typeof prop.entityPropertyValue !== 'string' || prop.entityPropertyValue.length;
        };

        wirecloud.on('oois', function (oois) {
            if (typeof oois === 'string')
                oois = JSON.parse(oois);

            $scope.oois = oois;
            $scope.$apply();
        });

        wirecloud.on('ooiTypes', function (ooiTypes) {
            if (typeof ooiTypes === 'string')
                ooiTypes = JSON.parse(ooiTypes);

            for (var i = 0; i < ooiTypes.length; i++) {
                var ooiType = ooiTypes[i];
                $scope.ooiTypeNames[ooiType.entityTypeId] = ooiType.entityTypeName;

                for (var j = 0; j < ooiType.entityTypeProperties.length; j++) {
                    var entityTypeProperty = ooiType.entityTypeProperties[j];
                    $scope.ooiPropertyNames[entityTypeProperty.entityTypePropertyId] = entityTypeProperty.entityTypePropertyName;
                }
            }

            $scope.$apply();
            console.log($scope.ooiTypeNames);
            console.log($scope.ooiPropertyNames);
        });
    }]);
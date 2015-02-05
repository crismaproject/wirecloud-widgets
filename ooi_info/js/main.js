angular.module('ooiInfo', ['ooiInfo.wirecloud', 'ooiInfo.prettify'])
    .controller('OoiInfoCtrl', ['$scope', 'wirecloud', 'prettify', function($scope, wirecloud, prettify) {
        $scope.oois = [];
        $scope.ooiTypeNames = { };
        $scope.ooiPropertyNames = { };

        $scope.hasProperties = function (ooi) {
            return ooi.entityInstancesProperties.length > 0;
        };
        $scope.hasValues = function (prop) {
            return typeof prop.entityPropertyValue !== 'string' || prop.entityPropertyValue.length;
        };

        $scope.prettify = prettify;

        $scope.prettify.rule() // TODO: verify! seems to fail for the Vehicle-Rescue-Station property of Ambulances
            .forProperty(45)
            .forProperty(311)
            .forProperty(313)
            .thenDo(function (ooiId) {
                if (!ooiId) return null;
                var ooi = $scope.oois.find(function (x) { return x.entityId == ooiId; });
                return ooi ? ooi.entityName : null;
            })
            .useTitle(function (ooiId) {
                return 'OOI ID: ' + ooiId.toString();
            });

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
        });
    }]);
angular.module('ooiInfo', ['ooiInfo.wirecloud', 'ooiInfo.prettify'])
    .controller('OoiInfoCtrl', ['$scope', 'wirecloud', 'prettify', function($scope, wirecloud, prettify) {
        $scope.oois = [];
        $scope.ooiNames = {};
        $scope.ooiTypeNames = { };
        $scope.ooiPropertyNames = { };
        $scope.restrictedTo = [ ];

        $scope.hasProperties = function (ooi) {
            return ooi.entityInstancesProperties.length > 0;
        };
        $scope.shouldRenderProperty = function (prop) { // only render if
            return (typeof prop.entityPropertyValue !== 'string' || prop.entityPropertyValue.length) && // property instance has a value AND
                ($scope.restrictedTo.length === 0 || $scope.restrictedTo.binaryIndexOf(prop.entityTypePropertyId) !== -1); // property is in restrictedTo if restrictedTo is set
        };

        $scope.prettify = prettify;

        if (!wirecloud.getPreference('show_ids', false))
            $scope.prettify.rule()
                .forProperty(45)
                .forProperty(311)
                .forProperty(313)
                .thenDo(function (ooiId) {
                    if (!ooiId) return null;
                    return $scope.ooiNames.hasOwnProperty(ooiId) ? $scope.ooiNames[ooiId] : 'Entity #' + ooiId;
                })
                .useTitle(function (ooiId) {
                    return 'OOI ID: ' + ooiId.toString();
                });

        var onlyShow = wirecloud.getPreference('only_show', '');
        if (onlyShow)
            $scope.restrictedTo = onlyShow.split(',').map(function (x) { return parseInt(x); }).sort();

        wirecloud.on('oois_all', function (oois) {
            if (typeof oois === 'string')
                oois = JSON.parse(oois);

            var names = {};
            for (var i = 0; i < oois.length; i++)
                names[oois[i].entityId] = oois[i].entityName;

            $scope.ooiNames = names;
        });

        wirecloud.on('oois_show', function (oois) {
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
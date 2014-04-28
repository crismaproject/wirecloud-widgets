angular.module('worldStateSaver.ooiwsr', ['worldStateSaver.wirecloud'])
    .factory('ooiwsr', ['wirecloud', function (wirecloud) {
        var ooiwsrUri = wirecloud.proxyURL(wirecloud.getPreference('ooiwsr'));
        return new WorldStateRepository(ooiwsrUri);
    }]);
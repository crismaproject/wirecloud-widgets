angular.module('worldStateSaver.ooiwsr', ['worldStateSaver.wirecloud'])
    .factory('ooiwsr', ['wirecloud', function (wirecloud) {
        var ooiwsrUri = wirecloud.getPreference('ooiwsr', 'http://crisma-ooi.ait.ac.at/api');
        return new WorldStateRepository(ooiwsrUri);
    }]);
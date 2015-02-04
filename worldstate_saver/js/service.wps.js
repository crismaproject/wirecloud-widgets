angular.module('worldStateSaver.wps', ['worldStateSaver.wirecloud'])
    .factory('wps', ['wirecloud', function (wirecloud) {
        //var wpsUri = wirecloud.proxyURL(wirecloud.getPreference('wps'));
        var wpsUri = wirecloud.getPreference('wps');
        return new WPS(wpsUri, false);
    }]);
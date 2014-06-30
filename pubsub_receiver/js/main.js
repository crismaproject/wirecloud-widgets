/*global MashupPlatform*/

var ngsiUri = MashupPlatform.prefs.get('ngsi_uri');
var ngsiConnectionOptions = { ngsi_proxy_url: MashupPlatform.prefs.get('ngsi_proxy_uri') };
var entityScope = MashupPlatform.prefs.get('entity_scope');

MashupPlatform.prefs.registerCallback(function () {
    console.log('Preferences have already been applied and cannot be changed during runtime; please reload your browser to make use of the new settings.');
});

var ngsiConnection = new NGSI.Connection(ngsiUri, ngsiConnectionOptions);
var entityList = [{type: entityScope, id: '.*', isPattern: true}];
var attributeList = [];

MashupPlatform.wiring.registerCallback('query_request', function () {
    ngsiConnection.query(entityList, attributeList, {
        flat: true,
        onSuccess: function (data) {
            MashupPlatform.wiring.pushEvent('signal', typeof data !== 'string' ? JSON.stringify(data) : data);
        }
    });
});

//var duration = 'PT15M'; // FIXME: increase limit, e.g. 'PT2H'
//var throttling = 'PT10S';
//var notifyConditions = [{
//    type: 'ONCHANGE',
//    condValues: ['dataslot_OOI-worldstate-ref']
//}];

// The following will FAIL without having a NGSI proxy to begin with:
//ngsiConnection.createSubscription(entityList, attributeList, duration, throttling, notifyConditions, {
//    flat: true,
//    onNotify: function (data) {
//        console.log('NOTIFY');
//        console.log(data);
//    }
//});
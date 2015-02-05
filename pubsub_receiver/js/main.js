/*global MashupPlatform,NGSI*/

if (typeof(MashupPlatform) === 'undefined')
    throw 'MashupPlatform not found!';
else if (typeof(NGSI) === 'undefined')
    throw 'NGSI not installed!';

var ngsiUri = MashupPlatform.prefs.get('ngsi_uri');
var ngsiConnectionOptions = {
    ngsi_proxy_url: MashupPlatform.prefs.get('ngsi_proxy_uri'),
    use_user_fiware_token: true
};
var entityScope = MashupPlatform.prefs.get('entity_scope');

MashupPlatform.prefs.registerCallback(function () {
    console.log('Preferences have already been applied and cannot be changed during runtime; please reload your browser to make use of the new settings.');
});

var ngsiConnection = new NGSI.Connection(ngsiUri, ngsiConnectionOptions);
var entityList = [{type: entityScope, id: '.*', isPattern: true}];
var attributeList = [];

MashupPlatform.wiring.registerCallback('query_request', function (token) {
    ngsiConnection.query(entityList, attributeList, {
        flat: true,
        onSuccess: function (data) {
            if (token) {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                data['query_request_token'] = token;
            }
            MashupPlatform.wiring.pushEvent('signal', typeof data !== 'string' ? JSON.stringify(data) : data);
        }
    });
});

var duration = 'PT15M'; // FIXME: increase limit, e.g. 'PT2H'
var throttling = 'PT10S';
var notifyConditions = [{
    type: 'ONCHANGE',
    condValues: ['dataslot_OOI-worldstate-ref']
}];

// The following will FAIL without having a NGSI proxy to begin with:
ngsiConnection.createSubscription(entityList, attributeList, duration, throttling, notifyConditions, {
    flat: true,
    onNotify: function (data) {
        console.log('NOTIFY');
        console.log(data);
    }
});
/*global MashupPlatform*/

var ngsiConnectionOptions = {
    ngsi_proxy_url: MashupPlatform.prefs.get('ngsi_proxy_uri')
};


var ngsiConnection = new NGSI.Connection(MashupPlatform.prefs.get('ngsi_uri'), ngsiConnectionOptions);
var entityList = [{type: 'CRISMA.worldstates', id: '.*', isPattern: true}];
var attributeList = [];

ngsiConnection.query(entityList, attributeList, {
    flat: true,
    onSuccess: function (data) {
        console.log('QUERY');
        console.log(data);
    }
});

var duration = 'PT5M'; // FIXME: increase limit, e.g. 'PT2H'
var throttling = null;
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
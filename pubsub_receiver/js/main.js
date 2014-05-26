/*global MashupPlatform*/

var mySubEndPoint = new MashupPlatform.SilboPS.SubEndPoint({
    open: function(endpoint) {
        console.log('PubSub endpoint opened');
        console.log(arguments);
    },
    close: function(endpoint) {
        console.log('PubSub endpoint closed');
        console.log(arguments);
    },
    advertise: function(endpoint, advertise) {
        console.log('PubSub endpoint advertising');
        console.log(arguments);
    },
    unadvertise: function(endpoint, unadvertise) {
        console.log('PubSub endpoint unadvertising');
        console.log(arguments);
    },
    notify: function(endpoint, notification) {
        console.log('PubSub endpoint notifying');
        console.log(arguments);
    }
});

var cxtFunc = new MashupPlatform.SilboPS.ContextFunction();
var filter = new MashupPlatform.SilboPS.Filter();

mySubEndPoint.subscribe(filter, cxtFunc);

window.setTimeout(function () { mySubEndPoint.close(); }, 60000);
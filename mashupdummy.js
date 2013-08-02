/**
 * Dummy implementation for the most important functions exposed by the Wirecloud API. Calls to these functions will
 * push notifications to the JavaScript console. Methods that are expected to return data will return null.
 * @type {{prefs: {get: Function, registerCallback: Function}, wiring: {registerCallback: Function, pushEvent: Function}}}
 */
var MashupPlatform = {
    prefs: {
        /**
         * @returns {null}
         */
        get: function (name) {
            console.info('MashupPlatform.prefs.get, ' + name);
            return null;
        },
        registerCallback: function (handler) {
            console.info('MashupPlatform.prefs.registerCallback');
        }
    },
    wiring: {
        registerCallback: function (name, handler) {
            console.info('MashupPlatform.wiring.registerCallback, ' + name);
        },
        pushEvent: function (name, data) {
            console.info('MashupPlatform.wiring.pushEvent, ' + name + ', with data: ' + JSON.stringify(data));
        }
    }
};
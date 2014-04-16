angular.module('ooiCommand.wirecloud', [])
    .factory('wirecloud', function () {
        return {
            getPreference: function (name, fallback) {
                return typeof MashupPlatform !== 'undefined' ? MashupPlatform.prefs.get(name) : fallback;
            },

            on: function (event, callback) {
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.registerCallback(event, callback);
                else if (!this.hasOwnProperty('$warned' + event)) {
                    this['$warned' + event] = true;
                    var dummyFunctionName = 'wcTriggerEv_' + event;
                    console.warn('Wirecloud not detected. Use injected method window.' + dummyFunctionName + ' (event_data) to trigger this event manually manually.');
                    window[dummyFunctionName] = function(arg) {
                        callback(typeof arg === 'string' ? arg : JSON.stringify(arg));
                    };
                }
            },

            send: function (wiringName, data) {
                if (typeof MashupPlatform !== 'undefined') {
                    if (typeof data !== 'string')
                        data = JSON.stringify(data);
                    MashupPlatform.wiring.pushEvent(wiringName, data);
                } else {
                    if (!this.hasOwnProperty('$warned')) {
                        this['$warned'] = true;
                        console.warn('Wirecloud is not available. Data sent to OutputEndpoints will be sent to the console instead.');
                    }
                    console.log([wiringName, data]);
                }
            }
        }
    });
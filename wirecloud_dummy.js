/**
 * This little file partially emulates Wirecloud's public API to some degree.
 *
 * Things that work:
 * <ul>
 *     <li><code>MashupPlatform.http.buildProxyURL</code>: returns the specified URL without any change</li>
 *     <li><code>MashupPlatform.http.makeRequest</code>: only works for GET requests and requires jQuery</li>
 *     <li><code>MashupPlatform.prefs.get</code>: return nothing until set</li>
 *     <li><code>MashupPlatform.prefs.registerCallback</code></li>
 *     <li><code>MashupPlatform.prefs.set</code></li>
 *     <li><code>MashupPlatform.widget.id</code>: is hardcoded to <code>widget001</code></li>
 *     <li><code>MashupPlatform.widget.log</code>: relays message to <code>console.log</code></li>
 *     <li><code>MashupPlatform.wiring.pushEvent</code></li>
 *     <li><code>MashupPlatform.wiring.registerCallback</code></li>
 * </ul>
 *
 * Any other public methods are defined but have no effect and no return value. If you intend to use this for
 * local development of widgets, you can check if <code>MashupPlatform.dummy</code> is defined and truthy; this
 * file sets it to <code>true</code>.
 *
 * Note that <em>undocumented</em> (ie. non-public) methods of Wirecloud's API are not mocked; for instance,
 * `MashupPlatform.wiring.getReachableEndpoints` is not defined by this mockup (but exists in Wirecloud's "live"
 * API and is, for instance, used by CRISMA's `debug_pusher` widget to determine if/what gadgets are connected to
 * it.
 *
 * Whenever preferences are set, they are persisted in the HTML5 sessionStorage, if it is available.
 *
 * Any method-level documentation here is directly taken from http://conwet.fi.upm.es/wirecloud/widgetapi; some minor
 * corrections and abbreviations have been applied where appropriate.
 *
 * @author Manuel Warum (manuel.warum.fl@ait.ac.at)
 * @version 1.0
 */

(function(){
    if (typeof MashupPlatform === 'undefined') {
        /**
         * @private
         * @param {*} root
         * @param {string} methodName
         * @param {*?} returnValue
         */
        function notImpl(root, methodName, returnValue) {
            root[methodName] = function () {
                console.warn(root.toString + '.' + methodName + ' is not implemented!');
                return returnValue;
            }
        }

        /**
         * @private
         * @param {Storage} storage
         */
        function loadPreferencesFromStorage(storage) {
            var preferenceData = storage.getItem('preferences');
            if (preferenceData) {
                console.log('Loading preferences from storage.');
                preferences = JSON.parse(preferenceData);
            }
        }

        /**
        * @private
        * @param {Storage} storage
        */
        function savePreferencesToStorage(storage) {
            if (preferences !== { }) {
                console.log('Saving preferences to storage.');
                storage.setItem('preferences', JSON.stringify(preferences));
            }
        }

        console.warn('MashupPlatform was not found; creating dummy environment!');

        var callbacks = { };
        var preferences = { };
        var prefCallbacks = [ ];

        //noinspection JSUndeclaredVariable
        MashupPlatform = {
            /** If true and defined, this property indicates that the object is a mock-up. */
            dummy: true,

            /** HTTP utility functions */
            http: {
                /**
                 * Builds a URL suitable for working around the cross-domain problem.
                 * This usually is handled using the wirecloud proxy but it also can be handled using the access
                 * control request headers if the browser has support for them. If all the needed requirements are
                 * meet, this function will return a URL without using the proxy.
                 * @param {string} url is the target URL
                 * @param {*?} options is an object with request options
                 * @returns {string}
                 */
                buildProxyURL:
                    function (url, options) {
                        return url;
                    },
                /**
                 * Sends a HTTP request.
                 * Note that the mockup version of this method can ONLY dispatch GET requests and will absolutely ignore
                 * any options that were specified.
                 * @param {string} url is the target URL
                 * @param {*?} options is an object with request options
                 */
                makeRequest:
                    function (url, options) {
                        console.warn('MashupPlatform.http.makeRequest has only limited support! I can only GET.');
                        $.get(url)
                            .done(function (response) {
                                if (options && options.hasOwnProperty('onSuccess'))
                                    options.onSuccess(response);
                            })
                            .fail(function () {
                                if (options && options.hasOwnProperty('onFailure'))
                                    options.onFailure();
                            })
                            .always(function () {
                                if (options && options.hasOwnProperty('onComplete'))
                                    options.onComplete(response);
                            });
                    }
            },
            /** Inter-gadget communication. */
            wiring: {
                /**
                 * Sends an event through the wiring.
                 * @param {string} outputName is the name of the output endpoint as defined in the WDL
                 * @param {string} data is the content of the event
                 */
                pushEvent:
                    function (outputName, data) {
                        if (callbacks.hasOwnProperty(outputName))
                            callbacks[outputName](data);
                    },
                /**
                 * Registers a callback for a given input endpoint. If the given endpoint already has registered a
                 * callback, it will be replaced by the new one.
                 * @param {string} inputName is the name of the input endpoint as defined in the WDL
                 * @param {function} callback is the callback function to use when an event reaches the given input endpoint.
                 */
                registerCallback:
                    function (inputName, callback) {
                        callbacks[outputName] = callback;
                    }
            },
            /** Preferences */
            prefs: {
                /**
                 * Retrieves the value of a preference.
                 * @param {string} key is the preference to fetch.
                 * @returns {*}
                 */
                get:
                    function (key) {
                        return preferences[key];
                    },
                /**
                 * Sets the value of a preference.
                 * @param {string} key is the identifier of the preference.
                 * @param {*} value is the new value to use for the preference.
                 */
                set:
                    function (key, value) {
                        preferences[key] = value;
                        for (var i = 0; i < prefCallbacks.length; i++)
                            prefCallbacks[i]({key: value});
                    },
                /**
                 * Registers a callback to listen for preference changes.
                 * @param {function} callback is the callback function that will be called when the preferences of the widget change.
                 */
                registerCallback:
                    function (callback) {
                        prefCallbacks.push(callback);
                    }
            },
            widget: {
                /**
                 * @constant
                 * @default 'widget001'
                 * @type {string}
                 */
                id: 'widget001',
                /**
                 * Writes a message into Wirecloud's log console.
                 * @param {string} msg is the text of the message to log.
                 * @param {*} level is an optional parameter indicating the message's level of severity.
                 */
                log:
                    function (msg, level) {
                        console.log(msg);
                    }
            }
        };

        notImpl(MashupPlatform.widget, 'getVariable', '');
        notImpl(MashupPlatform.widget, 'drawAttention');

        loadPreferencesFromStorage(sessionStorage);
        $(window).unload(function () { savePreferencesToStorage(sessionStorage); });
    }
}());
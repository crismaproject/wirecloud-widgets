/*global MashupPlatform*/

var activeWorldState = null;
var knownOOIs = [ ];
var commandQueue = [ ];

/**
 * A prototype ("default") instance of a world state that is used to fill in missing properties for generated ones.
 * @const
 * @type {{simulationId: number, worldStateParentId: null, description: string, dateTime: string}}
 */
var emptyWorldState = {
    "simulationId": null,
    "worldStateParentId": null,
    "description": "",
    "dateTime": null
};

var api = null;
var wpsUri = null;
var applyPreferences = function () {
    function proxify(uri) {
        return MashupPlatform.http.buildProxyURL(uri);
    }

    api = new WorldStateRepository(MashupPlatform.prefs.get('api'));
    wpsUri = proxify(MashupPlatform.prefs.get('wps'));
};

/**
 * This function should notify the rest of the application that data has been sent to the OOI-WSR.
 * @param {{worldState: Object, affectedOois: Object[]}} data
 * @private
 */
var pushNotification = function (data) { console.log(data); };
var log = function (message) { console.log(message); };

if (typeof MashupPlatform !== 'undefined') { // only apply wirings iff the MashupPlatform is available. Otherwise it's likely a local test.
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate', function (data) {
        activeWorldState = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('oois', function (data) {
        knownOOIs = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('command', function (data) {
        var command = JSON.parse(data);
        commandQueue.push(command);
    });

    pushNotification = function () {
        MashupPlatform.wiring.pushEvent('created_worldstate', JSON.stringify(this));
    };

    log = function (message) {
        MashupPlatform.widget.log(message);
    };
}

$(function () {
    // hide the initial containers
    $('#errorContainer, #notificationContainer, #statusContainer').hide();

    // when 'save' is clicked, begin with the (rather complex) update process
    $('#saveBtn').click(function () {
        var $btn = $(this);
        $btn.animDisable();

        sanityCheck();
        $('#statusContainer').show(150);
        saveWorldState().then(
            function() {
                $('#notificationContainer').animText('Done!');
                pushNotification(this);
                log('New world state has been saved successfully.');
            }, // on success
            function() {
                $('#errorContainer').animText('Failed to update OOI-WSR!');
                log('New world state could not be saved.');
            }, // on failure
            function(status) { // on progress
                var text = status.progress ? status.message + ' (' + status.progress + ')' : status.message;
                $('#statusContainer').text(text);
            })
            .always(function() {
                $btn.animEnable();
                $('#statusContainer').delay(5000).hide(500);
            });
    });
});

/**
 * This function does brief pre-flight checks before it sends data to the OOI-WSR.
 * @private
 */
function sanityCheck() {
    if (!api) throw 'No OOI-WSR REST API URI defined.';
    if (!wpsUri) throw 'No WPS API URI defined.';
    if (!activeWorldState) throw 'No active WorldState.';
}

/**
 * This function is the main entry-point for sending the created worldstate and its OOIs.
 * @returns {jQuery.Promise}
 */
function saveWorldState() {
    /**
     * Returns true iff the specified OOI is new and possibly unknown to the OOI-WSR
     * @param {object} ooi the OOI to inspect
     * @returns {boolean} true iff the entity is new and thus has no proper ID
     * @nosideeffects
     */
    function isNewOOI (ooi) { return !ooi.hasOwnProperty('entityId') || ooi.entityId < 0; }

    /**
     * Returns true iff the specified OOI is already known to the OOI-WSR
     * @param {object} ooi the OOI to inspect
     * @returns {boolean} true iff the entity should already exist on the OOI-WSR
     * @nosideeffects
     */
    function isEstablishedOOI (ooi) { return !isNewOOI(ooi); }

    /**
     * Performs a POST Ajax request to the specified server, sending the specified data as a JSON-encoded string.
     * @param {string} uri the remote server's address
     * @param {*} data the object to encode as JSON and send to the server.
     * @returns {jQuery.Promise}
     */
    function postPayload(uri, data) {
        return $.ajax({
            contentType: 'application/json',
            data: JSON.stringify(data),
            processData: false,
            type: 'POST',
            url: uri
        });
    }

    /**
     * @param {object[]} oois all OOIs belonging to the current world state.
     * @param {object[]} commands an array of commands that are to be applied to the specified OOIs.
     * @returns {object[]} an array of OOIs with their data updated.
     */
    function applyCommands(oois, commands) {
        var ooiMappings = { };
        oois
            .filter(function (x) { return x.hasOwnProperty('_replacedByEntityId'); })
            .forEach(function (x) { ooiMappings[x.entityId] = x._replacedByEntityId; });

        commands
            .filter(function (x) { return x.affected.length && x.command.hasOwnProperty('setProperties') })
            .forEach(function(command) {
                command.affected.forEach(function(affectedId) {
                    if (affectedId < 0) // target is a newly created OOI. Look up the ID
                        affectedId = ooiMappings[affectedId];
                    var changes = command.command.setProperties;
                    for (var key in changes) {
                        var value = changes[key];
                        if (typeof value === 'number' && value < 0)
                            value = ooiMappings[value];
                        else if (typeof value === 'string')
                            value = value.replace(/^-[1-9][0-9]*$/, function (v) {
                                return ooiMappings[parseInt(v)];
                            });
                        setProperty(oois, affectedId, key, value);
                    }
                });
            });

        return oois;
    }

    /**
     * Applies a property change to an OOI contained in an array of OOIs. This means that it will either update
     * the value if it already exists, or create it if it wasn't previously set.
     * @param {object[]} oois all OOIs belonging to the current world state.
     * @param {number} ooiIndex the index of the OOI to apply the new value to.
     * @param {number} key the property's key
     * @param {string|number} value the property's new value
     */
    function setProperty(oois, ooiIndex, key, value) {
        // Note: passing in the array and the according index is required here since arrays are the only type that
        // are passed by reference (and we want that)

        var index = -1;
        for (var i = 0; index == -1 && i < oois[ooiIndex].entityInstancesProperties.length; i++)
            if (oois[ooiIndex].entityInstancesProperties[i].entityTypePropertyId == key)
                index = i;

        if (index != -1)
            oois[ooiIndex].entityInstancesProperties[index].entityTypePropertyId = value;
        else
            oois[ooiIndex].entityInstancesProperties.push({entityTypePropertyId: key, entityPropertyValue: value});
    }

    /**
     * Creates a new derived world state that is a subordinate of the current world state.
     * @nosideeffects
     * @returns {jQuery.Promise}
     */
    function createWorldState(commands) {
        var stringifiedCommands = commands
            .filter(function(x) { return x.command.hasOwnProperty('log'); })
            .map(function(x) { return x.command.log; });

        var worldStateObj = $.extend({}, emptyWorldState, {
            simulationId: activeWorldState.simulationId,
            worldStateParentId: activeWorldState.worldStateId,
            dateTime: activeWorldState.dateTime,
            description: stringifiedCommands.join('; ')
        });

        console.log(worldStateObj);
        return api.insertWorldState(worldStateObj);
        //return $.post(api + '/WorldState', worldStateObj);
    }

    /**
     * Notifies the OOI-WSR of all newly created OOIs.
     * Entities that were updated in this way will receive a new property named _replacedByEntityId that contains
     * the ID of the newly created entity instance. The created instance with the proper ID will also be added
     * to the oois array and should be known to the OOI-WSR in future requests.
     * @param {object[]} oois all OOIs belonging to the current world state.
     * @returns {jQuery.Promise[]}
     */
    function createNewOOIs(oois) {
        return oois
            .filter(isNewOOI)
            .map(function (x) {
                var deferred = $.Deferred();
                api.insertEntity({
                    entityName: x.entityName || 'New OOI',
                    entityTypeId: x.entityTypeId || 14,
                    entityDescription: x.entityDescription || ''
                }).then(function (entity) {
                        x._replacedByEntityId = entity.entityId;
                        oois.push(entity);
                        deferred.resolve();
                    }, deferred.reject);
                return deferred.promise();
            });
    }

    /**
     * Sends all properties to the OOI-WSR for the specified OOIs and the specified world state.
     * @param {number} worldStateId the world state's unique identifier
     * @param {object[]} oois all OOIs belonging to the current world state.
     * @returns {jQuery.Promise}
     */
    function createOOIPropertiesUpdates(worldStateId, oois) {
        var updates = oois
            .filter(function (x) { return x.hasOwnProperty('entityInstancesProperties') && x.entityInstancesProperties.length; })
            .map(function (ooi) {
                return ooi.entityInstancesProperties.map(function (x) {
                    return {
                        entityId: ooi.entityId,
                        entityTypePropertyId: x.entityTypePropertyId,
                        entityPropertyValue: x.entityPropertyValue,
                        worldStateId: worldStateId
                    }
                });
            }).flatten();

        return api.insertEntityProperties(updates);
    }

    /**
     * Sends all geometries to the OOI-WSR for the specified OOIs and the specified world state.
     * @param {number} worldStateId the world state's unique identifier
     * @param {object[]} oois all OOIs belonging to the current world state.
     * @returns {jQuery.Promise}
     */
    function createOOIGeometryUpdates(worldStateId, oois) {
        var updates = oois
            .filter(function (x) { return x.hasOwnProperty('entityInstancesGeometry') && x.entityInstancesGeometry.length; })
            .map(function (ooi) {
                var entityInstanceGeometry = ooi.entityInstancesGeometry[0];
                return {
                    entityId: ooi.entityId,
                    worldStateId: worldStateId,
                    geometry: {
                        geometry: {
                            coordinateSystemId: 4326,
                            wellKnownText: entityInstanceGeometry.geometry.geometry.wellKnownText
                        }
                    }
                };
            }).flatten();

        return api.insertEntityGeometries(updates);
    }

    /**
     * Notifies the WPS that a new world state has been created.
     * @param {number} worldStateId the world state's unique identifier
     * @param {object?} options additional information for the WPS as to how the created data should be handled.
     * @param {number} options.duration
     * @param {number} options.stepDuration
     * @returns {jQuery.Promise}
     */
    function notifyWPS(worldStateId, options) {
        options = $.extend({ duration: 10, stepDuration: 10 }, options);
        var uri = wpsUri + '?service=WPS&request=Execute&version=1.0.0&identifier=AgentsResourceModel&datainputs=WorldStateId=' + worldStateId + ';duration=' + options.duration + ';stepduration=' + options.stepDuration;
        var deferredResult = $.Deferred();

        $.get(uri)
            .then(function(response) {
                if (!$('ProcessSucceeded', response).length)
                    deferredResult.reject();
                else {
                    var progressUri = $('Data', response).text().trim();
                    log('Getting processing status updates from: ' + progressUri);
                    var attempts = 0;
                    var timeoutId = setInterval(function () {
                        attempts++;
                        $.get(progressUri)
                            .then(function (response) {
                                deferredResult.notifyWith(this, [response]);
                                if (response.progress == '100%') {
                                    deferredResult.resolve({
                                        worldStateIds: response.worldstateids
                                    });
                                    clearInterval(timeoutId);
                                } else if (attempts >= 1000) {
                                    deferredResult.reject();
                                    clearInterval(timeoutId);
                                }
                            });
                    }, 10000);
                }
            }, deferredResult.reject);

        return deferredResult.promise();
    }

    var result = $.Deferred();
    var oois = knownOOIs;

    /**
     * Dispatches a notification to the UI signaling the current processing status.
     * @param {string?} message the message to display.
     * @param {object?} worldState the current world state.
     * @param {*?} progress
     * @returns {{}[]}
     */
    var notification = function(message, worldState, progress) {
        return [ {
            message: message || '',
            worldState: worldState || {},
            oois: oois,
            progress: progress || 0
        } ];
    };

    createWorldState(commandQueue)
        .then(function (worldState) {
            result.notifyWith(this, notification('WorldState sent to OOI-WSR', worldState));
            $.whenAll(createNewOOIs(oois)).then(function () {
                result.notifyWith(this, notification('New entities created on OOI-WSR', worldState));
                oois = applyCommands(oois, commandQueue);
                $.when( createOOIPropertiesUpdates(worldState.worldStateId, oois.filter(isEstablishedOOI)),
                        createOOIGeometryUpdates(worldState.worldStateId, oois.filter(isEstablishedOOI)))
                    .then(function () {
                        result.notifyWith(this, notification('Entity properties updated', worldState));
                        notifyWPS(worldState.worldStateId)
                            .then(
                            function () { result.resolveWith(worldState); }, // all ok
                            function () { result.reject(); },                // something failed
                            function (status) {
                                result.notifyWith(this, notification('Processing on remote service', worldState, status.progress));
                            } // progess report
                        )
                    }, result.reject);
            }, result.reject);
        }, result.reject);

    return result.promise();
}

jQuery.extend({
    /**
     * @param {jQuery.Promise[]} array
     */
    whenAll: function(array) {
        var deferred = new $.Deferred();
        var remaining = array.length;
        for (var i = 0; i < array.length; i++)
            array[i].then(function () {
                if (--remaining == 0) deferred.resolve();
            }, deferred.reject);
        return deferred.promise();
    }
});

/**
 * Flattens the first dimension of the specified array, ie. a 2-dimensional array will become 1-dimensional by
 * concatenating all values, a 3-dimensional will become 2-dimensional, etc.
 * @nosideeffects
 * @returns {Array}
 * @example [[1,2], [3,4]].flatten(); // returns [1,2,3,4]
 */
Array.prototype.flatten = function() {
    var result = [];
    for (var i = 0; i < this.length; i++)
        result = result.concat(this[i]);
    return result;
};
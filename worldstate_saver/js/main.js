/*global MashupPlatform*/

var activeWorldState = null;
var knownOOIs = { };
var commandQueue = [ ];

/**
 * A prototype ("default") instance of a worldstate that is used to fill in missing properties for generated ones.
 * @const
 * @type {{simulationId: number, worldStateParentId: null, description: string, dateTime: string}}
 */
var emptyWorldState = {
    "simulationId": 12,
    "worldStateParentId": null,
    "description": "",
    "dateTime": "2012-01-01T12:06:09.897"
};

/**
 * A prototype ("default") instance of an object of interest that is used to fill in missing properties for generated ones.
 * @const
 * @type {{entityTypeId: number, entityName: string, entityDescription: string, entityInstancesProperties: Array, entityInstancesGeometry: Array}}
 */
var emptyOOI = {
    "entityTypeId": 0,
    "entityName": "",
    "entityDescription": "",
    "entityInstancesProperties": [],
    "entityInstancesGeometry": []
};

var apiUri = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
};

/**
 * This function should notify the rest of the application that data has been sent to the OOI-WSR.
 * @param {{worldState: Object, affectedOois: Object[]}} data
 * @private
 */
var pushNotification = function (data) { console.log(data); }

if (typeof MashupPlatform !== 'undefined') { // only apply wirings iff the MashupPlatform is available. Otherwise it's likely a local test.
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate', function (data) {
        activeWorldState = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('oois', function (data) {
        knownOOIs = JSON.parse(data).toDict('entityId');
    });

    pushNotification = function (data) {
        // TODO: Write to OOI-WSR
        // then:
        MashupPlatform.wiring.pushEvent('created_worldstate', JSON.stringify(created.worldState));
    }
}

$(function () {
    $('#errorContainer, #notificationContainer').hide();

    $('#saveBtn').click(function () {
        $(this).animDisable();
        try {
            sanityCheck();
            var created = saveWorldState();
            pushNotification(created);
            $('#notificationContainer').animText('Done!');
        } catch (e) {
            $(this).animFlashRed();
            $('#errorContainer').animText(e.message || e);
        } finally {
            $(this).animEnable();
        }
    });
});

/**
 * This function does brief pre-flight checks before it sends data to the OOI-WSR.
 * @private
 */
function sanityCheck() {
    if (activeWorldState == null) throw 'No active WorldState';
}

/**
 * This function is the main entry-point for sending the created worldstate and its OOIs.
 * @returns {{worldState: Object, affectedOois: Object[]}}
 */
function saveWorldState() {
    var createdWorldState = sendWorldState();
    var affected = sendOOIs(createdWorldState);
    return { worldState: createdWorldState, affectedOois: affected };
}

/**
 * This function creates the new worldstate and posts it to the OOI-WSR.
 * @private
 * @returns {{worldStateId: Number, simulationId: Number, worldStateParentId: Number, dateTime: *, description: String}}
 */
function sendWorldState() {
    var worldStateObj = $.extend({}, emptyWorldState, {
        simulationId: activeWorldState.simulationId,
        worldStateParentId: activeWorldState.worldStateId,
        dateTime: activeWorldState.dateTime
    });
    // TODO: POST to WSR and read the response (which includes the new ID; for now, assume an arbitrary number)
    worldStateObj.worldStateId = 179;
    return worldStateObj;
}

/**
 * This function modifies and creates OOI instances based on stored commands, then sends them to the OOI-WSR.
 * @private
 * @param {object} worldState the worldstate instance
 * @param {Number} worldState.worldStateId the worldstate's identifier (as provided by the OOI-WSR)
 */
function sendOOIs(worldState) {
    var affected = { };
    for (var i = 0; i < commandQueue.length; i++) {
        var command = commandQueue[i];
        for (var j = 0; j < command.affected.length; j++) {
            var affectedOoiId = command.affected[j];
            //var existsOnRemote = affected.hasOwnProperty(affectedOoiId) || knownOOIs.hasOwnProperty(affectedOoiId);
            var affectedOoi = affected.hasOwnProperty(affectedOoi) ? affected[affectedOoiId] : knownOOIs[affectedOoiId];

            // TODO: finish processing, then..

            affected[affectedOoiId] = affectedOoi;
        }
    }

    if (affected.length) {
        // TODO: Now we can write all changes to the OOI-WSR
    }
    return affected;
}

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is the first
 * element of the original array sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.toDict = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = obj;
    }

    return groups;
};
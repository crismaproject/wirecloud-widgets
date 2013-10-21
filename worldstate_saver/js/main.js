/*global MashupPlatform*/

var activeWorldState = null;
var knownOOIs = { };
var commandQueue = [ ];

var apiUri = null;
var applyPreferences = function () {
    apiUri = MashupPlatform.prefs.get('api');
};

if (typeof MashupPlatform !== 'undefined') {
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate', function (data) {
        activeWorldState = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('oois', function (data) {
        knownOOIs = JSON.parse(data).toDict('entityId');
    });
}

$(function () {
    $('#saveBtn').click(function () {
        $(this).attr('disabled', 'disabled');
        try {
            saveWorldState();
        } finally {
            $(this).removeAttr('disabled');
        }
    });
});

function saveWorldState() {
    var createdWorldState = sendWorldState();
    sendOOIs();
}

function sendWorldState() {
    var worldStateObj = {
        worldStateId: -1,
        simulationId: activeWorldState.simulationId,
        worldStateParentId: activeWorldState.worldStateId,
        dateTime: activeWorldState.dateTime
    };
    console.log(worldStateObj); // TODO: Send to OOI-WSR
    return worldStateObj;
}

function sendOOIs() {
    for (var i = 0; i < commandQueue.length; i++) {
        var command = commandQueue[i];
        // TODO: Process command
        // TODO: Newly generated OOIs should be processed first and put into knownOOIs as soon as they have an ID
    }
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
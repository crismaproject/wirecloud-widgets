/*global MashupPlatform*/

var activeWorldState = null;
var knownOOIs = { };
var commandQueue = [ ];

var emptyWorldState = {
    "simulationId": 12,
    "worldStateParentId": null,
    "description": "",
    "dateTime": "2012-01-01T12:06:09.897"
};

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
var pushData = function (data) { console.log(data); }

if (typeof MashupPlatform !== 'undefined') {
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate', function (data) {
        activeWorldState = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('oois', function (data) {
        knownOOIs = JSON.parse(data).toDict('entityId');
    });

    pushData = function (data) {
        // TODO: Write to OOI-WSR
        // then:
        MashupPlatform.wiring.pushEvent('created_worldstate', JSON.stringify(created.worldState));
    }
}

$(function () {
    $('#errorContainer, #notificationContainer').hide();

    $('#saveBtn').click(function () {
        $(this)
            .finish()
            .attr('disabled', 'disabled')
            .animate({opacity:.25}, 500);
        try {
            sanityCheck();
            var created = saveWorldState();
            pushData(created);
            showText('#notificationContainer', 'Done!')
        } catch (e) {
            $(this)
                .animate({opacity:1, backgroundColor: 'rgb(185, 74, 72)', borderColor: 'rgb(175, 54, 42)'}, { duration: 500 })
                .delay(2500)
                .animate({backgroundColor: 'rgb(66, 139, 202)', borderColor: 'rgb(56, 119, 172)'}, { duration: 500 });
            showText('#errorContainer', e.message || e);
        } finally {
            $(this)
                //.finish()
                .removeAttr('disabled')
                .animate({opacity:1}, 250);
        }
    });
});

function sanityCheck() {
    if (activeWorldState == null) throw 'No active WorldState';
}

function showText(where, what) {
    $(where)
        .finish()
        .hide(200)
        .text(what)
        .show({
            duration: 400,
            complete: function() {
                $(this).delay(7500).hide(400);
            }
        });
}

/**
 * @private
 * @returns {{worldState: Object, affectedOois: Object[]}}
 */
function saveWorldState() {
    var createdWorldState = sendWorldState();
    var affected = sendOOIs(createdWorldState);
    return { worldState: createdWorldState, affectedOois: affected };
}

/**
 * @private
 * @returns {object}
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
 * @private
 * @param {object} worldState
 * @param {Number} worldState.worldStateId
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
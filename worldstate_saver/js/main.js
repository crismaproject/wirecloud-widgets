/*global MashupPlatform*/

var activeWorldState = null;
var knownOOIs = [ ];
var commandQueue = [ ];

/**
 * A prototype ("default") instance of a worldstate that is used to fill in missing properties for generated ones.
 * @const
 * @type {{simulationId: number, worldStateParentId: null, description: string, dateTime: string}}
 */
var emptyWorldState = {
    "simulationId": null,
    "worldStateParentId": null,
    "description": "",
    "dateTime": "2012-01-01T12:06:09.897"
};

/**
 * A prototype ("default") instance of an object of interest that is used to fill in missing properties for generated ones.
 * @const
 * @type {{entityTypeId: number, entityName: string, entityDescription: string}}
 */
var emptyOOI = {
    "entityTypeId": 0,
    "entityName": "",
    "entityDescription": ""
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
var pushNotification = function (data) { console.log(data); };

if (typeof MashupPlatform !== 'undefined') { // only apply wirings iff the MashupPlatform is available. Otherwise it's likely a local test.
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

    MashupPlatform.wiring.registerCallback('worldstate', function (data) {
        activeWorldState = JSON.parse(data);
    });

    MashupPlatform.wiring.registerCallback('oois', function (data) {
        knownOOIs = JSON.parse(data);
    });

    pushNotification = function () {
        MashupPlatform.wiring.pushEvent('created_worldstate', JSON.stringify(created.worldState));
    }
}

$(function () {
    $('#errorContainer, #notificationContainer').hide();

    $('#saveBtn').click(function () {
        var button = $(this);
        button.animDisable();

        sanityCheck();
        saveWorldState()
            .then(
                function()   { $('#notificationContainer').animText('Done!'); pushNotification(this); },
                function()   {        $('#errorContainer').animText('Failed to update OOI-WSR!'); })
            .always(function() {                    button.animEnable(); });

        // TODO: pushNotification(created);
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
 * @private
 * @param {{entityInstancesProperties : {entityTypePropertyId: Number}[]}} ooi
 * @param {Number} key
 * @param {String} value
 * @returns {{entityInstancesProperties : {entityTypePropertyId: Number, entityPropertyValue: String}[]}}
 */
function setProperty(ooi, key, value) {
    var index = -1;
    for (var i = 0; index == -1 && i < ooi.entityInstancesProperties.length; i++)
        if (ooi.entityInstancesProperties[i].entityTypePropertyId == key)
            index = i;

    if (index != -1)
        ooi.entityInstancesProperties[index].entityTypePropertyId = value;
    else
        ooi.entityInstancesProperties.push({entityTypePropertyId: key, entityPropertyValue: value});

    return ooi;
}

/**
 * This function is the main entry-point for sending the created worldstate and its OOIs.
 * @returns {jQuery.Deferred}
 */
function saveWorldState() {
    var worldStateObj = $.extend({}, emptyWorldState, {
        simulationId: activeWorldState.simulationId,
        worldStateParentId: activeWorldState.worldStateId,
        dateTime: activeWorldState.dateTime
    });
    var ooiSnapshot = knownOOIs.toDict('entityId');
    var deferredResult = new jQuery.Deferred();

    $.post(apiUri + '/WorldState', worldStateObj)
        .then(function (data) {
            worldStateObj = data;
            console.log('WorldState created with ID ' + worldStateObj.worldStateId);

            var i, key;

            for (i = 0; i < commandQueue.length; i++) {
                var command = commandQueue[i];
                for (var j = 0; j < command.affected.length; j++) {
                    var affectedOoi = ooiSnapshot[command.affected[j]];

                    affectedOoi.worldStateId = worldStateObj.worldStateId;
                    if (command.setProperty)
                        for (key in command.setProperties)
                            setProperty(affectedOoi, key, command.setProperties[key]);
                }
            }

            var updateData = [ ];
            for (key in ooiSnapshot) {
                var ooi = ooiSnapshot[key];
                for (i = 0; i < ooi.entityInstancesProperties.length; i++)
                    {
                        var entityInstancesProperty = ooi.entityInstancesProperties[i];
                        updateData.push({
                                                entityId: ooi.entityId,
                                                entityTypePropertyId: entityInstancesProperty.entityTypePropertyId,
                                                entityPropertyValue: entityInstancesProperty.entityPropertyValue,
                                                worldStateId: worldStateObj.worldStateId
                                            });
                    }
            }

            console.log('Pushing OOI updates');
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(updateData),
                processData: false,
                type: 'POST',
                url: apiUri + '/EntityProperties'
            }).then(
                function () { deferredResult.resolveWith({ worldState: worldStateObj, oois: ooiSnapshot }); },
                function () { deferredResult.rejectWith ({ worldState: worldStateObj }); }
            );
        }, function () {
            deferredResult.reject();
        });

    return deferredResult;
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
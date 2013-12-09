/** @private */
var entityTypes = { }, objectsOfInterest = { }, pendingCommand = null;
/**
 * @private
 * @const
 * */
var uiStyle = {
    btnClass: 'btn btn-default btn-sm'
};

var sequence = 1;

/**
 * Sets which Objects of Interest are displayed in the UI.
 * @param {Array} oois
 */
function setObjectsOfInterest(oois) {
    objectsOfInterest = oois.only(isCommandable).group('entityTypeId');
    rebuildUI();
}

/**
 * Sets which types of Objects of Interest exist. This essentially allows to translate object type identifiers into
 * names that can be shown in the UI.
 * @param {Array} types
 */
function setObjectsOfInterestTypes(types) {
    entityTypes = types.toDict('entityTypeId');
}

/**
 * Sets if buttons attached to OOI groups are enabled.
 * If true, all buttons will be enabled; otherwise all buttons will be disabled using the disabled HTML attribute.
 * @param {boolean} areEnabled
 */
function setCommandButtonsEnabled(areEnabled) {
    if (areEnabled)
        $('button.btn-command').removeAttr('disabled');
    else
        $('button.btn-command').attr('disabled', 'disabled');
}

/**
 * If a command was pending (ie. waiting for more data it requires for execution, such as geo-coordinates),
 * it will be canceled (which resets the currently active command button, re-enables all disabled buttons, and
 * hides all help text that is currently visible).
 */
function cancelPendingCommand() {
    pendingCommand = null;
    $('button.btn-command-active').removeClass('btn-command-active');
    setCommandButtonsEnabled(true);
    $('.help:visible').hide();
}

/**
 * @private
 * @param {number} entityTypeId
 * @returns {string}
 */
function typeToName(entityTypeId) {
    return entityTypes.hasOwnProperty(entityTypeId) && entityTypes[entityTypeId].entityTypeName ? entityTypes[entityTypeId].entityTypeName : '(EntityTypeId ' + entityTypeId + ')';
}

/** @returns {string|object} */
function getMessageFor(targetType, command) {
    switch (targetType) {
        case 'point': return 'Please select a point on the map.';
        case 'ooi':
            return command.targetRestrictedTo && entityTypes.hasOwnProperty(command.targetRestrictedTo) ?
                $('<div></div>')
                    .append('Please select an OOI of type ')
                    .append($('<em></em>').text(typeToName(command.targetRestrictedTo)))
                    .append(' on the map') : 'Please select any OOI on the map.';
    }
}
/**
 * Completely rebuilds the user interface's DOM.
 */
function rebuildUI() {
    var container = $('#container').empty();

    function createFieldsetFor(groupKey, displayName) {
        var group = objectsOfInterest[groupKey];
        if (group) {
            var listing = $('<ul></ul>')
                .addClass('list-unstyled');
            for (var i = 0; i < group.length; i++) {
                var ooi = group[i];
                var ooiName = ooi.hasOwnProperty('entityName') && ooi.entityName ? ooi.entityName : '(OOI ' + ooi.entityId + ')';
                listing.append($('<li></li>')
                    .attr('data-id', ooi.entityId)
                    .text(ooiName));
            }
        }

        var commands = $('<div></div>').addClass('btn-group');
        for (var commandKey in availableCommands[groupKey]) {
            var commandBtn = $('<button></button>')
                .addClass('btn-command ' + uiStyle.btnClass)
                .attr('data-command', commandKey)
                .text(availableCommands[groupKey][commandKey].displayName || commandKey)
                .prepend($('<i></i>').addClass('ico-cmd-' + commandKey))
                .click(function () {
                    // reinitializing variables locally from the DOM to avoid problems with closure
                    var ooiType = $(this).closest('fieldset[data-type]').attr('data-type');
                    var commandKey = $(this).attr('data-command');
                    var command = availableCommands[ooiType][commandKey];

                    pendingCommand = $.extend({ entityTypeId: ooiType, command: commandKey}, command);

                    if (command.targetType) {
                        $(this).addClass('btn-command-active');
                        setCommandButtonsEnabled(false);
                        setHelp(this, getMessageFor(command.targetType, command));
                    } else {
                        executePendingWith(null);
                    }
                });

            commands.append(commandBtn);
        }

        var fieldset = $('<fieldset></fieldset>')
            .attr('data-type', groupKey)
            .append(listing)
            .append(commands)
            .append($('<div></div>').addClass('help'));

        if (displayName)
            fieldset.append($('<legend></legend>').text(displayName));

        return fieldset;
    }

    if ('*' in availableCommands)
        container.append(createFieldsetFor('*', 'General commands'));

    for (var ooiType in objectsOfInterest)
        container.append(createFieldsetFor(ooiType, typeToName(ooiType)));
}

/**
 * Sets the help text in the .help container closest to the specified scope.
 * @param {string} scope
 * @param {string} text
 */
function setHelp(scope, text) {
    var helpContainer = $('.help', $(scope).closest('fieldset'));

    if (typeof text === 'string')
        helpContainer.text(text);
    else
        helpContainer.append(text);

    if (!helpContainer.is(':visible')) helpContainer.show();
    helpContainer.focus();
}

/**
 * Returns true iff the specified OOI has an entityTypeId that has any commands attached to it.
 * @param {object} ooi the Object of Interest to test.
 * @returns {boolean} returns true iff the OOI has any commands.
 */
function isCommandable(ooi) {
    return ooi.entityTypeId in availableCommands;
}

/** @private */
function executeCommand(command, data) {
    var executedCommand = { command: command, data: data };
    var group = objectsOfInterest[command.entityTypeId];
    var affected = [ ];

    if (group)
        for (var i = 0; i < group.length; i++)
            affected.push(group[i].entityId);

    if (command.hasOwnProperty('setProperties'))
        for (var key in command.setProperties)
            command.setProperties[key] = command.setProperties[key].replace(/#\{((data|command)(\.[a-zA-Z0-9_]+|\[[0-9]+\])*)\}/g, function (x,y) {
                // TODO: evaluate potential security concerns. eval is usually bad. but it gets the job done.
                return eval(y);
            });

    var body = $('body');

    if (command.hasOwnProperty('spawnArea')) {
        var area = spawnArea(command.spawnArea, 'POINT (' + data.lat + ' ' + data.lon + ')');
        command.createOOI = area;
        body.trigger('areaCreated', area);
    }

    body.trigger('command', $.extend({ affected: affected }, executedCommand));
}

function spawnArea(areaPrototype, geometry) {
    return $.extend(true, {}, {
        'entityId': -(sequence++),
        'entityTypeId': 14,
        'entityInstancesGeometry': [
            { 'geometry': {'geometry': {'coordinateSystemId': 4326, 'wellKnownText': geometry}}}
        ]
    }, areaPrototype);
}

/**
 * Executes a pending command with the given argument.
 * @param data the command's argument, if it requires any.
 * @param {object?} options
 * @param {boolean?} options.failSilently if false, any failed validation steps will raise an exception; otherwise no
 * exceptions will be raised.
 */
function executePendingWith(data, options) {
    var defaultOptions = {
        failSilently: false
    };

    options = typeof options === 'undefined' ? defaultOptions : $.extend({}, defaultOptions, options);
    if (!pendingCommand) {
        if (!options.failSilently) throw 'No command to execute.';
        return;
    }

    var failReason;
    if (pendingCommand.targetType == 'point' && !(data instanceof Array) && data.length < 2)
        failReason = 'Command expects a point as an argument (array with two components).';
    else if (pendingCommand.targetType == 'ooi' && (!data.hasOwnProperty('ooi') || (!pendingCommand.targetRestrictedTo || data.ooi.entityTypeId != pendingCommand.targetRestrictedTo))) // fail <- target = OOI & (hasOOI -> (hasRestriction -> OOI.type = restriction.type))
        failReason = 'Command expects an OOI of type ' + pendingCommand.targetRestrictedTo;

    if (failReason) {
        if (!options.failSilently) throw failReason;
        return;
    }

    var commandData;
    if (pendingCommand.targetType == 'ooi') commandData = data.ooi;
    else commandData = data;

    executeCommand(pendingCommand, commandData);
    cancelPendingCommand();
}

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is an array of
 * elements sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.group = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = [ obj ];
        else
            groups[key].push(obj);
    }

    return groups;
};

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

/**
 * Returns only elements of the specified array that satisfy the specified predicate.
 *
 * @param {function} predicate a function that tests an element of the array and returns true iff it is to be included
 * in the returned array; otherwise it will not be included.
 * @returns {Array} an array where every element of the original array is included iff the predicate returned true.
 */
Array.prototype.only = function(predicate) {
    var newArray = [ ];
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i]))
            newArray.push(this[i]);
    return newArray;
};

$(function () {
    $(document).keyup(function (eventData) {
        if (pendingCommand && eventData.keyCode == 27)
            cancelPendingCommand();
    });
});

$(rebuildUI);
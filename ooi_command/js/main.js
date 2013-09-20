/** @private */
var entityTypes = { };
/** @private */
var objectsOfInterest = { };
/** @private */
var pendingCommand = null;

/**
 * Sets which Objects of Interest are displayed in the UI.
 * @param {Array} oois
 */
function setObjectsOfInterest(oois) {
    objectsOfInterest = oois.only(isCommandable).group('entityTypeId');
    //objectsOfInterest = group(only(oois, isCommandable), 'entityTypeId');
    rebuildUI();
}

/**
 * Sets which types of Objects of Interest exist. This essentially allows to translate object type identifiers into
 * names that can be shown in the UI.
 * @param {Array} types
 */
function setObjectsOfInterestTypes(types) {
    entityTypes = types.group('entityTypeId');
    //entityTypes = group(types, 'entityTypeId');
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
 * Completely rebuilds the user interface's DOM.
 */
function rebuildUI() {
    var container = $('#container').empty();

    for (var ooiType in objectsOfInterest) {
        var group = objectsOfInterest[ooiType];
        var displayName = ooiType in entityTypes ? entityTypes[ooiType][0].entityTypeName : 'OOI type #' + ooiType;

        var listing = $('<ul></ul>')
            .addClass('list-unstyled');
        for (var i = 0; i < group.length; i++) {
            var ooi = group[i];
            var ooiName = ooi.hasOwnProperty('entityName') && ooi.entityName ? ooi.entityName : 'OOI #' + ooi.entityId;
            listing.append($('<li></li>')
                .attr('data-id', ooi.entityId)
                .text(ooiName));
        }

        var commands = $('<div></div>').addClass('btn-group');
        for (var commandKey in availableCommands[ooiType]) {
            var command = availableCommands[ooiType][commandKey];
            var commandBtn = $('<button></button>')
                .addClass('btn btn-default btn-command')
                .attr('data-command', commandKey)
                .text(command.displayName || commandKey)
                .prepend($('<i></i>').addClass('ico-cmd-' + commandKey))
                .click(function () {
                    $(this).trigger('command', {
                        'command': command,
                        'oois': group
                    });

                    if (command.targetType) {
                        $(this).addClass('btn-command-active');

                        setCommandButtonsEnabled(false);
                        setHelp(this, 'Please select a point on the map.');
                        pendingCommand = command;
                    }
                });

            commands.append(commandBtn);
        }

        container.append($('<fieldset></fieldset>')
            .attr('data-type', group.entityTypeId)
            .append($('<legend></legend>').text(displayName))
            .append(listing)
            .append(commands)
            .append($('<div></div>').addClass('help')));
    }
}

/**
 * Sets the help text in the .help container closest to the specified scope.
 * @param {string} scope
 * @param {string} text
 */
function setHelp(scope, text) {
    var helpContainer = $('.help', $(scope).closest('fieldset'))
        .text(text)
        .focus();
    if (!helpContainer.is(':visible')) helpContainer.show();
}

/**
 * Returns true iff the specified OOI has an entityTypeId that has any commands attached to it.
 * @param {object} ooi the Object of Interest to test.
 * @returns {boolean} returns true iff the OOI has any commands.
 */
function isCommandable(ooi) {
    return ooi.entityTypeId in availableCommands;
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
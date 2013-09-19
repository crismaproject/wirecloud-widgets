var entityTypes = { };
var objectsOfInterest = { };

function setObjectsOfInterest(oois) {
    objectsOfInterest = group(only(oois, isCommandable), 'entityTypeId');
    rebuildUI();
}

function setObjectsOfInterestTypes(types) {
    entityTypes = group(types, 'entityTypeId');
}

function setCommandButtonsEnabled(areEnabled) {
    if (areEnabled)
        $('button.btn-command').removeAttr('disabled');
    else
        $('button.btn-command').attr('disabled', 'disabled');
}

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

                        $('.help', $(this).closest('fieldset'))// TODO: not working properly.. yet.
                            .text('Now please select a point on the map.');
                    }
                });

            commands.append(commandBtn);
        }

        container.append($('<fieldset></fieldset>')
            .attr('data-type', group.entityTypeId)
            .append($('<legend></legend>').text(displayName))
            .append(listing)
            .append(commands)
            .append('<div></div>').addClass('help'));
    }
}

function isCommandable(ooi) {
    return ooi.entityTypeId in availableCommands;
}

/**
 * @param {Object[]} objects
 * @param {string} keyProperty
 * @returns {{}}
 */
function group(objects, keyProperty) {
    var groups = { };

    for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = [ obj ];
        else
            groups[key].push(obj);
    }

    return groups;
}

/**
 * @param {Array} array
 * @param {function} predicate
 * @returns {Array}
 */
function only(array, predicate) {
    var newArray = [ ];
    for (var i = 0; i < array.length; i++)
        if (predicate(array[i]))
            newArray.push(array[i]);
    return newArray;
}
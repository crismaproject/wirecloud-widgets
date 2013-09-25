var GroupManager = function (container) {
    /** @private */
    this.container = container;

    /** @private */
    this.oois = [ ];

    /** @private */
    this.ooiTypes = { };
}

/** @private */
GroupManager.prototype.rebuildUI = function () {
    var container = $('tbody', this.container);
    container.empty();

    for (var i = 0; i < this.oois.length; i++) {
        var currentGroup = this.oois[i];
        var row = $('<tr></tr>')
                .attr('data-index', i);
        container.append(row);
        if (currentGroup.length > 1) {
            row
                .append($('<td></td>').text('Group'))
                .append($('<td></td>').text(currentGroup.length + ' entities'));

            for (var j = 0; j < currentGroup.length; j++) {
                container.append($('<tr></tr>')
                    .addClass('grouped')
                    .attr('data-parent-id', i)
                    .append($('<td></td>').text(currentGroup[j].entityName))
                    .append($('<td></td>').text(this.ooiTypes[currentGroup[j].entityTypeId] ? this.ooiTypes[currentGroup[j].entityTypeId].entityTypeName : '(' + currentGroup[0].entityTypeId + ')'))
                    .click(function () {
                        var parentId = $(this).attr('data-parent-id');
                        var parent = $('tr[data-index='+parentId+']', container).click();
                    }));
            }
        } else {
            row
                .append($('<td></td>').text(currentGroup[0].entityName))
                .append($('<td></td>').text(this.ooiTypes[currentGroup[0].entityTypeId] ? this.ooiTypes[currentGroup[0].entityTypeId].entityTypeName : '(' + currentGroup[0].entityTypeId + ')'));
        }

        row.click(function () {
            var clickedRow = $(this);
            var rowOoiIndex = $(this).attr('data-index');
            if (clickedRow.is('.selected')) {
                clickedRow.removeClass('selected');
                $('tr[data-parent-id')
            } else {
                clickedRow.addClass('selected');
            }
        });
    }
}

GroupManager.prototype.setOOIs = function (oois) {
    this.oois = [ ];

    for (var i = 0; i < oois.length; i++)
        this.oois.push([ oois[i] ]);

    this.rebuildUI();
}

GroupManager.prototype.setOOITypes = function (ooiTypes) {
    this.ooiTypes = ooiTypes.group('entityTypeId');
}

GroupManager.prototype.getSelected = function () {
    var selected = [ ];
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    for (var i = 0; i < scope.length; i++) {
        var index = parseInt($(scope[i]).attr('data-index'));
        selected = selected.concat(this.oois[index].flatten());
    }
    return selected;
}

GroupManager.prototype.setSelected = function (selected) {
}

GroupManager.prototype.groupSelected = function () {
    var newGroup = [ ];
    var remove = [ ];
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    for (var i = 0; i < scope.length; i++) {
        var index = parseInt($(scope[i]).attr('data-index'));
        newGroup = newGroup.concat(this.oois[index].flatten());
        remove.push(index);
    }

    if (!remove.length || !newGroup.length) return;

    for (var i = remove.length - 1; i >= 0; i--)
        this.oois.splice(remove[i], 1);
    this.oois.insertAt(remove[0], newGroup);
    this.rebuildUI();
}

GroupManager.prototype.ungroupSelected = function () {
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    var ungroup = [ ];
    for (var i = 0; i < scope.length; i++) {
        var index = parseInt($(scope).attr('data-index'));
        if (this.oois[index].length > 1)
            ungroup.push(index);
    }

    for (var i = this.oois.length - 1; i >= 0; i--)
        if (ungroup.indexOf(i) >= 0) {
            var original = this.oois.splice(i, 1)[0];
            for (var j = 0; j < original.length; j++)
                this.oois.insertAt(i + j, [ original[j] ]);
        }

    this.rebuildUI();
}

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is an array of
 * elements sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.group = function (keyProperty) {
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

Array.prototype.flatten = function () {
    var items = [ ];
    for (var i = 0; i < this.length; i++)
        items = items.concat(this[i]);
    return items;
}

Array.prototype.insertAt = function (index, item) {
    this.splice(index, 0, item);
};
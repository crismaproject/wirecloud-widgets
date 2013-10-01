var GroupManager = function (container) {
    /** @private */
    this.container = container;

    /** @private */
    this.oois = [ ];

    /** @private */
    this.ooiTypes = { };

    /** @private */
    this.skipRebuild = false;
};

/** @private */
function toggleSelection() {
    var clickedRow = $(this);
    var rowOoiIndex = $(this).attr('data-index');
    if (clickedRow.is('.selected')) {
        clickedRow.removeClass('selected');
        $('tr[data-parent-id="' + rowOoiIndex + '"]').removeClass('selectedChild');
    } else {
        clickedRow.addClass('selected');
        $('tr[data-parent-id="' + rowOoiIndex + '"]').addClass('selectedChild');
    }
}

/** @private */
GroupManager.prototype.rebuildUI = function () {
    if (this.skipRebuild) return;

    var container = $('tbody', this.container);
    container.empty();

    for (var i = 0; i < this.oois.length; i++) {
        var currentGroup = this.oois[i];
        var row = $('<tr></tr>').attr('data-index', i);
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
                    .click(function () { $('tr[data-index='+$(this).attr('data-parent-id')+']', container).click(); }));
            }
        } else {
            row
                .append($('<td></td>').text(currentGroup[0].entityName))
                .append($('<td></td>').text(this.ooiTypes[currentGroup[0].entityTypeId] ? this.ooiTypes[currentGroup[0].entityTypeId].entityTypeName : '(' + currentGroup[0].entityTypeId + ')'));
        }

        row.click(function () {
            toggleSelection.call(this);
            $(this).trigger('selectionChanged');
        });
    }
};

GroupManager.prototype.setOOIs = function (oois) {
    /* we need to remember what was grouped and selected before we replace the data with the new one.
     * it's a bit of a dirty workaround, but it will suffice for now. */
    var selected = [ ];
    var grouped = [ ];
    if (this.oois.length) {
        var selectedScope = $('tr[data-index].selected', this.container);
        for (var i = 0; i < selectedScope.length; i++) {
            var ooiGroup = this.oois[$(selectedScope[i]).attr('data-index')];
            for (var j = 0; j < ooiGroup.length; j++)
                selected.push(ooiGroup[j].entityId);
        }

        for (var i = 0; i < this.oois.length; i++) {
            if (this.oois[i].length == 1) continue;
            var group = [ ];
            for (var j = 0; j < this.oois[i].length; j++)
                group.push(this.oois[i][j].entityId);
            grouped.push(group);
        }
    }

    // now replace the old data with the new one
    this.oois = [ ];
    for (var i = 0; i < oois.length; i++)
        this.oois.push([ oois[i] ]);

    this.rebuildUI();

    function findOoiIndexByEntityId(entityId) {
        return this.oois.indexOfWhere(function (a) {
            return a.indexOfWhere(function (b) {
                return b.entityId == entityId;
            }) != -1;
        });
    }

    // now re-apply original groups..
    if (grouped.length) {
        // we 'emulate' clicking each OOI in the group so we benefit from additional logic that would not happen if we
        // just stamped the 'selected' class to each <tr>. We also skip UI rebuilding until completely done with
        // the grouping process to avoid unnecessary actions.
        this.skipRebuild = true;
        for (var i = 0; i < grouped.length; i++) {
            var group = grouped[i];
            for (var j = 0; j < group.length; j++) {
                var ooiIndex = findOoiIndexByEntityId.call(this, group[j]);
                if (ooiIndex != -1)
                    toggleSelection.call($('tr[data-index="' + ooiIndex + '"]:not(.selected)'));
            }
            this.groupSelected();
            $('tr.selected').removeClass('selected');
        }
        this.skipRebuild = false;
        this.rebuildUI();
    }

    // ..and selections
    if (selected.length) {
        for (var i = 0; i < selected.length; i++) {
            var ooiIndex = findOoiIndexByEntityId.call(this, selected[i]);
            toggleSelection.call($('tr[data-index="' + ooiIndex + '"]:not(.selected)'));
        }
    }
};

GroupManager.prototype.setOOITypes = function (ooiTypes) {
    this.ooiTypes = ooiTypes.group('entityTypeId');
};

GroupManager.prototype.getSelected = function () {
    var selected = [ ];
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    for (var i = 0; i < scope.length; i++) {
        var index = parseInt($(scope[i]).attr('data-index'));
        selected = selected.concat(this.oois[index].flatten());
    }
    return selected;
};

GroupManager.prototype.setSelected = function (selected) {
    var scope = $('tbody', this.container).find('tr[data-index]');
    for (var i = 0; i < scope.length; i++) {
        var ooiIndex = parseInt(scope[i].attr('data-index'));
        var ooi = this.oois[ooiIndex];
        var selectedIndex = selected.indexOfWhere(function (obj) {
            return obj.entityId == ooi.entityId;
        });
        if (selectedIndex >= 0 && !scope[i].hasClass('selected'))
            scope[i].addClass('selected');
        else if (selectedIndex == -1 && scope.hasClass('selected'))
            scope[i].removeClass('selected');
    }
};

GroupManager.prototype.groupSelected = function () {
    var newGroup = [ ];
    var remove = [ ];
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    if (scope.length <= 1) return;

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
};

GroupManager.prototype.ungroupSelected = function () {
    var scope = $('tbody', this.container).find('tr[data-index].selected');
    var ungroup = [ ];
    for (var i = 0; i < scope.length; i++) {
        var index = parseInt($(scope[i]).attr('data-index'));
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
};

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
};

Array.prototype.insertAt = function (index, item) {
    this.splice(index, 0, item);
};

/**
 * @param {function} predicate
 * @returns {number}
 */
Array.prototype.indexOfWhere = function (predicate) {
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i])) return i;
    return -1;
};
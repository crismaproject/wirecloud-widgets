window.ooi_wsr_uri = 'http://localhost/api';

function OOITable(container, columns) {
    /** @private */
    this.container = container;

    /** @private */
    this.columns = [ ];

    /** @private */
    this.display = { };

    /**
     * @param selected an array of selected rows
     */
    this.onSelectionChanged = null;

    if (!$('tbody', container).length) $(container).prepend($('<tbody></tbody>'));
    if (!$('thead', container).length) $(container).prepend($('<thead></thead>'));
    if (!$('thead tr', container).length) $('thead', container).append($('<tr></tr>'));

    for (var key in columns) {
        $('thead tr', container).append($('<th></th>').text(key));
        this.columns.push(columns[key]);
    }
}

/**
 *
 * @param row the row to add
 * @param {string} row.entityId the OOI's unique identifier
 * @param {string} row.entityTypeId the OOI's type
 */
OOITable.prototype.addRow = function (row) {
    var me = this;
    var tr = $('<tr></tr>')
        .attr('data-row-id', row.entityId)
        .click(function () {
            if ($(this).is('.selected'))
                $(this).removeClass('selected');
            else
                $(this).addClass('selected');
            me.updateSelectionCount();
            if (me.onSelectionChanged)
                me.onSelectionChanged(me.getSelection());
        });

    for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        var value = row[column];
        if (typeof value !== 'undefined' && this.display.hasOwnProperty(column) && this.display[column].hasOwnProperty(value))
            value = this.display[column][value];
        tr.append($('<td></td>').text(value));
    }

    tr.attr('data-orig', JSON.stringify(row));
    $('tbody', this.container).append(tr);
};

OOITable.prototype.clear = function () {
    $('tbody', this.container).empty();
    this.updateSelectionCount();
};

OOITable.prototype.unselectAll = function () {
    $('tr.selected', this.container).removeClass('selected');
    this.updateSelectionCount();
};

OOITable.prototype.selectAll = function () {
    $('tr', this.container).not('.selected').addClass('selected');
    this.updateSelectionCount();
};

OOITable.prototype.select = function (id) {
    $('tr[data-row-id="' + id + '"]', this.container).not('.selected').addClass('selected');
    this.updateSelectionCount();
};

OOITable.prototype.updateSelectionCount = function () {
    $('.selection-count').text($('tr[data-row-id].selected').length);
};

OOITable.prototype.getSelection = function () {
    var selection = [];
    $('tr.selected[data-orig]', this.container).each(function (index, value) {
        var ooi = JSON.parse($(value).attr('data-orig'));
        selection.push(ooi);
    });
    return selection;
};

function GroupManager() {
    this.groups = {};

    this.dirty = false;

    if (supportsLocalStorage()) { // HTML5 local storage available
        this.groups = localStorage.getItem('groups');
        var groupManager = this;
        $(window).unload(function () {
            if (groupManager.dirty)
                localStorage.setItem('groups', groupManager.groups);
        });
    }
}

GroupManager.prototype.get = function (groupId) {
    return groupId in this.groups ? this.groups[groupId] : [];
};

GroupManager.prototype.set = function (groupId, items) {
    this.groups[groupId] = items;
    this.dirty = true;
};

GroupManager.prototype.addTo = function (groupId, item) {
    if (!this.groups.hasOwnProperty(groupId)) this.groups[groupId] = [ item ];
    else if (this.groups[groupId].indexOf(item) != -1) return;
    else this.groups.push(item);
    this.dirty = true;
};

GroupManager.prototype.removeFrom = function (groupId, item) {
    if (!this.groups.hasOwnProperty(groupId)) return;
    var index = this.groups[groupId].indexOf(item);
    if (index == -1) return;
    this.groups[groupId].splice(index, 1);
    if (this.groups[groupId].length == 0) delete this.groups[groupId];
    this.dirty = true;
};

/**
 * Determines if HTML5 local storage is available.
 * @returns {boolean}
 */
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
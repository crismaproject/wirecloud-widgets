window.ooi_wsr_uri = 'http://localhost/api';

function OOITable(container, columns) {
    /** @private */
    this.container = container;

    /** @private */
    this.columns = [ ];

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
 * @param {string} row.id the OOI's unique identifier
 * @param {string} row.type the OOI's type
 * @param {string} row.site the OOI's current location
 */
OOITable.prototype.addRow = function(row) {
    var me = this;
    var tr = $('<tr></tr>')
        .attr('data-row-id', row.id)
        .click(function () {
            if ($(this).is('.selected'))
                $(this).removeClass('selected');
            else
                $(this).addClass('selected');
            me.updateSelectionCount();
            if (me.onSelectionChanged)
                me.onSelectionChanged(me.getSelection());
        });

    for (var i = 0; i < this.columns.length; i++)
        tr.append($('<td></td>').text(row.hasOwnProperty(this.columns[i]) ? row[this.columns[i]] : '?'));

    tr.attr('data-orig', JSON.stringify(row));
    $('tbody', this.container).append(tr);
}

OOITable.prototype.clear = function() {
    $('tbody', this.container).empty();
    this.updateSelectionCount();
}

OOITable.prototype.unselectAll = function() {
    $('tr.selected', this.container).removeClass('selected');
    this.updateSelectionCount();
}

OOITable.prototype.selectAll = function() {
    $('tr', this.container).not('.selected').addClass('selected');
    this.updateSelectionCount();
}

OOITable.prototype.select = function(id) {
    $('tr[data-row-id="'+ id +'"]', this.container).not('.selected').addClass('selected');
    this.updateSelectionCount();
}

OOITable.prototype.updateSelectionCount = function () {
    $('.selection-count').text($('tr[data-row-id].selected').length);
}

OOITable.prototype.getSelection = function () {
    var selection = [];
    $('tr.selected[data-orig]', this.container).each(function (index, value) {
        var ooi = JSON.parse($(value).attr('data-orig'));
        selection.push(ooi);
    });
    return selection;
}
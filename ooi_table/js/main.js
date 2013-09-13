window.ooi_wsr_uri = 'http://localhost/api';

function OOITable(container) {
    /** @private */
    this.container = container;

    this.onSelected = function (row) {};
}

/**
 *
 * @param row the row to add
 * @param {string} row.id the OOI's unique identifier
 * @param {string} row.type the OOI's type
 * @param {string} row.site the OOI's current location
 * @param {object?} opt additional data that gets attached to the row's markup
 */
OOITable.prototype.addRow = function(row, opt) {
    var me = this;
    var row = $('<tr></tr>')
        .attr('data-row-id', row.id)
        .append($('<th></th>').text(row.id))
        .append($('<td></td>').text(row.type || '?'))
        .append($('<td></td>').text(row.site || '?'))
        .click(function () {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            if (me.onSelected)
                me.onSelected(opt);
        });
    if (opt) row.attr('data-orig', JSON.stringify(opt));
    $('tbody', this.container).append(row);
}

OOITable.prototype.clear = function() {
    $('tbody', this.container).empty();
}

OOITable.prototype.unselectAll = function() {
    $('tr.selected', this.container).removeClass('selected');
}

OOITable.prototype.selectAll = function() {
    $('tr').not('.selected').addClass('selected');
}

OOITable.prototype.select = function(id) {
    $('tr[data-row-id="'+ id +'"]').not('.selected').addClass('selected');
}
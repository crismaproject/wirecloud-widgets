/**
 * @constructor
 * @param {string} selector
 */
function Table(selector) {
    /**
     * @const
     * @private
     */
    this.container = selector;

    $(this.container).empty().append('<thead></thead>').append('<tbody></tbody>');
}

Table.prototype.setHeaders = function () {
    $('thead', this.container).empty();
    if (arguments.length > 0) {
        var headerRow = $('<tr></tr>');
        for(var i = 0; i < arguments.length; i++)
            headerRow.append($('<th></th>').text(arguments[i]));
        $('thead', this.container).append(headerRow);
    }
}

Table.prototype.setData = function (rows) {
    $('tbody', this.container).empty();
    if (rows)
        for(var i = 0; i < rows.length; i++) {
            var dataRow = $('<tr></tr>');
            var row = rows[i];
            for(var j = 0; j < row.length; j++)
                dataRow.append($('<td></td>').text(row[j]));
            var clickHandler = function () {
                $(this).trigger('selected_row');
            };
            dataRow.click(clickHandler);
            $('tbody', this.container).append(dataRow);
        }
}

Table.prototype.setCaption = function (caption) {
    $('caption', this.container).remove();
    if (caption)
        $('caption', this.container).prepend($('<caption></caption>').text(caption));
}
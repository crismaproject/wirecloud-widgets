/**
 * Creates a new table wrapper for simple DOM manipulations.
 *
 * @constructor
 * @param {string} selector a `table` DOM element CSS selector. Note that any child elements within the table will be
 * replaced during a call to this constructor.
 */
function Table(selector) {
    /**
     * @const
     * @private
     */
    this.container = selector;

    /**
     * @const
     * @private
     */
    this.headers = [];

    /**
     * @const
     * @private
     */
    this.rows = [];

    $(this.container).empty().append('<thead></thead>').append('<tbody></tbody>');
}

/**
 * Sets the table to contain these column headers. If any existed beforehand, they will be removed.
 * @param {...String?} header Individual header column labels
 */
Table.prototype.setHeaders = function (header) {
    $('thead', this.container).empty();
    this.headers = arguments;
    if (arguments.length > 0) {
        var headerRow = $('<tr></tr>');
        for (var i = 0; i < arguments.length; i++)
            headerRow.append($('<th></th>').text(arguments[i]));
        $('thead', this.container).append(headerRow);
    }
}

/**
 * Sets the table to contain the specified data. If any existed beforehand, it will be removed.
 * Note that rows[i].length should match the number of headers.
 * @param {String[][]?} rows a 2-dimensional array containing rows and cells of rows.
 */
Table.prototype.setData = function (rows) {
    $('tbody', this.container).empty();
    this.rows = rows;
    if (rows)
        for (var i = 0; i < rows.length; i++) {
            var dataRow = $('<tr></tr>').attr('data-n', i);
            var row = rows[i];
            for (var j = 0; j < row.length; j++)
                dataRow.append($('<td></td>').text(row[j]));
            var clickHandler = function () {
                $(this).trigger('selected_row');
            };
            dataRow.click(clickHandler);
            $('tbody', this.container).append(dataRow);
        }
}

/**
 * Sets the table to contain the specified caption. If any existed beforehand, it will be removed.
 * @param {String?} caption
 */
Table.prototype.setCaption = function (caption) {
    $('caption', this.container).remove();
    if (caption)
        $('caption', this.container).prepend($('<caption></caption>').text(caption));
}
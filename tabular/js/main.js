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

    /**
     * @const
     * @private
     */
    this.caption = null;

    $(this.container).empty().append('<thead></thead>').append('<tbody></tbody>');
}

/**
 * Sets the table to contain these column headers. If any existed beforehand, they will be removed.
 * @param {...String?} header Individual header column labels (in the order they will appear).
 */
Table.prototype.setHeaders = function (header) {
    $('thead', this.container).empty();
    this.headers = arguments;
    this.update.call(this, true, false, false);
};

/**
 * Sets the table to contain the specified data. If any existed beforehand, it will be removed.
 * Note that rows[i].length should match the number of headers.
 * @param {String[][]?} rows a 2-dimensional array containing rows and cells of rows (in the order they will appear).
 */
Table.prototype.setData = function (rows) {
    this.rows = rows;
    this.update.call(this, false, true, false);
};

/**
 * Appends a new row to the end of the table.
 * @param row the row to append.
 */
Table.prototype.append = function (row) {
    this.rows.push(row);
    this.update.call(this, false, true, false);
}

/**
 * Prepends a new row to the top of the table.
 * @param row the row to prepend.
 */
Table.prototype.prepend = function (row) {
    this.rows.splice(0, 0, row);
    this.update.call(this, false, true, false);
}

/**
 * Sets the table to contain the specified caption. If any existed beforehand, it will be removed.
 * @param {String?} caption a caption to display below the table, or null to remove it.
 */
Table.prototype.setCaption = function (caption) {
    this.caption = caption;
    this.update.call(this, false, false, true);
};

/**
 * Recreates the table markup.
 * @param {boolean?} updateHeaders a flag indicating if headers should be updated (defaults to true).
 * @param {boolean?} updateRows a flag indicating if rows should be updated (defaults to true).
 * @param {boolean?} updateCaption a flag indicating if the table caption should be updated (defaults to true).
 */
Table.prototype.update = function (updateHeaders, updateRows, updateCaption) {
    if (updateHeaders === null) updateHeaders = true;
    if (updateRows === null) updateRows = true;
    if (updateCaption === null) updateCaption = true;

    // Table headers:
    if (updateHeaders) {
        $('thead', this.container).empty();
        if (this.headers.length > 0) {
            var headerRow = $('<tr></tr>');
            for (var i = 0; i < arguments.length; i++)
                headerRow.append($('<th></th>').text(arguments[i]));
            $('thead', this.container).append(headerRow);
        }
    }

    // Rows:
    if (updateRows) {
        $('tbody', this.container).empty();
        if (this.rows.length > 0)
            for (var i = 0; i < this.rows.length; i++) {
                var dataRow = $('<tr></tr>').attr('data-n', i);
                for (var j = 0; j < this.rows[i].length; j++)
                    dataRow.append($('<td></td>').text(this.rows[i][j]));
                var clickHandler = function () {
                    $(this).trigger('selected_row');
                };
                dataRow.click(clickHandler);
                $('tbody', this.container).append(dataRow);
            }
    }

    // Caption:
    if (updateCaption) {
        $('caption', this.container).remove();
        if (this.caption)
            $('caption', this.container).prepend($('<caption></caption>').text(this.caption));
    }
}